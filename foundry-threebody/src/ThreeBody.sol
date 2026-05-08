// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
   3Body Civilization Token — Ethereum deployment target
   Per-address ETH mint cap: 0.5 ether (see MAX_MINT_PER_ADDRESS)
*/

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ThreeBody is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;
    address public constant TREASURY = 0xa8aE15A2aA06ad4e03f05E17cb61831c7Ce565a6;

    uint256 public mintPrice = 0.02 ether;
    uint256 public constant MAX_MINT_PER_ADDRESS = 0.5 ether;
    uint256 public constant MAX_TOTAL_ETH = 20 ether;
    bool public tradingEnabled = false;

    enum Civilization {
        None,
        StableEra,
        ChaoticEra,
        SophonEra,
        DarkForest
    }

    struct UserStatus {
        Civilization civ;
        uint64 lastActionTime;
        uint64 danger;
        uint64 bunkerUntil;
        uint256 ethMinted;
        uint256 lastActionBlock;
    }

    mapping(address => UserStatus) public userStatus;
    mapping(address => Civilization) public civilizationOf;

    event CivilizationJoined(address indexed user, Civilization civilization);
    event Minted(address indexed user, uint256 amount, Civilization civilization);
    event BunkerDeployed(address indexed user, uint256 duration, uint256 cost);
    event DimensionalStrike(Civilization civilization, uint256 burned);
    event WarSettled(Civilization winner);
    event BroadcastActivated(Civilization civilization, string message, uint256 endTime);

    uint256 public buyTax = 3;
    uint256 public sellTax = 5;
    uint256 public constant MAX_TAX = 10;
    mapping(address => bool) public isExcludedFromTax;
    address public pair;

    mapping(address => uint256) public observationEnd;
    uint256 public observationTime = 30 minutes;
    uint256 public largeBuyThreshold = 500_000 * 1e18;
    uint256 public observationSellTax = 25;

    struct CivilizationScore {
        uint256 score;
        uint256 burns;
        uint256 volume;
    }
    mapping(uint8 => CivilizationScore) public civilizationScores;

    uint256 public warCycle = 7 days;
    uint256 public currentWarEnd;
    Civilization public lastWinner;

    struct Broadcast {
        Civilization civilization;
        uint256 endTime;
        string message;
    }
    Broadcast public activeBroadcast;

    uint256 public totalEthMinted;

    constructor() ERC20("3Body", "3BODY") Ownable(TREASURY) {
        isExcludedFromTax[TREASURY] = true;
        isExcludedFromTax[address(this)] = true;

        currentWarEnd = block.timestamp + warCycle;

        _mint(TREASURY, 150_000_000 * 1e18);
        _mint(address(this), 250_000_000 * 1e18);
    }

    function mint(Civilization civ) external payable nonReentrant {
        require(civ != Civilization.None, "Invalid civilization");
        require(civilizationOf[msg.sender] == Civilization.None, "Civilization already chosen");
        require(msg.value >= mintPrice, "Insufficient ETH");
        require(userStatus[msg.sender].ethMinted + msg.value <= MAX_MINT_PER_ADDRESS, "Exceeds per-address limit");
        require(totalEthMinted + msg.value <= MAX_TOTAL_ETH, "Exceeds total ETH limit");

        uint256 mintAmount = 100_000 * 1e18;
        require(totalSupply() + mintAmount <= MAX_SUPPLY, "Max supply reached");

        civilizationOf[msg.sender] = civ;
        userStatus[msg.sender].civ = civ;
        userStatus[msg.sender].ethMinted += msg.value;
        userStatus[msg.sender].lastActionTime = uint64(block.timestamp);

        totalEthMinted += msg.value;

        payable(TREASURY).transfer(msg.value);
        _mint(msg.sender, mintAmount);

        emit CivilizationJoined(msg.sender, civ);
        emit Minted(msg.sender, mintAmount, civ);
    }

    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }

    function setPair(address _pair) external onlyOwner {
        pair = _pair;
    }

    function setTaxes(uint256 _buyTax, uint256 _sellTax) external onlyOwner {
        require(_buyTax <= MAX_TAX && _sellTax <= MAX_TAX, "Tax too high");
        buyTax = _buyTax;
        sellTax = _sellTax;
    }

    function excludeFromTax(address user, bool state) external onlyOwner {
        isExcludedFromTax[user] = state;
    }

    /// @dev OpenZeppelin v5 token hook (replaces legacy `_transfer` override).
    function _update(address from, address to, uint256 amount) internal override {
        if (!tradingEnabled) {
            bool allowed = from == address(0) || to == address(0) || from == owner() || to == owner();
            require(allowed, "Trading disabled");
        }

        if (amount == 0) {
            super._update(from, to, 0);
            return;
        }

        uint256 taxAmount = 0;
        bool isBuy = from == pair;
        bool isSell = to == pair;

        if (!isExcludedFromTax[from] && !isExcludedFromTax[to]) {
            if (isBuy) {
                uint256 dynamicBuyTax = buyTax;
                if (civilizationOf[to] == Civilization.StableEra) dynamicBuyTax = 1;
                taxAmount = (amount * dynamicBuyTax) / 100;

                if (amount >= largeBuyThreshold) observationEnd[to] = block.timestamp + observationTime;
                civilizationScores[uint8(civilizationOf[to])].volume += amount;
            } else if (isSell) {
                uint256 dynamicSellTax = sellTax;
                if (civilizationOf[from] == Civilization.StableEra) dynamicSellTax = 2;
                if (civilizationOf[from] == Civilization.DarkForest) dynamicSellTax = 8;
                if (block.timestamp < observationEnd[from]) dynamicSellTax = observationSellTax;

                taxAmount = (amount * dynamicSellTax) / 100;
                civilizationScores[uint8(civilizationOf[from])].volume += amount;
            }
        }

        if (taxAmount > 0) {
            uint256 burnAmount = taxAmount / 2;
            uint256 treasuryAmount = taxAmount - burnAmount;

            super._update(from, address(0), burnAmount);
            super._update(from, TREASURY, treasuryAmount);

            civilizationScores[uint8(civilizationOf[from])].burns += burnAmount;
            amount -= taxAmount;
        }

        super._update(from, to, amount);

        _checkDimensionalStrike();
    }

    function deployBunker(uint64 durationInDays) external {
        require(durationInDays > 0, "Duration > 0");
        UserStatus storage status = userStatus[msg.sender];

        uint256 userBalance = balanceOf(msg.sender);
        uint256 dailyCost = (userBalance * 1) / 100_000;
        uint256 totalCost = dailyCost * durationInDays;
        require(userBalance >= totalCost, "Insufficient balance for bunker");

        _burn(msg.sender, totalCost);
        status.bunkerUntil = uint64(block.timestamp + durationInDays * 1 days);

        emit BunkerDeployed(msg.sender, durationInDays, totalCost);
    }

    function _checkDimensionalStrike() internal {
        uint256 total = totalSupply();
        if (total == 0) return;

        for (uint8 i = 1; i <= 4; i++) {
            uint256 civBalance = civilizationBalance(Civilization(i));
            uint256 share = (civBalance * 100) / total;

            if (share >= 60) {
                uint256 strikeBurn = balanceOf(address(this)) / 50;
                if (strikeBurn > 0) {
                    _burn(address(this), strikeBurn);
                    emit DimensionalStrike(Civilization(i), strikeBurn);
                }
            }
        }
    }

    /// @notice Placeholder split — indexer recommended for exact per-civilization balances.
    function civilizationBalance(Civilization) public view returns (uint256) {
        return totalSupply() / 4;
    }

    function getCivilizationName(Civilization civ) external pure returns (string memory) {
        if (civ == Civilization.StableEra) return "Stable Era";
        if (civ == Civilization.ChaoticEra) return "Chaotic Era";
        if (civ == Civilization.SophonEra) return "Sophon Era";
        if (civ == Civilization.DarkForest) return "Dark Forest";
        return "None";
    }

    function settleWar() external {
        require(block.timestamp >= currentWarEnd, "War not ended");

        uint256 highestScore = 0;
        Civilization winner = Civilization.None;

        for (uint8 i = 1; i <= 4; i++) {
            uint256 score = civilizationScores[i].burns + civilizationScores[i].volume;
            civilizationScores[i].score = score;

            if (score > highestScore) {
                highestScore = score;
                winner = Civilization(i);
            }
        }

        lastWinner = winner;
        currentWarEnd = block.timestamp + warCycle;

        emit WarSettled(winner);
    }

    function activateBroadcast(Civilization civ, string calldata message) external {
        require(balanceOf(msg.sender) >= 100_000 * 1e18, "Need more tokens");

        _burn(msg.sender, 100_000 * 1e18);

        activeBroadcast = Broadcast({civilization: civ, endTime: block.timestamp + 1 hours, message: message});

        emit BroadcastActivated(civ, message, block.timestamp + 1 hours);
    }

    function setMintPrice(uint256 price) external onlyOwner {
        mintPrice = price;
    }

    function setObservationConfig(uint256 time_, uint256 threshold_, uint256 tax_) external onlyOwner {
        observationTime = time_;
        largeBuyThreshold = threshold_;
        observationSellTax = tax_;
    }

    receive() external payable {}
}
