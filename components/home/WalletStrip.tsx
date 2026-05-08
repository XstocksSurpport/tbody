'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useI18n } from '@/lib/i18n-context';

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function WalletStrip() {
  const { t } = useI18n();
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const injected = connectors[0];

  if (isConnected && address) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="font-mono text-[9px] tracking-[0.12em] text-[#8a929b]">{shortAddr(address)}</span>
        {chain?.name ? (
          <span className="rounded border border-white/[0.08] px-2 py-0.5 font-mono text-[8px] tracking-[0.14em] text-[#5c636b]">
            {chain.name}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => disconnect()}
          className="touch-manipulation rounded border border-white/[0.12] bg-white/[0.03] px-3 py-1.5 font-mono text-[8px] tracking-[0.22em] text-[#b8c0c9] transition hover:border-white/[0.2] hover:text-[#eef1f5]"
        >
          {t('home.walletDisconnect')}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending || !injected}
      onClick={() => injected && connect({ connector: injected })}
      className="touch-manipulation rounded border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 font-mono text-[9px] tracking-[0.22em] text-emerald-200/95 transition hover:border-emerald-400/55 hover:bg-emerald-500/15 disabled:opacity-50"
    >
      {t('home.walletConnect')}
    </button>
  );
}
