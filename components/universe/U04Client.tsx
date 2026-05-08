'use client';

import { InstantNavLink } from '@/components/InstantNavLink';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react';
import { AmbientAudio } from '@/components/AmbientAudio';
import { mulberry32 } from '@/lib/sophonSeed';
import { useI18n } from '@/lib/i18n-context';
import './u04-shell.css';

type RadarDot = {
  id: number;
  cx: number;
  cy: number;
  risk: number;
  addr: string;
  full: string;
};

function openDotFromPointer(e: PointerEvent<SVGCircleElement>, open: () => void) {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  e.preventDefault();
  open();
}

function buildDots(seed: number): RadarDot[] {
  const r = mulberry32(seed >>> 0);
  const out: RadarDot[] = [];
  for (let i = 0; i < 54; i++) {
    const angle = r() * Math.PI * 2;
    const dist = 0.14 + r() * 0.78;
    let hex = '';
    for (let k = 0; k < 40; k++) hex += Math.floor(r() * 16).toString(16);
    const full = `0x${hex}` as const;
    const addr = `${full.slice(0, 6)}…${full.slice(-4)}`;
    const cx = 200 + Math.cos(angle) * dist * 175;
    const cy = 200 + Math.sin(angle) * dist * 175;
    out.push({
      id: i,
      cx,
      cy,
      risk: 0.12 + r() * 0.88,
      addr,
      full,
    });
  }
  return out;
}

