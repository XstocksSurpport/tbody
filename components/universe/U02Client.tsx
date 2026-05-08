'use client';

import { InstantNavLink } from '@/components/InstantNavLink';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AmbientAudio } from '@/components/AmbientAudio';
import { dictionaries } from '@/lib/dictionaries';
import { U02_HORIZON_ORDER, type U02HorizonId } from '@/lib/u02Horizons';
import { getEpochSegmentIndex, getMsUntilNextEpoch } from '@/lib/epochSchedule';
import { useI18n } from '@/lib/i18n-context';
import { mulberry32 } from '@/lib/sophonSeed';
import './u02-shell.css';

import type { Locale } from '@/lib/dictionaries';

const LIQ_KEYS = ['fluctuating', 'uncertain', 'reindexing', 'bifurcated'] as const;

function hexDumpLine(seed: number, i: number): string {
  const r = mulberry32((seed + i * 2654435761) >>> 0);
  const chunks: string[] = [];
  for (let w = 0; w < 6; w++) {
    let h = '';
    for (let b = 0; b < 4; b++) {
      h += ((r() * 256) | 0).toString(16).padStart(2, '0');
    }
    chunks.push(h);
  }
  return `${(seed + i * 16).toString(16).padStart(4, '0')}  ${chunks.join('  ')}`;
}

function rollTaxPctDeterministic(epochIndex: number): number {
  const r = mulberry32((epochIndex + 0xfeed) >>> 0);
  return 2 + Math.floor(r() * 17);
}

function pickHorizonDeterministic(epochIndex: number): U02HorizonId {
  const r = mulberry32((epochIndex + 0xbea2) >>> 0);
  const idx = Math.floor(r() * U02_HORIZON_ORDER.length);
  return U02_HORIZON_ORDER[idx];
}

function initialLog(loc: Locale): string[] {
  const boot = dictionaries[loc].u02.boot;
  return [
    ...boot,
    ...Array.from({ length: 8 }, (_, i) => hexDumpLine(0xcafe + i, i)).map(
      (line, i) => `dump ${i}  ${line}`
    ),
  ];
}

/** Days remaining (fractional) — hours shown as 0.xxx d */
function formatRemainDays(ms: number): string {
  if (ms <= 0) return '0.000';
  const d = ms / 86400000;
  return d.toFixed(3);
}

