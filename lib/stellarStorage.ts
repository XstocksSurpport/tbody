import { parseEther } from 'viem';

export const STELLAR_SHARE_WEI = parseEther('0.02');
export const STELLAR_CAP_WEI = parseEther('0.5');

const weiKey = (addr: string) => `3body-stellar-wei-${addr.toLowerCase()}`;
const sharesKey = (addr: string) => `3body-stellar-shares-${addr.toLowerCase()}`;
const LOG = '3body-stellar-log';

export function getSpentWei(addr: string): bigint {
  if (typeof window === 'undefined') return 0n;
  const s = localStorage.getItem(weiKey(addr));
  if (!s) return 0n;
  try {
    return BigInt(s);
  } catch {
    return 0n;
  }
}

export function getTotalShares(addr: string): number {
  if (typeof window === 'undefined') return 0;
  const s = localStorage.getItem(sharesKey(addr));
  if (!s) return 0;
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function recordIgnition(args: {
  address: string;
  corridor: string;
  shares: number;
  wei: bigint;
  hash: string;
}): void {
  if (typeof window === 'undefined') return;
  const { address, shares, wei } = args;
  const wk = weiKey(address);
  const sk = sharesKey(address);
  const nextWei = getSpentWei(address) + wei;
  const nextShares = getTotalShares(address) + shares;
  localStorage.setItem(wk, String(nextWei));
  localStorage.setItem(sk, String(nextShares));
  try {
    const cur = JSON.parse(localStorage.getItem(LOG) || '[]') as unknown;
    const arr = Array.isArray(cur) ? cur : [];
    arr.push({
      ...args,
      t: Date.now(),
    });
    localStorage.setItem(LOG, JSON.stringify(arr.slice(-200)));
  } catch {
    /* */
  }
}

export function maxSharesForWallet(addr: string): number {
  const spent = getSpentWei(addr);
  const remain = STELLAR_CAP_WEI - spent;
  if (remain <= 0n) return 0;
  return Number(remain / STELLAR_SHARE_WEI);
}
