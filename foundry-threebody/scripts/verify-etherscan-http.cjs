/**
 * Etherscan contract verification with extended HTTPS timeouts (large standard-json payload).
 * Usage: node scripts/verify-etherscan-http.cjs [contract_address]
 * Env: ETHERSCAN_API_KEY, reads DOTENV_CONFIG_PATH / ../nova/.env.local via dotenv chain in cwd.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

function loadEnv() {
  const roots = [
    process.env.DOTENV_CONFIG_PATH,
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '..', '.env.local'),
  ].filter(Boolean);
  for (const p of roots) {
    if (fs.existsSync(p)) {
      require('dotenv').config({ path: p });
      return;
    }
  }
  require('dotenv').config();
}

function postForm(urlStr, formBody, timeoutMs) {
  const u = new URL(urlStr);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(formBody),
        },
        timeout: timeoutMs,
        agent: new https.Agent({ keepAlive: true }),
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          try {
            resolve({ status: res.statusCode, json: JSON.parse(raw), raw });
          } catch {
            resolve({ status: res.statusCode, json: null, raw });
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('HTTPS request timeout'));
    });
    req.write(formBody);
    req.end();
  });
}

function getForm(urlStr, timeoutMs) {
  const u = new URL(urlStr);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: 'GET',
        timeout: timeoutMs,
        agent: new https.Agent({ keepAlive: true }),
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          try {
            resolve({ status: res.statusCode, json: JSON.parse(raw), raw });
          } catch {
            resolve({ status: res.statusCode, json: null, raw });
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('HTTPS GET timeout')));
    req.end();
  });
}

async function main() {
  loadEnv();
  const apiKey = process.env.ETHERSCAN_API_KEY?.trim();
  if (!apiKey) {
    console.error('Missing ETHERSCAN_API_KEY in environment.');
    process.exit(1);
  }

  const address =
    process.argv[2]?.trim() || '0xf35Ad0Bc6E7bbeDFC2bc8AcB18864B74dFE3D547';

  const buildInfoDir = path.join(__dirname, '..', 'artifacts', 'build-info');
  const files = fs.readdirSync(buildInfoDir).filter((f) => f.endsWith('.json'));
  if (!files.length) {
    console.error('No Hardhat build-info found. Run: npx hardhat compile');
    process.exit(1);
  }
  const latest = files
    .map((f) => ({
      f,
      t: fs.statSync(path.join(buildInfoDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.t - a.t)[0].f;

  const biPath = path.join(buildInfoDir, latest);
  const bi = JSON.parse(fs.readFileSync(biPath, 'utf8'));
  const compilerVersion = `v${bi.solcLongVersion}`;
  const sourceCode = JSON.stringify(bi.input);
  const contractName = 'src/ThreeBody.sol:ThreeBody';

  const params = new URLSearchParams({
    apikey: apiKey,
    module: 'contract',
    action: 'verifysourcecode',
    contractaddress: address,
    sourceCode,
    codeformat: 'solidity-standard-json-input',
    contractname: contractName,
    compilerversion: compilerVersion,
    constructorArguements: '',
  });

  const submitUrl = `https://api.etherscan.io/v2/api?chainid=1`;
  console.info('Submitting verification (large payload, may take 1–3 min)…');

  const submit = await postForm(submitUrl, params.toString(), 240_000);
  if (!submit.json) {
    console.error('Bad response:', submit.raw?.slice(0, 500));
    process.exit(1);
  }

  console.info('Submit status:', JSON.stringify(submit.json));

  if (submit.json.message === 'OK' && submit.json.result) {
    const guid = submit.json.result;
    console.info('GUID:', guid, '— polling status…');

    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const checkParams = new URLSearchParams({
        apikey: apiKey,
        module: 'contract',
        action: 'checkverifystatus',
        guid,
      });
      const checkUrl = `https://api.etherscan.io/v2/api?chainid=1&${checkParams.toString()}`;
      const st = await getForm(checkUrl, 120_000);
      console.info('Poll:', JSON.stringify(st.json));
      const text = (st.json?.result || '').toLowerCase();
      if (text.includes('pending')) continue;
      if (text.includes('already verified') || text.includes('pass - verified')) {
        console.info('Done: https://etherscan.io/address/' + address + '#code');
        process.exit(0);
      }
      if (text.includes('fail')) {
        console.error('Verification failed:', st.json?.result);
        process.exit(1);
      }
    }
    console.error('Timed out waiting for verification result.');
    process.exit(1);
  }

  if (
    String(submit.json.result || '')
      .toLowerCase()
      .includes('already verified')
  ) {
    console.info('Already verified: https://etherscan.io/address/' + address + '#code');
    process.exit(0);
  }

  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