export function U04Client() {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [silent, setSilent] = useState(false);
  const [exposure, setExposure] = useState(18);
  const [observed, setObserved] = useState(false);
  const [signalLevel] = useState<'LATENT' | 'ACTIVE'>('ACTIVE');
  const [dotSeed] = useState(() => (Math.random() * 1e9) | 0);
  const dots = useMemo(() => buildDots(dotSeed), [dotSeed]);
  const [selected, setSelected] = useState<RadarDot | null>(null);
  const [modalToast, setModalToast] = useState<string | null>(null);

  const touchExposure = useCallback((delta: number) => {
    setExposure((e) => Math.min(100, Math.max(0, e + delta)));
    if (delta > 0) setObserved(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let ang = 0;
    const loop = () => {
      ang += 0.005;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * 0.52;
      const cy = canvas.height * 0.5;
      const rmax = Math.min(canvas.width, canvas.height) * 0.42;

      ctx.strokeStyle = 'rgba(35, 110, 65, 0.2)';
      ctx.lineWidth = 1;
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (rmax * ring) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(45, 140, 85, 0.35)';
      ctx.beginPath();
      ctx.moveTo(cx - rmax, cy);
      ctx.lineTo(cx + rmax, cy);
      ctx.moveTo(cx, cy - rmax);
      ctx.lineTo(cx, cy + rmax);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(90, 210, 130, 0.32)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * rmax, cy + Math.sin(ang) * rmax);
      ctx.stroke();

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const riskLabel =
    exposure < 35
      ? t('u04.riskElevated')
      : exposure < 65
        ? t('u04.riskHigh')
        : exposure < 88
          ? t('u04.riskCritical')
          : t('u04.riskMaximum');

  const signalLabel =
    signalLevel === 'LATENT' ? t('u04.signalLatent') : t('u04.signalActive');

  const trackingLabel = exposure > 55 ? t('u04.trackHigh') : t('u04.trackModerate');

  const flushModal = (msg: string) => {
    setModalToast(msg);
    window.setTimeout(() => setModalToast(null), 4200);
  };

  if (silent) {
    return (
      <div data-universe="u04" className="u04-root" translate="no">
        <AmbientAudio preset="u04" />
        <InstantNavLink href="/" className="u04-exit">
          {t('common.exit')}
        </InstantNavLink>
        <div className="u04-silent">
          <div className="u04-silent-inner">
            <div className="u04-silent-title">{t('u04.silentTitle')}</div>
            <button
              type="button"
              className="u04-silent-btn"
              onClick={() => {
                setSilent(false);
                touchExposure(6);
              }}
            >
              {t('u04.silentBreak')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-universe="u04" className="u04-root" translate="no">
      <canvas ref={canvasRef} className="u04-canvas" aria-hidden />

      <AmbientAudio preset="u04" />

      <div className="u04-hud-tl">
        {t('u04.hudTl')}
        <strong>{t('u04.hudTlStrong')}</strong>
      </div>

      <InstantNavLink href="/" className="u04-exit">
        {t('common.exit')}
      </InstantNavLink>

      <div className="u04-radar-wrap">
        <div className="u04-radar-head">{t('u04.radarTitle')}</div>
        <svg
          className="u04-radar-svg"
          viewBox="0 0 400 400"
          role="img"
          aria-label={t('u04.radarHint')}
        >
          <circle cx="200" cy="200" r="175" fill="none" stroke="rgba(40,120,75,0.25)" strokeWidth="1" />
          <circle cx="200" cy="200" r="132" fill="none" stroke="rgba(40,120,75,0.18)" strokeWidth="1" />
          <circle cx="200" cy="200" r="88" fill="none" stroke="rgba(40,120,75,0.14)" strokeWidth="1" />
          <circle cx="200" cy="200" r="44" fill="none" stroke="rgba(40,120,75,0.12)" strokeWidth="1" />
          <line x1="200" y1="25" x2="200" y2="375" stroke="rgba(45,140,85,0.22)" strokeWidth="1" />
          <line x1="25" y1="200" x2="375" y2="200" stroke="rgba(45,140,85,0.22)" strokeWidth="1" />
          <g className="u04-radar-sweep-arm">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 200 200"
              to="360 200 200"
              dur="14s"
              repeatCount="indefinite"
            />
            <line
              x1="200"
              y1="200"
              x2="375"
              y2="200"
              stroke="rgba(90, 210, 130, 0.42)"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </g>
          {dots.map((d) => {
            const alpha = 0.22 + d.risk * 0.72;
            const fill = `rgba(${220 - d.risk * 80}, ${30 + (1 - d.risk) * 40}, ${40 + (1 - d.risk) * 30}, ${alpha})`;
            return (
              <circle
                key={d.id}
                cx={d.cx}
                cy={d.cy}
                r={2.2 + d.risk * 6}
                fill={fill}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="0.5"
                className="u04-radar-dot"
                style={{ cursor: 'pointer', touchAction: 'manipulation' }}
                tabIndex={0}
                role="button"
                aria-label={`${d.addr} · ${t('u04.radarHint')}`}
                onPointerDown={(e) => openDotFromPointer(e, () => setSelected(d))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(d);
                  }
                }}
              />
            );
          })}
        </svg>
        <p className="u04-radar-hint">{t('u04.radarHint')}</p>
      </div>

      <aside className="u04-hud-br">
        <h2>{t('u04.forestStatus')}</h2>
        <dl className="u04-stat">
          <dt>{t('u04.statSignal')}</dt>
          <dd>{signalLabel}</dd>
        </dl>
        <dl className="u04-stat">
          <dt>{t('u04.statExposure')}</dt>
          <dd style={{ color: '#c85858' }}>{riskLabel}</dd>
        </dl>
        <dl className="u04-stat">
          <dt>{t('u04.statTracking')}</dt>
          <dd>{trackingLabel}</dd>
        </dl>
        <dl className="u04-stat">
          <dt>{t('u04.statIndex')}</dt>
          <dd>{exposure}%</dd>
        </dl>

        {observed ? <div className="u04-warn">{t('u04.warnPassive')}</div> : null}

        <div className="u04-actions">
          <button type="button" onClick={() => touchExposure(15)}>
            {t('u04.btnQuery')}
          </button>
          <button type="button" onClick={() => touchExposure(10)}>
            {t('u04.btnLog')}
          </button>
          <button type="button" onClick={() => setSilent(true)}>
            {t('u04.btnSilent')}
          </button>
        </div>

        <div className="u04-note">{t('u04.note')}</div>
      </aside>

      {selected ? (
        <div
          className="u04-modal-back"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <div
            className="u04-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="u04-modal-addr">{selected.full}</div>
            <div className="u04-modal-display">{selected.addr}</div>
            <p className="u04-modal-risk">
              {t('u04.modalRisk')} · {(selected.risk * 100).toFixed(0)}
            </p>
            <div className="u04-modal-actions">
              <button type="button" onClick={() => flushModal(t('u04.modalRaid'))}>
                {t('u04.btnRaid')}
              </button>
              <button type="button" onClick={() => flushModal(t('u04.modalInvade'))}>
                {t('u04.btnInvade')}
              </button>
              <button type="button" onClick={() => flushModal(t('u04.modalTrack'))}>
                {t('u04.btnTrack')}
              </button>
            </div>
            {modalToast ? <p className="u04-modal-toast">{modalToast}</p> : null}
            <p className="u04-modal-disclaimer">{t('u04.modalDisclaimer')}</p>
            <button type="button" className="u04-modal-close" onClick={() => setSelected(null)}>
              {t('u04.modalClose')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
