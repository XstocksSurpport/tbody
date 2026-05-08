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

## Deploy (Sepolia example)

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
