import { createConfig, fallback, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

/** Prefer NEXT_PUBLIC_MAINNET_RPC (Alchemy/Infura/etc.); public endpoints often rate-limit. */
const envMainnetRpc =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MAINNET_RPC
    ? process.env.NEXT_PUBLIC_MAINNET_RPC.trim()
    : '';

const envSepoliaRpc =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SEPOLIA_RPC
    ? process.env.NEXT_PUBLIC_SEPOLIA_RPC.trim()
    : '';

const PUBLIC_MAINNET_RPCS = [
  'https://ethereum.publicnode.com',
  'https://eth.llamarpc.com',
  'https://rpc.ankr.com/eth',
] as const;

const PUBLIC_SEPOLIA_RPCS = [
  'https://ethereum-sepolia.publicnode.com',
  'https://rpc2.sepolia.org',
] as const;

function uniqueRpcOrder(...groups: (readonly string[] | string)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of groups) {
    const list = typeof g === 'string' ? [g] : g;
    for (const u of list) {
      const url = u.trim();
      if (!url || seen.has(url)) continue;
      seen.add(url);
      out.push(url);
    }
  }
  return out;
}

const mainnetTransports = uniqueRpcOrder(
  envMainnetRpc ? [envMainnetRpc] : [],
  PUBLIC_MAINNET_RPCS,
).map((url) =>
  http(url, {
    batch: true,
    retryCount: 2,
    timeout: 20_000,
  }),
);

const sepoliaTransports = uniqueRpcOrder(
  envSepoliaRpc ? [envSepoliaRpc] : [],
  PUBLIC_SEPOLIA_RPCS,
).map((url) =>
  http(url, {
    batch: true,
    retryCount: 2,
    timeout: 20_000,
  }),
);

/**
 * Client-first setup (ssr: false) avoids server/layout importing wagmi cookie hydration —
 * a frequent source of runtime crashes / hydration faults with Next App Router.
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: fallback(mainnetTransports, { rank: false }),
    [sepolia.id]: fallback(sepoliaTransports, { rank: false }),
  },
  ssr: false,
});
