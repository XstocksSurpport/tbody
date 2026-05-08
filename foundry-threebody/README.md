# ThreeBody (`3BODY`) — Foundry

## Security

- **Never commit** deployer private keys or Etherscan API keys.
- If a key was pasted in chat, **rotate it** on Etherscan.

## Setup

```bash
cd foundry-threebody
forge install OpenZeppelin/openzeppelin-contracts@v5.2.1 --no-commit
forge build
```

## Deploy with Hardhat (recommended on Windows)

Place a `.env` **in this folder** (`foundry-threebody/.env`) with:

```
PRIVATE_KEY=0x...your_hex_key...
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
ETHERSCAN_API_KEY=...optional_for_verify...
```

You can also use a single-line export such as `Private Key=...` (hex with or without `0x`); Hardhat maps that to `PRIVATE_KEY`. Prefer renaming to `PRIVATE_KEY` in production. If deployment fails with RPC errors, set `SEPOLIA_RPC_URL` explicitly (avoid bare `http://rpc.sepolia.org` without a working JSON-RPC path).

Then:

```bash
cd foundry-threebody
npm install
npm run compile
npm run deploy:sepolia
```

Verify (after deployment):

```bash
npx hardhat verify --network sepolia <deployed_address>
```

## Deploy with Foundry (optional)

```bash
export SEPOLIA_RPC_URL="https://rpc.sepolia.org"
export PRIVATE_KEY="0x..."   # funded test wallet — keep offline / CI secret

forge script script/DeployThreeBody.s.sol:DeployThreeBody \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  -vvvv
```

Use Sepolia ETH from a faucet; verification uses an **Etherscan API key** (same key works for Sepolia Etherscan).

## Mainnet

Same command with mainnet RPC and extreme caution on keys and parameters.
