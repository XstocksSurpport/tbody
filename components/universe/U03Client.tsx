'use client';

import { HardNavLink } from '@/components/HardNavLink';
import { useAccount } from 'wagmi';
import { useCallback, useMemo, useState } from 'react';
import { AmbientAudio } from '@/components/AmbientAudio';
import { formatCorruptedPrice, hashSeed, mulberry32 } from '@/lib/sophonSeed';
import { useI18n } from '@/lib/i18n-context';
import './u03-shell.css';

export function U03Client() {
  const { t } = useI18n();
  const { address } = useAccount();
  const [refreshEpoch, setRefreshEpoch] = useState(0);
  const [hoverField, setHoverField] = useState<string | null>(null);
  const [contamination, setContamination] = useState(0);
  const [ghostBanner, setGhostBanner] = useState<string | null>(null);
  const [cognitiveDepth, setCognitiveDepth] = useState(44);
  const [playToast, setPlayToast] = useState<string | null>(null);

  const channelId = address ?? 'NO_CHANNEL';

  const bundle = useMemo(() => {
    const seedA = hashSeed([channelId, String(refreshEpoch), 'A']);
    const seedB = hashSeed([channelId, String(refreshEpoch), 'B']);
    const ra = mulberry32(seedA);
    const rb = mulberry32(seedB ^ 0xfeedface);
    const integrityA = Math.floor(ra() * 52) + 38;
    const integrityB = Math.floor(rb() * 48) + 30;
    const priceA = formatCorruptedPrice(ra);
    const priceB = formatCorruptedPrice(rb);
    const priceGhost = formatCorruptedPrice(mulberry32(seedA ^ 0xdeadbeef));
    const feedAKey =
      integrityA > 72 ? 'compromised' : integrityA > 55 ? 'degraded' : 'drift';
    const feedBKey =
      integrityB > 65 ? 'echoUnstable' : integrityB > 45 ? 'ghostLayer' : 'nullConsensus';
    const gapKey = ra() > 0.45 ? 'noRead' : 'masked';
    const signalAKey = ra() > 0.5 ? 'unverified' : 'routedRelay7';
    const signalBKey = rb() > 0.5 ? 'relay3phase' : 'unstaged';
    return {
      integrityA,
      integrityB,
      priceA,
      priceB,
      priceGhost,
      feedAKey,
      feedBKey,
      gapKey,
      signalAKey,
      signalBKey,
    };
  }, [channelId, refreshEpoch]);

  const refresh = useCallback(() => setRefreshEpoch((e) => e + 1), []);

  const contaminate = useCallback(() => {
    setContamination((c) => Math.min(100, c + 11));
    setGhostBanner('ghost');
    window.setTimeout(() => setGhostBanner(null), 2800);
  }, []);

  const flashToast = (msg: string) => {
    setPlayToast(msg);
    window.setTimeout(() => setPlayToast(null), 2800);
  };

  const bellPhi = Math.abs(bundle.integrityA - bundle.integrityB);
  const skewFromDepth = Math.min(99, Math.round(bellPhi + cognitiveDepth * 0.08));

  const priceHover = hoverField === 'PRICE' ? bundle.priceGhost : bundle.priceA;

  const feedA = t(`u03.feedA.${bundle.feedAKey}`);
  const feedB = t(`u03.feedB.${bundle.feedBKey}`);
  const gapField = t(`u03.gap.${bundle.gapKey}`);
  const signalA = t(`u03.signalA.${bundle.signalAKey}`);
  const signalB = t(`u03.signalB.${bundle.signalBKey}`);

  return (
    <div data-universe="u03" className="u03-root" translate="no">
      <div className="u03-noise" aria-hidden />

      <AmbientAudio preset="u03" />

      <header className="u03-header">
        <div className="u03-kicker">{t('u03.kicker')}</div>
        <h1 className="u03-title">{t('u03.title')}</h1>
        <HardNavLink href="/" className="u03-exit">
          {t('common.exit')}
        </HardNavLink>
      </header>

      <div className="u03-stage">
        <section className="u03-panel-a">
          <h2 className="u03-panel-label">{t('u03.panelPrimary')}</h2>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowIntegrity')}</span>
            <span className="u03-v">{bundle.integrityA}%</span>
          </div>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowPrice')}</span>
            <span
              className="u03-v u03-val-interference"
              onMouseEnter={() => setHoverField('PRICE')}
              onMouseLeave={() => setHoverField(null)}
            >
              {priceHover}
            </span>
          </div>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowFeed')}</span>
            <span className="u03-v">{feedA}</span>
          </div>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowSource')}</span>
            <span className="u03-v">{signalA}</span>
          </div>
        </section>

        <section className="u03-panel-b">
          <h2 className="u03-panel-label">{t('u03.panelShadow')}</h2>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowIntegrity')}</span>
            <span className="u03-v">{bundle.integrityB}%</span>
          </div>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowPrice')}</span>
            <span className="u03-v">{bundle.priceB}</span>
          </div>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowFeed')}</span>
            <span className="u03-v">{feedB}</span>
          </div>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowSource')}</span>
            <span className="u03-v">{signalB}</span>
          </div>
          <div className="u03-row">
            <span className="u03-k">{t('u03.rowRegistry')}</span>
            <span className="u03-v">{gapField}</span>
          </div>
        </section>

        {ghostBanner && <div className="u03-rift">{t('u03.ghostBanner')}</div>}

        <section className="u03-interact" aria-label={t('u03.playTitle')}>
          <h3 className="u03-interact-title">{t('u03.playTitle')}</h3>
          <label className="u03-interact-label" htmlFor="u03-cognitive">
            {t('u03.sliderCognitive')} · {cognitiveDepth}%
          </label>
          <input
            id="u03-cognitive"
            className="u03-range"
            type="range"
            min={0}
            max={100}
            value={cognitiveDepth}
            onChange={(e) => setCognitiveDepth(Number(e.target.value))}
          />
          <div className="u03-bell-meter">
            <span>{t('u03.meterBell')}</span>
            <span className="u03-bell-val">{skewFromDepth}%</span>
          </div>
          <div className="u03-interact-row">
            <button
              type="button"
              className="u03-btn u03-btn-accent"
              onClick={() => {
                refresh();
                flashToast(t('u03.toastProbe'));
              }}
            >
              {t('u03.btnBellProbe')}
            </button>
            <button
              type="button"
              className="u03-btn u03-btn-accent"
              onClick={() => {
                contaminate();
                flashToast(t('u03.toastPulse'));
              }}
            >
              {t('u03.btnCognitivePulse')}
            </button>
          </div>
          {playToast ? <p className="u03-interact-toast">{playToast}</p> : null}
          <p className="u03-interact-disclaimer">{t('u03.playDisclaimer')}</p>
        </section>

        <div className="u03-actions">
          <button type="button" className="u03-btn" onClick={refresh}>
            {t('u03.btnResample')}
          </button>
          <button type="button" className="u03-btn" onClick={contaminate}>
            {t('u03.btnDecohere')}
          </button>
          <span className="u03-meta">
            {t('u03.metaDrift')} {contamination}%
          </span>
        </div>
      </div>
    </div>
  );
}
