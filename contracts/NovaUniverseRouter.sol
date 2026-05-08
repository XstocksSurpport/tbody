// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice ETH fair mint per universe: cumulative cap 1 ETH each; all ETH forwarded to treasury.
/// @dev Deploy and set NEXT_PUBLIC_NOVA_ROUTER in the web client.
contract NovaUniverseRouter {
    address public immutable treasury;
    uint256 public constant UNIVERSE_CAP = 1 ether;
    uint8 public constant UNIVERSE_COUNT = 4;

    mapping(uint8 => uint256) public raised;
    mapping(uint8 => uint256) public mintCount;

    event UniverseMint(
        uint8 indexed universe,
        address indexed minter,
        uint256 paid,
        uint256 raisedAfter,
        uint256 mintIndexBefore
    );

    error BadUniverse();
    error BadPrice();
    error CapExceeded();
    error ForwardFailed();

    constructor(address treasury_) {
        require(treasury_ != address(0), "treasury");
        treasury = treasury_;
    }

    /// @notice Deterministic next mint price for universe `u` at current `mintCount[u]`.
    function nextPrice(uint8 u) external view returns (uint256) {
        if (u >= UNIVERSE_COUNT) revert BadUniverse();
        return computePrice(u, mintCount[u]);
    }

    /// @dev U-01 fixed · U-02 bounded variance · U-03 decay · U-04 rise (capped).
    function computePrice(uint8 u, uint256 idx) public view returns (uint256) {
        if (u >= UNIVERSE_COUNT) revert BadUniverse();

        if (u == 0) {
            return 0.01 ether;
        }
        if (u == 1) {
            uint256 span = 17 * 10 ** 15;
            uint256 r =
                uint256(keccak256(abi.encodePacked(block.number, address(this), u, idx))) %
                (span + 1);
            return 0.008 ether + r;
        }
        if (u == 2) {
            uint256 base = 50 * 10 ** 15;
            for (uint256 i = 0; i < idx && i < 500; i++) {
                base = (base * 92) / 100;
            }
            if (base < 1 * 10 ** 15) base = 1 * 10 ** 15;
            return base;
        }
        uint256 b = 5 * 10 ** 15;
        for (uint256 i = 0; i < idx && i < 500; i++) {
            b = (b * 108) / 100;
        }
        if (b > 200 * 10 ** 15) b = 200 * 10 ** 15;
        return b;
    }

    function mint(uint8 universeId) external payable {
        if (universeId >= UNIVERSE_COUNT) revert BadUniverse();

        uint256 price = computePrice(universeId, mintCount[universeId]);
        if (msg.value != price) revert BadPrice();
        if (raised[universeId] + msg.value > UNIVERSE_CAP) revert CapExceeded();

        uint256 idxBefore = mintCount[universeId];
        raised[universeId] += msg.value;
        mintCount[universeId] += 1;

        (bool ok, ) = treasury.call{value: msg.value}("");
        if (!ok) revert ForwardFailed();

        emit UniverseMint(universeId, msg.sender, msg.value, raised[universeId], idxBefore);
    }
}
