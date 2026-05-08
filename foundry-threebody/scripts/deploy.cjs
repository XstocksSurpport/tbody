/**
 * Deploy ThreeBody — reads PRIVATE_KEY + SEPOLIA_RPC_URL from process.env (via hardhat.config dotenv).
 * Usage: npx hardhat run scripts/deploy.cjs --network sepolia
 */

async function main() {
  const raw =
    process.env.PRIVATE_KEY ||
    process.env.DEPLOYER_PRIVATE_KEY ||
    process.env.ETH_PRIVATE_KEY ||
    process.env['Private Key'];
  if (!raw?.trim()) {
    console.error(
      'Missing deployer key: set PRIVATE_KEY in .env (Supported aliases: DEPLOYER_PRIVATE_KEY, ETH_PRIVATE_KEY, or Private Key).'
    );
    process.exit(1);
  }

  const hre = require('hardhat');

  console.info('Deploying ThreeBody…');

  const Factory = await hre.ethers.getContractFactory('ThreeBody');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.info('Deployed at:', addr);

  console.info('\nVerify on Sepolia Etherscan (example):');
  console.info(
    `npx hardhat verify --network sepolia ${addr}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