export function U02Client() {
  const { t, locale } = useI18n();
  const loc = (locale ?? 'en') as Locale;

  const [horizonId, setHorizonId] = useState<U02HorizonId>(() => {
    const ep = Math.max(0, getEpochSegmentIndex(Date.now()));
    return pickHorizonDeterministic(ep);
  });
  const [taxPct, setTaxPct] = useState(() => {
    const ep = Math.max(0, getEpochSegmentIndex(Date.now()));
    return rollTaxPctDeterministic(ep);
  });

  const [rulePatch, setRulePatch] = useState<'APPLIED' | 'REVERTED'>('APPLIED');
  const [liq, setLiq] = useState(0);
  const [log, setLog] = useState<string[]>(() => initialLog('en'));
  const [now, setNow] = useState(() => Date.now());
  const [dehydrateOpen, setDehydrateOpen] = useState(false);
  const seedRef = useRef(0x4a17);
  const lastSegRef = useRef(getEpochSegmentIndex(Date.now()));

  useEffect(() => {
    setLog(initialLog(loc));
  }, [loc]);

  useEffect(() => {
    if (!dehydrateOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDehydrateOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dehydrateOpen]);

  useEffect(() => {
    const tick = () => {
      const t0 = Date.now();
      setNow(t0);
      const seg = getEpochSegmentIndex(t0);
      if (seg > lastSegRef.current) {
        lastSegRef.current = seg;
        const ep = Math.max(0, seg);
        const np = rollTaxPctDeterministic(ep);
        setTaxPct(np);
        setRulePatch((p) => (p === 'APPLIED' ? 'REVERTED' : 'APPLIED'));
        setLiq((i) => (i + 1) % LIQ_KEYS.length);
        setHorizonId(pickHorizonDeterministic(ep));
        const stamp = new Date().toISOString().slice(11, 23);
        setLog((lines) =>
          [...lines, `${stamp}  tariff_revision · ${np}%`, `${stamp}  ${t('u02.chaosResetLog')}`].slice(-56)
        );
      }
    };
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [t]);

  const patchLabel = rulePatch === 'APPLIED' ? t('u02.patchApplied') : t('u02.patchReverted');
  const liqLabel = t(`u02.liq.${LIQ_KEYS[liq]}`);

  const remainEpoch = getMsUntilNextEpoch(now);

  const applyDehydration = useCallback(() => {
    const stamp = new Date().toISOString().slice(11, 23);
    setLog((lines) => [...lines, `${stamp}  ${t('u02.dehydrateLog')}`].slice(-56));
    setLiq((i) => (i + 3) % LIQ_KEYS.length);
    seedRef.current ^= 0xc001d;
    setTaxPct((p) => Math.min(18, Math.max(2, p + (seedRef.current % 5) - 2)));
  }, [t]);

  const confirmDehydration = useCallback(() => {
    setDehydrateOpen(false);
    applyDehydration();
  }, [applyDehydration]);

  return (
    <div data-universe="u02" className="u02-root" translate="no">
      <AmbientAudio preset="u02" />

      <div className="u02-pulse-bar">
        <div className="u02-pulse-title">{t('u02.pulseTitle')}</div>
        <div className="u02-pulse-sub">{t('u02.pulseSub')}</div>
      </div>

      <div className="u02-nav">
        <span>{t('u02.navBrand')}</span>
        <InstantNavLink href="/">{t('common.exit')}</InstantNavLink>
      </div>

      <div className="u02-split">
        <div className="u02-stream-wrap">
          <div className="u02-stream-head">{t('u02.streamHead')}</div>
          <div className="u02-stream-body">
            {log.map((line, i) => (
              <div
                key={`${line}-${i}`}
                className={line.startsWith('dump') ? 'u02-stream-line u02-hex-line' : 'u02-stream-line'}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="u02-ridge">
          <div className="u02-ridge-block">
            <h3>{t('u02.ridgeRules')}</h3>
            <dl className="u02-kv">
              <dt>{t('u02.kvPatch')}</dt>
              <dd>{patchLabel}</dd>
            </dl>
            <dl className="u02-kv">
              <dt>{t('u02.kvLiq')}</dt>
              <dd>{liqLabel}</dd>
            </dl>
          </div>

          <div className="u02-ridge-block u02-ridge-horizon">
            <h3>{t('u02.ridgeHorizon')}</h3>
            <div className="u02-horizon-readout" aria-live="polite">
              {t(`u02.horizon.${horizonId}`)}
            </div>
          </div>

          <div className="u02-ridge-block">
            <h3>{t('u02.ridgeTax')}</h3>
            <dl className="u02-kv">
              <dt>{t('u02.kvTaxPct')}</dt>
              <dd className="u02-tax-dd">{taxPct}%</dd>
            </dl>
            <dl className="u02-kv">
              <dt>{t('u02.kvNextRevision')}</dt>
              <dd>
                {formatRemainDays(remainEpoch)} d
                {remainEpoch > 0 && remainEpoch < 86400000
                  ? ` · (${(remainEpoch / 3600000).toFixed(2)} h)`
                  : ''}
              </dd>
            </dl>
            <div className="u02-tax-note">{t('u02.taxNote')}</div>
          </div>

          <div className="u02-ridge-block">
            <h3>{t('u02.ridgeChaos')}</h3>
            <dl className="u02-kv">
              <dt>{t('u02.kvNextChaos')}</dt>
              <dd>{formatRemainDays(remainEpoch)} d</dd>
            </dl>
            <button type="button" className="u02-invasion-btn" onClick={() => setDehydrateOpen(true)}>
              {t('u02.btnInvasion')}
            </button>
          </div>
        </div>
      </div>

      <div className="u02-disclaimer">{t('u02.disclaimer')}</div>

      {dehydrateOpen ? (
        <div
          className="u02-dehydrate-back"
          role="presentation"
          onClick={() => setDehydrateOpen(false)}
        >
          <div
            className="u02-dehydrate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="u02-dehydrate-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 id="u02-dehydrate-title" className="u02-dehydrate-title">
              {t('u02.dehydrateTitle')}
            </h4>
            <p className="u02-dehydrate-body">{t('u02.dehydrateBody')}</p>
            <div className="u02-dehydrate-actions">
              <button type="button" className="u02-dehydrate-cancel" onClick={() => setDehydrateOpen(false)}>
                {t('u02.dehydrateCancel')}
              </button>
              <button type="button" className="u02-dehydrate-confirm" onClick={confirmDehydration}>
                {t('u02.dehydrateConfirm')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
