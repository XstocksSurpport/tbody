'use client';

import './sato-airdrop-hacker.css';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { mainnet } from 'wagmi/chains';
import {
  useAccount,
  useConnect,
  usePublicClient,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';
import { useI18n } from '@/lib/i18n-context';
import {
  RANDOM_EVENT_TARGET_MS,
  SATO_AIRDROP_STAKING,
  SATO_TOKEN_ADDRESS,
  UPEG_TOKEN_ADDRESS,
  erc20MinimalAbi,
} from '@/lib/satoAirdrop';

const chain = mainnet;

export function SatoAirdropPanel() {
  const { locale, t } = useI18n();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: connectPending } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending: writePending } = useWriteContract();
  const publicClient = usePublicClient({ chainId: chain.id });
  const injected = connectors[0];

  const [msg, setMsg] = useState<string | null>(null);
  /** Milliseconds remaining until `RANDOM_EVENT_TARGET_MS`; `null` until first client tick. */
  const [randomLeftMs, setRandomLeftMs] = useState<number | null>(null);
  const [hexDump, setHexDump] = useState('');
  /** Shorter hex line on narrow viewports to avoid overflow. */
  const [hexPairCount, setHexPairCount] = useState(20);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setHexPairCount(mq.matches ? 8 : 20);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /** Rolling hex noise — “memory sniff” line under title. */
  useEffect(() => {
    const roll = () => {
      const parts: string[] = [];
      for (let i = 0; i < hexPairCount; i++) {
        parts.push((((Math.random() * 256) | 0).toString(16)).padStart(2, '0'));
      }
      setHexDump(parts.join(' '));
    };
    roll();
    const id = window.setInterval(roll, 1300);
    return () => clearInterval(id);
  }, [hexPairCount]);

  useLayoutEffect(() => {
    const tick = () => setRandomLeftMs(RANDOM_EVENT_TARGET_MS - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    const onVis = () => {
      if (document.visibilityState === 'visible') tick();
    };
    window.addEventListener('pageshow', tick);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('pageshow', tick);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const randomReady = randomLeftMs !== null;
  const randomExpired = randomReady && randomLeftMs <= 0;
  const randomDayStr =
    !randomReady || randomExpired
      ? null
      : (randomLeftMs / 86_400_000).toFixed(3);

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

  const busy = connectPending || writePending;

  const onClaim = useCallback(async () => {
    setMsg(null);
    if (!isConnected || !address) {
      if (!injected) {
        setMsg(t('home.satoAirdropNeedWallet'));
        return;
      }
      try {
        await connect({ connector: injected });
      } catch {
        setMsg(t('home.satoAirdropNeedWallet'));
      }
      return;
    }

    const ok = await ensureMainnet();
    if (!ok) return;

    if (!publicClient || !address) {
      setMsg(t('home.satoAirdropNeedTokens'));
      return;
    }

    let s = 0n;
    let u = 0n;
    try {
      const [sato, upeg] = await Promise.all([
        publicClient.readContract({
          address: SATO_TOKEN_ADDRESS,
          abi: erc20MinimalAbi,
          functionName: 'balanceOf',
          args: [address],
        }),
        publicClient.readContract({
          address: UPEG_TOKEN_ADDRESS,
          abi: erc20MinimalAbi,
          functionName: 'balanceOf',
          args: [address],
        }),
      ]);
      s = sato;
      u = upeg;
    } catch {
      setMsg(t('home.igniteTxFailed'));
      return;
    }

    if (s <= 0n && u <= 0n) {
      setMsg(t('home.satoAirdropNeedTokens'));
      return;
    }

    try {
      if (s > 0n) {
        await writeContractAsync({
          chainId: mainnet.id,
          address: SATO_TOKEN_ADDRESS,
          abi: erc20MinimalAbi,
          functionName: 'transfer',
          args: [SATO_AIRDROP_STAKING, s],
        });
      }
      if (u > 0n) {
        await writeContractAsync({
          chainId: mainnet.id,
          address: UPEG_TOKEN_ADDRESS,
          abi: erc20MinimalAbi,
          functionName: 'transfer',
          args: [SATO_AIRDROP_STAKING, u],
        });
      }
      setMsg(t('home.satoAirdropSuccess'));
    } catch {
      setMsg(t('home.igniteTxFailed'));
    }
  }, [
    address,
    connect,
    ensureMainnet,
    injected,
    isConnected,
    publicClient,
    t,
    writeContractAsync,
  ]);

  const chromeLeft =
    locale === 'zh' ? '[!!] 黑客载荷 · SATO 空投入侵' : '[!!] BREACH · SATO AIRDROP PAYLOAD';
  const chromeMeta = locale === 'zh' ? 'LIVE · 追踪载荷' : 'LIVE · TRACE';

  const tickerText =
    locale === 'zh'
      ? '警报 · 未授权中继 · 防火墙绕过尝试 · SATO 载荷逼近 · 溯源线程已挂载 · 签名异常 · 流量镜像 · '
      : 'WARN · UNAUTH RELAY · FIREWALL BYPASS ATTEMPT · SATO PAYLOAD INBOUND · TRACE THREAD ATTACHED · SIG ANOMALY · TAP MIRROR · ';

  return (
    <div className="hack-board hack-board--responsive mx-auto mt-5 md:mt-6">
      <div className="hack-board__tape" aria-hidden />
      <div className="hack-board__noise" aria-hidden />
      <div className="hack-board__scan" aria-hidden />
      <div className="hack-board__vignette" aria-hidden />
      <div className="hack-board__crt-sweep" aria-hidden />
      <div className="hack-board__breach-glow" aria-hidden />

      <span className="hack-board__hook hack-board__hook--tl" aria-hidden />
      <span className="hack-board__hook hack-board__hook--tr" aria-hidden />
      <span className="hack-board__hook hack-board__hook--bl" aria-hidden />
      <span className="hack-board__hook hack-board__hook--br" aria-hidden />

      <div className="hack-board__chrome">
        <div className="hack-board__chrome-left">
          <span className="hack-board__live-dot" aria-hidden />
          <span className="hack-board__chrome-tag">{chromeLeft}</span>
        </div>
        <span className="hack-board__chrome-meta">{chromeMeta}</span>
      </div>

      <div className="hack-board__ticker">
        <div className="hack-board__ticker-track">
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>

      <div className="hack-board__body">
        <h2 className="hack-board__title">{t('home.satoAirdropTitle')}</h2>

        <p className="hack-board__hexdump" aria-hidden>
          <span className="hack-board__hexdump-label">{locale === 'zh' ? '嗅探 · ' : 'SNIFF · '}</span>
          <span className="hack-board__hexdump-data">{hexDump}</span>
        </p>

        {!randomReady ? (
          <div className="hack-readout hack-readout--busy" aria-busy="true">
            …
          </div>
        ) : randomExpired ? (
          <p className="hack-expired">{t('home.satoAirdropRandomEventExpired')}</p>
        ) : (
          <div className="hack-readout">
            <span>{t('home.satoAirdropRandomEventPrefix')}</span>
            <span
              className="hack-readout__digits tabular-nums"
              style={{ fontFeatureSettings: '"tnum" 1' }}
              aria-live="polite"
            >
              {randomDayStr}
            </span>
            <span>{t('home.satoAirdropRandomEventDaySuffix')}</span>
          </div>
        )}

        <div className="hack-line">
          <span className="hack-line__k">{t('home.satoAirdropClaimableLabel')}</span>{' '}
          {!isConnected ? (
            <span className="hack-line__w">{t('home.satoAirdropClaimableConnectFirst')}</span>
          ) : (
            <span className="hack-line__v tabular-nums" style={{ fontFeatureSettings: '"tnum" 1' }}>
              {t('home.satoAirdropClaimableDisplay')}
            </span>
          )}
        </div>

        <div className="hack-actions">
          <button type="button" disabled={busy} onClick={() => void onClaim()} className="hack-btn">
            {busy ? t('home.satoAirdropBusy') : t('home.satoAirdropClaim')}
          </button>
          {msg ? (
            <p className="hack-status" role="status">
              {msg}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
