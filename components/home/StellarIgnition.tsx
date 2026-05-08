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
import { mainnet } from 'wagmi/chains';
import { formatEther } from 'viem';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect, useMemo, useRef, useState } from 'react';

const PANEL_ORDER: ObservationPanelId[] = ['u01', 'u02', 'u03', 'u04'];

export function StellarIgnition() {
  const { t } = useI18n();
  const { address, isConnected, chainId } = useAccount();
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

  const spent = address ? getSpentWei(address) : 0n;
  const maxS = address ? maxSharesForWallet(address) : 0;
  const remaining = STELLAR_CAP_WEI > spent ? STELLAR_CAP_WEI - spent : 0n;

  const sharesNum = Math.floor(Number.parseInt(sharesStr.replace(/\D/g, ''), 10) || 0);
  const capped = maxS > 0 ? Math.min(sharesNum, maxS) : 0;
  const totalWei = capped > 0 ? STELLAR_SHARE_WEI * BigInt(capped) : 0n;

  const { sendTransactionAsync, data: txHash, isPending } = useSendTransaction();

  const { isLoading: confirming, isSuccess, isError: receiptFailed } =
    useWaitForTransactionReceipt({
      hash: txHash,
      chainId: mainnet.id,
      query: { enabled: !!txHash },
    });

  useEffect(() => {
    if (!receiptFailed) return;
    pendingRef.current = null;
    setMsg(t('home.igniteTxFailed'));
  }, [receiptFailed, t]);

  useEffect(() => {
    if (!isSuccess || !txHash || !pendingRef.current) return;
    const p = pendingRef.current;
    pendingRef.current = null;
    if (p.address !== address) return;
    recordIgnition({
      address: p.address,
      corridor: p.corridor,
      shares: p.shares,
      wei: p.wei,
      hash: txHash,
    });
    setMsg(t('home.igniteSuccess'));
    setSharesStr('1');
  }, [isSuccess, txHash, address, t]);

  const wrongChain = isConnected && chainId !== mainnet.id;

  async function onIgnite() {
    setMsg(null);
    if (!isConnected || !address) {
      setMsg(t('home.igniteNeedWallet'));
      return;
    }
    if (wrongChain) {
      setMsg(t('home.igniteWrongChain'));
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
      setMsg(t('home.ignitePending'));
      await sendTransactionAsync({
        chainId: mainnet.id,
        to: treasury,
        value,
      });
    } catch {
      pendingRef.current = null;
      setMsg(t('home.igniteTxFailed'));
    }
  }

  /** Only disable while a tx is in-flight — otherwise taps always run `onIgnite` and surface msgs (wallet / chain / cap / recipient). */
  const txBusy = isPending || confirming;

  return (
    <section
      className="relative z-[20] mt-12 border border-white/[0.07] bg-black/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md md:p-6"
      aria-label={t('home.igniteTitle')}
    >
      <div className="border-b border-white/[0.06] pb-4">
        <h2 className="font-mono text-[10px] tracking-[0.28em] text-[#c5ccd4]">{t('home.igniteTitle')}</h2>
        <p className="font-mono mt-2 text-[8px] tracking-[0.2em] text-[#4f565e]">{t('home.ignitePrimaryEn')}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-6">
        <label className="block font-mono text-[8px] tracking-[0.18em] text-[#6a7179]">
          <span className="mb-2 block text-[#8e959e]">{t('home.igniteCorridor')}</span>
          <select
            value={corridor}
            onChange={(e) => setCorridor(e.target.value as ObservationPanelId)}
            className="mt-1 w-full cursor-pointer rounded border border-white/[0.1] bg-black/80 px-3 py-2.5 font-mono text-[10px] tracking-[0.12em] text-[#d0d5dc]"
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
            className="mt-1 w-full cursor-pointer rounded border border-white/[0.1] bg-black/80 px-3 py-2.5 font-mono text-[10px] tracking-[0.12em] text-[#d0d5dc]"
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
          className="mt-1 w-full max-w-[200px] rounded border border-white/[0.1] bg-black/80 px-3 py-2 font-mono text-[11px] tabular-nums text-[#eef1f5]"
        />
      </label>

      {address ? (
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
          disabled={txBusy}
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
      {isSuccess && txHash ? (
        <p className="font-mono mt-2 text-[8px] break-all text-[#5c636b]">{txHash}</p>
      ) : null}
    </section>
  );
}
