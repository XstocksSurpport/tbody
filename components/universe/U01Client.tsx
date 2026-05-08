'use client';

import { HardNavLink } from '@/components/HardNavLink';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AmbientAudio } from '@/components/AmbientAudio';
import { useI18n } from '@/lib/i18n-context';
import { mulberry32 } from '@/lib/sophonSeed';
import './u01-shell.css';

type EnergyKind = 'CONSISTENT' | 'NOMINAL' | 'BOUNDED';

function renderCodeLine(line: string, i: number) {
  const trimmed = line.trimStart();
  const indent = line.slice(0, line.length - trimmed.length);
  const kv = /^(?<k>"[^"]+")(?<colon>\s*:\s*)(?<rest>.*)$/.exec(trimmed);
  if (kv?.groups) {
    const { k, colon, rest } = kv.groups;
    return (
      <div
        key={`${i}-${line.slice(0, 24)}`}
        className={`u01-code-line u01-json-line ${line.startsWith('/*') || line.startsWith('//') ? 'u01-dim' : ''}`}
      >
        <span className="u01-indent" aria-hidden>
          {indent}
        </span>
        <span className="u01-json-key">{k}</span>
        <span className="u01-json-colon">{colon}</span>
        <span className="u01-json-val">{rest}</span>
      </div>
    );
  }
  return (
    <div
      key={`${i}-${line.slice(0, 24)}`}
      className={`u01-code-line ${line.startsWith('/*') || line.startsWith('//') ? 'u01-dim' : ''}`}
    >
      {line}
    </div>
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function buildCodeLines(
  r: {
    vol: string;
    energy: EnergyKind;
    mint: string;
    ts: string;
  },
  queryId: number,
  t: (path: string) => string
): string[] {
  const sess = `sess_${(queryId * 9973 + 8191).toString(16)}`;
  const banner = t('u01.termBanner').replace(/\{\{sess\}\}/g, sess);
  const energyJson = t(`u01.jsonEnergy.${r.energy}`);
  const eraVal = t('u01.eraStable');
  return [
    banner,
    t('u01.termSsh'),
    t('u01.termWarnHostKey'),
    t('u01.termAuth'),
    '',
    t('u01.termCmdRead'),
    t('u01.termBraceOpen'),
    `  "${t('u01.jsonKeyEra')}": "${eraVal}",`,
    `  "${t('u01.jsonKeyVol')}": ${r.vol},`,
    `  "${t('u01.jsonKeyEnergy')}": "${energyJson}",`,
    `  "${t('u01.jsonKeyMint')}": ${r.mint},`,
    `  "${t('u01.jsonKeyTs')}": "${r.ts}"`,
    t('u01.termBraceClose'),
    '',
    t('u01.termCmdSha'),
    t('u01.termShaOk'),
    '',
    t('u01.termReadDone'),
  ];
}

export function U01Client() {
  const { t } = useI18n();
  const [queryId, setQueryId] = useState(0);
  const [committed, setCommitted] = useState<string[]>([]);
  const [partial, setPartial] = useState('');
  const [streamDone, setStreamDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [vaultUnits, setVaultUnits] = useState(0);
  const [staked, setStaked] = useState(false);
  const [playToast, setPlayToast] = useState<string | null>(null);

  const readings = useMemo(() => {
    const seed = queryId * 7919 + 104729;
    const vol = clamp(0.08 + (seed % 17) / 500, 0.08, 0.22);
    const mintUsed = clamp(28 + (seed % 41), 28, 92);
    const energy: EnergyKind =
      vol < 0.14 ? 'CONSISTENT' : vol < 0.18 ? 'NOMINAL' : 'BOUNDED';
    const ts = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    return {
      vol: vol.toFixed(2),
      energy,
      mint: String(mintUsed),
      ts,
    };
  }, [queryId]);

  const linesTemplate = useMemo(
    () => buildCodeLines(readings, queryId, t),
    [readings, queryId, t]
  );

  useEffect(() => {
    setCommitted([]);
    setPartial('');
    setStreamDone(false);

    let cancelled = false;
    let lineIndex = 0;
    let charIndex = 0;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const schedule = (fn: () => void, ms: number) => {
      clearTimer();
      timerRef.current = setTimeout(fn, ms);
    };

    const step = () => {
      if (cancelled) return;
      if (lineIndex >= linesTemplate.length) {
        setPartial('');
        setStreamDone(true);
        return;
      }

      const line = linesTemplate[lineIndex];

      if (charIndex < line.length) {
        const next = line.slice(0, charIndex + 1);
        setPartial(next);
        charIndex++;
        const jitter = 9 + Math.floor(mulberry32((lineIndex * 31337 + charIndex) >>> 0)() * 28);
        schedule(step, jitter);
      } else {
        setCommitted((prev) => [...prev, line]);
        setPartial('');
        lineIndex++;
        charIndex = 0;
        const pause = line === '' ? 90 : 110 + Math.floor(Math.random() * 70);
        schedule(step, pause);
      }
    };

    schedule(step, 280);

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [linesTemplate]);

  const volN = Number(readings.vol);
  const mintN = Number(readings.mint);
  const sigBars = useMemo(() => {
    const n = Math.round(clamp((volN - 0.07) / 0.16, 0, 1) * 5);
    return Array.from({ length: 5 }, (_, i) => i < n);
  }, [volN]);

  const energyLabel = t(`u01.jsonEnergy.${readings.energy}`);
  const ticks = useMemo(
    () =>
      [
        [t('u01.tickAes'), 'aes'],
        [t('u01.tickPinned'), 'pin'],
        [t('u01.tickRop'), 'rop'],
        [t('u01.tickNoWrite'), 'nw'],
      ] as const,
    [t]
  );

  const aprSim = useMemo(() => {
    const base = 3.2 + (Number(readings.mint) % 17) * 0.09;
    return staked ? base + volN * 8 : 0;
  }, [readings.mint, staked, volN]);

  const flashToast = (msg: string) => {
    setPlayToast(msg);
    window.setTimeout(() => setPlayToast(null), 3200);
  };

  return (
    <div
      data-universe="u01"
      className="u01-root"
      translate="no"
      style={
        {
          '--u01-vol': String(volN),
          '--u01-mint-pct': String(mintN),
        } as CSSProperties
      }
    >
      <AmbientAudio preset="u01" />

      <div className="u01-bg" aria-hidden>
        <div className="u01-bg-grid" />
        <div className="u01-bg-scan" />
        <div className="u01-bg-vignette" />
        <div className="u01-bg-noise" />
      </div>

      <div className="u01-stage">
        <div className="u01-terminal-wrap">
          <div className="u01-frame-label u01-frame-label-tl">{t('u01.frameTl')}</div>
          <div className="u01-frame-label u01-frame-label-br">{t('u01.frameBr')}</div>
          <div className="u01-terminal-chrome">
            <div className="u01-terminal-head">
              <span className="u01-dot" aria-hidden />
              <span className="u01-dot" aria-hidden />
              <span className="u01-dot" aria-hidden />
              <span className="u01-head-title">{t('u01.headTitle')}</span>
              <span className="u01-head-pulse" title={t('u01.headPulseTitle')}>
                <span aria-hidden className="u01-head-sep">
                  ·
                </span>
                <span className="u01-pulse-dot" />
                {t('u01.live')}
              </span>
            </div>
            <div className="u01-terminal-body">
              <div className="u01-stream">
                {committed.map((line, i) => renderCodeLine(line, i))}
                {!streamDone && (
                  <div className="u01-code-line u01-code-active">
                    {partial}
                    <span className="u01-cursor">▍</span>
                  </div>
                )}
              </div>

              <div className="u01-after u01-after-visible">
                <button
                  type="button"
                  className="u01-run-btn"
                  onClick={() => setQueryId((q) => q + 1)}
                >
                  {t('u01.btnRequery')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="u01-hud" aria-label={t('u01.hudAria')}>
          <div className="u01-hud-block">
            <div className="u01-hud-label">{t('u01.hudLink')}</div>
            <div className="u01-hud-bars" role="presentation">
              {sigBars.map((on, i) => (
                <span key={i} className={`u01-hud-bar ${on ? 'u01-hud-bar-on' : ''}`} />
              ))}
            </div>
            <div className="u01-hud-meta">σ ≈ {readings.vol}</div>
          </div>

          <div className="u01-hud-block">
            <div className="u01-hud-label">{t('u01.hudMint')}</div>
            <div className="u01-hud-meter">
              <div className="u01-hud-meter-fill" />
            </div>
            <div className="u01-hud-meta">
              {readings.mint}
              {t('u01.hudSealedRing')}
            </div>
          </div>

          <div className="u01-hud-block">
            <div className="u01-hud-label">{t('u01.hudState')}</div>
            <div className={`u01-hud-pill u01-hud-pill--${readings.energy.toLowerCase()}`}>
              {energyLabel}
            </div>
            <div className="u01-hud-meta mono">
              {readings.ts.slice(11, 19)}
              {t('u01.hudUtc')}
            </div>
          </div>

          <div className="u01-hud-ticks" aria-hidden>
            {ticks.map(([label, key]) => (
              <span key={key} className="u01-hud-tick">
                {label}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <section className="u01-play-dock" aria-label={t('u01.playTitle')}>
        <div className="u01-play-head">{t('u01.playTitle')}</div>
        <div className="u01-play-grid">
          <div className="u01-play-card">
            <span className="u01-play-k">{t('u01.playVault')}</span>
            <span className="u01-play-v">{vaultUnits}</span>
            <button
              type="button"
              className="u01-play-btn"
              onClick={() => {
                setVaultUnits((u) => u + 1);
                flashToast(t('u01.playMintMsg'));
              }}
            >
              {t('u01.playMint')}
            </button>
          </div>
          <div className="u01-play-card">
            <span className="u01-play-k">{t('u01.playApr')}</span>
            <span className="u01-play-v">{aprSim.toFixed(2)}%</span>
            <button
              type="button"
              className={`u01-play-btn ${staked ? 'u01-play-btn-on' : ''}`}
              onClick={() => {
                setStaked((s) => {
                  const next = !s;
                  flashToast(next ? t('u01.playStakeOn') : t('u01.playStakeOff'));
                  return next;
                });
              }}
            >
              {t('u01.playStake')}
            </button>
          </div>
        </div>
        {playToast ? <p className="u01-play-toast">{playToast}</p> : null}
        <p className="u01-play-disclaimer">{t('u01.playDisclaimer')}</p>
      </section>

      <footer className="u01-footer">
        <HardNavLink href="/">{t('u01.cdHome')}</HardNavLink>
      </footer>
    </div>
  );
}
