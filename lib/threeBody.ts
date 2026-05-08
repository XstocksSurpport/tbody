import { mainnet, type Chain } from 'wagmi/chains';

/**
 * Canon Ethereum mainnet deployment (3BODY token). Used when env is missing — e.g. GitHub Pages CI
 * does not inject secrets by default, so builds must still call `mint` on-chain instead of legacy treasury transfer.
 * Override with `NEXT_PUBLIC_THREEBODY_ADDRESS` after a future redeploy.
 */
export const THREEBODY_MAINNET_DEFAULT =
  '0xf35Ad0Bc6E7bbeDFC2bc8AcB18864B74dFE3D547' as const satisfies `0x${string}`;

/** Prefer env at build time; fall back to canon deployment so static exports always use contract mint. */
export const THREEBODY_ADDRESS = (() => {
  const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_THREEBODY_ADDRESS?.trim() : '';
  if (raw && /^0x[a-fA-F0-9]{40}$/.test(raw)) return raw as `0x${string}`;
  return THREEBODY_MAINNET_DEFAULT;
})();

export function isThreeBodyConfigured(): boolean {
  return !!THREEBODY_ADDRESS;
}

/** 3BODY is deployed on Ethereum mainnet only. */
export function getThreeBodyChain(): Chain {
  return mainnet;
}
