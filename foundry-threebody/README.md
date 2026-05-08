# ThreeBody (`3BODY`) — Foundry + Hardhat

## Security

- **Never commit** deployer private keys or Etherscan API keys.
- If a key was pasted in chat, **rotate it** on Etherscan.

## Hardhat — Ethereum mainnet (production)

Place `.env` in **`foundry-threebody/`** (or point `DOTENV_CONFIG_PATH` at your env file):

```
PRIVATE_KEY=0x...
MAINNET_RPC_URL=https://eth.llamarpc.com
ETHERSCAN_API_KEY=...
```

`MAINNET_RPC_URL` can be omitted only if `NEXT_PUBLIC_MAINNET_RPC` / `ETH_RPC_URL` is set in the same env (see `hardhat.config.cjs`). A public fallback is used if none are set (may rate-limit).

**Requirements:** the deployer needs **enough mainnet ETH for gas** (deployment costs more than a simple transfer; fund the deployer address before `deploy`).

```bash
cd foundry-threebody
npm install
npm run compile
npm run deploy:mainnet
```

Publish source on Etherscan:

```bash
npx hardhat verify --network mainnet <deployed_address>
```

Then set **`NEXT_PUBLIC_THREEBODY_ADDRESS`** in the Next app to that address (mainnet only; chain id **1**).

**Latest mainnet deployment (reference):** `0xf35Ad0Bc6E7bbeDFC2bc8AcB18864B74dFE3D547` — confirm on [Etherscan](https://etherscan.io/address/0xf35Ad0Bc6E7bbeDFC2bc8AcB18864B74dFE3D547) before relying on it.

## Foundry (optional)

```bash
cd foundry-threebody
forge install OpenZeppelin/openzeppelin-contracts@v5.2.1 --no-commit
forge build
```

### Sepolia (test only)

```bash
npm run deploy:sepolia
npx hardhat verify --network sepolia <deployed_address>
```

Use test ETH from a faucet. The **website** in this repo targets **Ethereum mainnet only**.
