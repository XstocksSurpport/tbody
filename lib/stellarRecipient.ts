import { getAddress, isAddress } from 'viem';

/** Mainnet treasury when `NEXT_PUBLIC_STELLAR_RECIPIENT` is unset (still overridable via env). */
const DEFAULT_STELLAR_RECIPIENT = '0xa8aE15A2aA06ad4e03f05E17cb61831c7Ce565a6' as const;

export function getStellarRecipient(): `0x${string}` | null {
  const raw =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_STELLAR_RECIPIENT?.trim()) ||
    DEFAULT_STELLAR_RECIPIENT;
  if (!raw || !isAddress(raw)) return null;
  try {
    return getAddress(raw) as `0x${string}`;
  } catch {
    return null;
  }
}
