import { mainnet, sepolia, type Chain } from 'wagmi/chains';

/** Set `NEXT_PUBLIC_THREEBODY_ADDRESS` to enable on-chain mint + live progress. */
export const THREEBODY_ADDRESS = (() => {
  const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_THREEBODY_ADDRESS?.trim() : '';
  if (!raw || !/^0x[a-fA-F0-9]{40}$/.test(raw)) return undefined;
  return raw as `0x${string}`;
})();

export function isThreeBodyConfigured(): boolean {
  return !!THREEBODY_ADDRESS;
}

/** Chain where the ThreeBody contract is deployed (`11155111` = Sepolia, `1` = mainnet). */
export function getThreeBodyChain(): Chain {
  const id = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_THREEBODY_CHAIN_ID?.trim() : '';
  if (id === '11155111') return sepolia;
  return mainnet;
}
