require('@nomicfoundation/hardhat-toolbox');
const path = require('path');
const fs = require('fs');

/** @returns {string[]} */
function envFileCandidates() {
  const explicit =
    process.env.DOTENV_CONFIG_PATH ||
    process.env.DEPLOY_ENV_FILE ||
    '';
  if (explicit && fs.existsSync(explicit)) return [explicit];
  const roots = [
    __dirname,
    path.join(__dirname, '..'),
    path.join(__dirname, '..', '..'),
    path.join(__dirname, '..', '..', '..'),
  ];
  const out = [];
  for (const r of roots) {
    const p = path.join(r, '.env');
    if (fs.existsSync(p)) out.push(p);
  }
  return out;
}

(function loadEnv() {
  const files = envFileCandidates();
  if (files.length) {
    for (const f of files) require('dotenv').config({ path: f });
  } else {
    require('dotenv').config();
  }
})();

/** `Private Key=` is common in wallet exports; dotenv may skip keys with spaces. */
(function mergePrivateKeyLine() {
  if (process.env.PRIVATE_KEY?.trim()) return;
  for (const f of envFileCandidates()) {
    if (!fs.existsSync(f)) continue;
    const raw = fs.readFileSync(f, 'utf8');
    const m = raw.match(/^\s*Private\s+Key\s*=\s*(\S+)/im);
    if (m?.[1]) {
      process.env.PRIVATE_KEY = m[1].trim();
      return;
    }
  }
})();

function normalizePk(raw) {
  if (!raw || typeof raw !== 'string') return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  return t.startsWith('0x') ? t : `0x${t}`;
}

const pk = normalizePk(
  process.env.PRIVATE_KEY ||
    process.env.DEPLOYER_PRIVATE_KEY ||
    process.env.ETH_PRIVATE_KEY ||
    process.env['Private Key']
);

const mainnetRpc =
  process.env.MAINNET_RPC_URL?.trim() ||
  process.env.NEXT_PUBLIC_MAINNET_RPC?.trim() ||
  process.env.ETH_RPC_URL?.trim() ||
  'https://ethereum.publicnode.com';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  paths: {
    sources: './src',
    tests: './test',
    cache: './hh-cache',
    artifacts: './artifacts',
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia.publicnode.com',
      accounts: pk ? [pk] : [],
    },
    mainnet: {
      url: mainnetRpc,
      accounts: pk ? [pk] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
  },
};
