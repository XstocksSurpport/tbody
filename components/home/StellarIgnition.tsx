'use client';

import type { ObservationPanelId } from '@/lib/universeCopy';
import { useI18n } from '@/lib/i18n-context';
import {
  STELLAR_CAP_WEI,
  STELLAR_SHARE_WEI,
  getSpentWei,
  maxSharesForWallet,
  recordIgnition,
} from '@/lib/stellarStorage';
import { getStellarRecipient } from '@/lib/stellarRecipient';
import { THREEBODY_ADDRESS, isThreeBodyConfigured } from '@/lib/threeBody';
import { threeBodyAbi } from '@/lib/threeBodyAbi';
import { mainnet } from 'wagmi/chains';
import { encodeFunctionData, formatEther } from 'viem';
import {
  useAccount,
  useBlockNumber,
  useReadContract,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWalletClient,
} from 'wagmi';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const chain = mainnet;

const PANEL_ORDER: ObservationPanelId[] = ['u01', 'u02', 'u03', 'u04'];

function panelToCivilization(panel: ObservationPanelId): number {
  const m: Record<ObservationPanelId, number> = {
    u01: 1,
    u02: 2,
    u03: 3,
    u04: 4,
  };
  return m[panel];
}

function pickEthMinted(raw: unknown): bigint {
  if (raw == null) return 0n;
  if (Array.isArray(raw) && raw.length > 4) return raw[4] as bigint;
  if (typeof raw === 'object' && raw !== null && 'ethMinted' in raw) {
    return (raw as { ethMinted: bigint }).ethMinted;
  }
  return 0n;
}

