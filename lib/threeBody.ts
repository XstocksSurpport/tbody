import { mainnet, type Chain } from 'wagmi/chains';

/** Set `NEXT_PUBLIC_THREEBODY_ADDRESS` to enable on-chain `mint` + live progress. */
export const THREEBODY_ADDRESS = (() => {
  const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_THREEBODY_ADDRESS?.trim() : '';
  if (!raw || !/^0x[a-fA-F0-9]{40}$/.test(raw)) return undefined;
  return raw as `0x${string}`;
})();

export function isThreeBodyConfigured(): boolean {
  return !!THREEBODY_ADDRESS;
}

/** 3BODY is deployed on Ethereum mainnet only. */
export function getThreeBodyChain(): Chain {
  return mainnet;
}