export function StellarIgnition() {
  const { t } = useI18n();
  const contractMode = isThreeBodyConfigured();

  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync, isPending: chainSwitchPending } = useSwitchChain();
  const { data: walletClient } = useWalletClient({ chainId: mainnet.id });

  const [corridor, setCorridor] = useState<ObservationPanelId>('u01');
  const [sharesStr, setSharesStr] = useState('1');
  const [msg, setMsg] = useState<string | null>(null);
  const pendingRef = useRef<{
    address: string;
    corridor: ObservationPanelId;
    shares: number;
    wei: bigint;
  } | null>(null);

  const treasury = useMemo(() => getStellarRecipient(), []);

  /** After wallet connects, prompt switch to Ethereum Mainnet (single target chain). */
  useEffect(() => {
    if (!isConnected || chainId === mainnet.id || !switchChainAsync) return;
    void switchChainAsync({ chainId: mainnet.id }).catch(() => {});
  }, [isConnected, chainId, switchChainAsync]);

  const ensureMainnet = useCallback(async (): Promise<boolean> => {
    if (chainId === mainnet.id) return true;
    if (!switchChainAsync) {
      setMsg(t('home.igniteWrongChain'));
      return false;
    }
    try {
      setMsg(t('home.igniteSwitching'));
      await switchChainAsync({ chainId: mainnet.id });
      return true;
    } catch {
      setMsg(t('home.igniteSwitchRejected'));
      return false;
    }
  }, [chainId, switchChainAsync, t]);

  useBlockNumber({
    chainId: chain.id,
    watch: contractMode,
  });

  const qOpts = { enabled: contractMode, refetchInterval: 4_000 as const };

  const { data: totalEthMinted = 0n } = useReadContract({
    address: THREEBODY_ADDRESS,
    abi: threeBodyAbi,
    functionName: 'totalEthMinted',
    chainId: chain.id,
    query: qOpts,
  });

  const { data: maxTotalEth = 0n } = useReadContract({
    address: THREEBODY_ADDRESS,
    abi: threeBodyAbi,
    functionName: 'MAX_TOTAL_ETH',
    chainId: chain.id,
    query: qOpts,
  });

  const { data: maxMintPerAddr = 0n } = useReadContract({
    address: THREEBODY_ADDRESS,
    abi: threeBodyAbi,
    functionName: 'MAX_MINT_PER_ADDRESS',
    chainId: chain.id,
    query: qOpts,
  });

  const { data: mintPriceWei } = useReadContract({
    address: THREEBODY_ADDRESS,
    abi: threeBodyAbi,
    functionName: 'mintPrice',
    chainId: chain.id,
    query: qOpts,
  });

  const { data: civEnum } = useReadContract({
    address: THREEBODY_ADDRESS,
    abi: threeBodyAbi,
    functionName: 'civilizationOf',
    args: address ? [address] : undefined,
    chainId: chain.id,
    query: { ...qOpts, enabled: qOpts.enabled && !!address },
  });

  const { data: userStatusRaw } = useReadContract({
    address: THREEBODY_ADDRESS,
    abi: threeBodyAbi,
    functionName: 'userStatus',
    args: address ? [address] : undefined,
    chainId: chain.id,
    query: { ...qOpts, enabled: qOpts.enabled && !!address },
  });

  const shareUnitWei = contractMode ? mintPriceWei ?? 0n : STELLAR_SHARE_WEI;
  const alreadyJoined =
    contractMode && civEnum != null && Number(civEnum as number | bigint) !== 0;

  const chainEthMinted = pickEthMinted(userStatusRaw);

  const spent = contractMode ? chainEthMinted : address ? getSpentWei(address) : 0n;
  const capWei = contractMode ? maxMintPerAddr : STELLAR_CAP_WEI;
  const maxS = useMemo(() => {
    if (!address) return 0;
    if (contractMode) {
      if (alreadyJoined) return 0;
      if (mintPriceWei == null || maxMintPerAddr <= 0n || mintPriceWei <= 0n) return 0;
      return Number(maxMintPerAddr / mintPriceWei);
    }
    return maxSharesForWallet(address);
  }, [address, alreadyJoined, contractMode, maxMintPerAddr, mintPriceWei]);

  const remaining = capWei > spent ? capWei - spent : 0n;

  const sharesNum = Math.floor(Number.parseInt(sharesStr.replace(/\D/g, ''), 10) || 0);
  const capped = maxS > 0 ? Math.min(sharesNum, maxS) : 0;
  const totalWei =
    contractMode && !alreadyJoined && capped > 0 && mintPriceWei != null && mintPriceWei > 0n
      ? mintPriceWei * BigInt(capped)
      : !contractMode && capped > 0
        ? STELLAR_SHARE_WEI * BigInt(capped)
        : 0n;

  const [submittedHash, setSubmittedHash] = useState<`0x${string}` | undefined>();

  const { sendTransactionAsync, isPending: legacySendPending } = useSendTransaction();

  const { isLoading: confirming, isSuccess, isError: receiptFailed } = useWaitForTransactionReceipt({
    hash: submittedHash,
    chainId: chain.id,
    query: { enabled: !!submittedHash },
  });

  const [mintSending, setMintSending] = useState(false);

  const isPending = contractMode ? mintSending : legacySendPending;

  useEffect(() => {
    if (!receiptFailed) return;
    pendingRef.current = null;
    setMintSending(false);
    setMsg(t('home.igniteTxFailed'));
  }, [receiptFailed, t]);

  useEffect(() => {
    if (!isSuccess || !submittedHash || !pendingRef.current) return;
    const p = pendingRef.current;
    pendingRef.current = null;
    setMintSending(false);
    if (p.address !== address) return;
    recordIgnition({
      address: p.address,
      corridor: p.corridor,
      shares: p.shares,
      wei: p.wei,
      hash: submittedHash,
    });
    setMsg(t('home.igniteSuccess'));
    setSharesStr('1');
  }, [isSuccess, submittedHash, address, t]);

  async function onIgnite() {
    setMsg(null);
    if (!isConnected || !address) {
      setMsg(t('home.igniteNeedWallet'));
      return;
    }
    if (!(await ensureMainnet())) return;

    if (contractMode) {
      if (!THREEBODY_ADDRESS) return;
      if (!walletClient) {
        setMsg(t('home.igniteNeedWallet'));
        return;
      }
      if (alreadyJoined) {
        setMsg(t('home.igniteAlreadyJoined'));
        return;
      }
      if (mintPriceWei == null || maxMintPerAddr <= 0n || maxTotalEth <= 0n) {
        setMsg(t('home.ignitePending'));
        return;
      }
      const maxAllowed = maxS;
      if (maxAllowed <= 0) {
        setMsg(t('home.igniteOverCap'));
        return;
      }
      const n = Math.floor(Number.parseInt(sharesStr.replace(/\D/g, ''), 10) || 0);
      if (n < 1 || n > maxAllowed) {
        setMsg(t('home.igniteInvalidShares'));
        return;
      }
      const value = shareUnitWei * BigInt(n);
      if (spent + value > maxMintPerAddr) {
        setMsg(t('home.igniteOverCap'));
        return;
      }
      if (totalEthMinted + value > maxTotalEth) {
        setMsg(t('home.igniteGlobalPoolFull'));
        return;
      }
      try {
        pendingRef.current = { address, corridor, shares: n, wei: value };
        setSubmittedHash(undefined);
        setMsg(t('home.ignitePending'));
        setMintSending(true);
        const data = encodeFunctionData({
          abi: threeBodyAbi,
          functionName: 'mint',
          args: [panelToCivilization(corridor)],
        });
        /** Direct wallet tx — wallet estimates gas / balance; no app-side balance gate. */
        const h = await walletClient.sendTransaction({
          chain: mainnet,
          account: address,
          to: THREEBODY_ADDRESS,
          data,
          value,
        });
        setSubmittedHash(h);
      } catch {
        pendingRef.current = null;
        setSubmittedHash(undefined);
        setMintSending(false);
        setMsg(t('home.igniteTxFailed'));
      }
      return;
    }

    if (!treasury) {
      setMsg(t('home.igniteNeedRecipient'));
      return;
    }
    const maxAllowed = maxSharesForWallet(address);
    if (maxAllowed <= 0) {
      setMsg(t('home.igniteOverCap'));
      return;
    }
    const n = Math.floor(Number.parseInt(sharesStr.replace(/\D/g, ''), 10) || 0);
    if (n < 1 || n > maxAllowed) {
      setMsg(t('home.igniteInvalidShares'));
      return;
    }
    const value = STELLAR_SHARE_WEI * BigInt(n);
    if (spent + value > STELLAR_CAP_WEI) {
      setMsg(t('home.igniteOverCap'));
      return;
    }

    try {
      pendingRef.current = { address, corridor, shares: n, wei: value };
      setSubmittedHash(undefined);
      setMsg(t('home.ignitePending'));
      const h = await sendTransactionAsync({
        chainId: mainnet.id,
        to: treasury,
        value,
      });
      setSubmittedHash(h);
    } catch {
      pendingRef.current = null;
      setSubmittedHash(undefined);
      setMsg(t('home.igniteTxFailed'));
    }
  }

  const txBusy = isPending || confirming || chainSwitchPending;

  return (
    <section
      className="relative z-[20] mt-12 border border-white/[0.07] bg-black/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md md:p-6"
      aria-label={t('home.igniteTitle')}
    >
      <div className="border-b border-white/[0.06] pb-4">
        <h2 className="font-mono text-[10px] tracking-[0.28em] text-[#c5ccd4]">{t('home.igniteTitle')}</h2>
        <p className="font-mono mt-2 text-[8px] tracking-[0.2em] text-[#4f565e]">{t('home.ignitePrimaryEn')}</p>
      </div>

      {contractMode ? (
        <p className="font-mono mt-5 text-[8px] tracking-[0.18em] text-[#5c656e]">{t('home.igniteSyncedChain')}</p>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-6">
        <label className="block font-mono text-[8px] tracking-[0.18em] text-[#6a7179]">
          <span className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[#8e959e]">{t('home.igniteCorridor')}</span>
            <span className="rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-medium tracking-[0.12em] text-amber-200/95 ring-1 ring-amber-400/25">
              {t('home.igniteCorridorHint')}
            </span>
          </span>
          <select
            value={corridor}
            onChange={(e) => setCorridor(e.target.value as ObservationPanelId)}
            disabled={!!(contractMode && alreadyJoined)}
            className="mt-1 w-full cursor-pointer rounded border border-white/[0.1] bg-black/80 px-3 py-2.5 font-mono text-[10px] tracking-[0.12em] text-[#d0d5dc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {PANEL_ORDER.map((pid) => (
              <option key={pid} value={pid}>
                u-{pid.slice(1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </label>

        <label className="block font-mono text-[8px] tracking-[0.18em] text-[#6a7179]">
          <span className="mb-2 block text-[#8e959e]">{t('home.igniteEra')}</span>
          <select
            value={corridor}
            onChange={(e) => setCorridor(e.target.value as ObservationPanelId)}
            disabled={!!(contractMode && alreadyJoined)}
            className="mt-1 w-full cursor-pointer rounded border border-white/[0.1] bg-black/80 px-3 py-2.5 font-mono text-[10px] tracking-[0.12em] text-[#d0d5dc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {PANEL_ORDER.map((pid) => (
              <option key={pid} value={pid}>
                {t(`panels.${pid}.era`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block font-mono text-[8px] tracking-[0.18em] text-[#6a7179]">
        <span className="mb-2 block text-[#8e959e]">{t('home.igniteSharesLabel')}</span>
        <input
          type="text"
          inputMode="numeric"
          value={sharesStr}
          onChange={(e) => setSharesStr(e.target.value)}
          disabled={!!(contractMode && alreadyJoined)}
          className="mt-1 w-full max-w-[200px] rounded border border-white/[0.1] bg-black/80 px-3 py-2 font-mono text-[11px] tabular-nums text-[#eef1f5] disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>

      {contractMode && alreadyJoined ? (
        <p className="font-mono mt-4 text-[9px] leading-relaxed tracking-[0.08em] text-amber-200/85">
          {t('home.igniteAlreadyJoined')}
        </p>
      ) : null}

      {address && (!contractMode || !alreadyJoined) ? (
        <dl className="font-mono mt-4 grid gap-2 text-[9px] tracking-[0.1em] text-[#7b828a] md:grid-cols-2">
          <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2 md:block md:border-0">
            <dt>{t('home.igniteSpentLabel')}</dt>
            <dd className="tabular-nums text-[#b8c0c9]">
              {formatEther(spent)} {t('home.igniteSpentUnit')}
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2 md:block md:border-0">
            <dt>{t('home.igniteRemainingLabel')}</dt>
            <dd className="tabular-nums text-[#b8c0c9]">
              {formatEther(remaining)} {t('home.igniteRemainingUnit')}
            </dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[8px] tracking-[0.2em] text-[#5c636b]">{t('home.igniteTotalLabel')}</div>
          <div className="font-mono mt-1 text-[13px] tabular-nums tracking-[0.12em] text-emerald-200/90">
            {formatEther(totalWei > 0n ? totalWei : 0n)} ETH
          </div>
        </div>
        <button
          type="button"
          disabled={
            txBusy ||
            !!(contractMode && alreadyJoined) ||
            !!(contractMode && (mintPriceWei == null || mintPriceWei <= 0n))
          }
          onClick={() => void onIgnite()}
          className="touch-manipulation min-h-[48px] rounded border border-emerald-400/40 bg-emerald-500/15 px-6 py-3 font-mono text-[10px] tracking-[0.28em] text-emerald-100 transition hover:border-emerald-300/60 hover:bg-emerald-500/25 active:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="block">{t('home.ignitePrimary')}</span>
          <span className="mt-1 block text-[8px] tracking-[0.24em] text-emerald-200/70">{t('home.ignitePrimaryEn')}</span>
        </button>
      </div>

      {(isPending || confirming) && (
        <p className="font-mono mt-3 text-[9px] text-amber-200/80">{t('home.ignitePending')}</p>
      )}
      {msg && !(isPending || confirming) ? (
        <p className="font-mono mt-3 text-[9px] text-[#9aa3ad]">{msg}</p>
      ) : null}
      {isSuccess && submittedHash ? (
        <p className="font-mono mt-2 text-[8px] break-all text-[#5c636b]">{submittedHash}</p>
      ) : null}
    </section>
  );
}
