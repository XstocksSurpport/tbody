'use client';

import './home-animations.css';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import type { ObservationPanelId } from '@/lib/universeCopy';
import { InstantNavLink } from '@/components/InstantNavLink';
import { useI18n } from '@/lib/i18n-context';
import { CssSystemBackdrop } from './CssSystemBackdrop';
import { NoiseFilm } from './NoiseFilm';
import { EraCountdown } from './EraCountdown';
import { ProtocolManifest } from './ProtocolManifest';

const WalletStrip = dynamic(
  () => import('./WalletStrip').then((m) => ({ default: m.WalletStrip })),
  {
    ssr: false,
    loading: () => <div className="h-9 w-[min(100%,140px)] shrink-0 rounded bg-white/[0.04]" aria-hidden />,
  }
);

const SatoAirdropPanel = dynamic(
  () => import('./SatoAirdropPanel').then((m) => ({ default: m.SatoAirdropPanel })),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto mt-5 h-[140px] w-full max-w-[52rem] rounded border border-white/[0.06] bg-white/[0.02] md:mt-6"
        aria-hidden
      />
    ),
  }
);

const EntropyMicroStrip = dynamic(() =>
  import('./EntropyMicroStrip').then((m) => ({ default: m.EntropyMicroStrip }))
);

const ProtocolTelemetry = dynamic(() =>
  import('./ProtocolTelemetry').then((m) => ({ default: m.ProtocolTelemetry }))
);

const StellarIgnition = dynamic(() =>
  import('./StellarIgnition').then((m) => ({ default: m.StellarIgnition })),
  {
    loading: () => (
      <div className="mt-12 min-h-[160px] rounded border border-white/[0.06] bg-black/25" aria-hidden />
    ),
  }
);

const PANEL_ORDER: ObservationPanelId[] = ['u01', 'u02', 'u03', 'u04'];

const CORRIDOR_CODE_CLASS: Record<ObservationPanelId, string> = {
  u01: 'text-corridor-u01',
  u02: 'text-corridor-u02',
  u03: 'text-corridor-u03',
  u04: 'text-corridor-u04',
};

const CORRIDOR_RGB: Record<ObservationPanelId, string> = {
  u01: '47, 216, 122',
  u02: '212, 165, 116',
  u03: '158, 185, 232',
  u04: '110, 184, 150',
};

export function HomeView() {
  const { locale, t } = useI18n();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  /** Idle-load GSAP so first paint + taps stay responsive (dev compile & wagmi not blocked). */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    const loadAnim = () => {
      void (async () => {
        const { gsap } = await import('gsap');
        if (cancelled) return;
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        if (!titleRef.current && !subRef.current) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        if (titleRef.current) {
          tl.from(titleRef.current, { opacity: 0, y: 10, duration: reduceMotion ? 0.35 : 1.2 }, 0);
        }
        if (subRef.current) {
          tl.from(subRef.current, { opacity: 0, duration: reduceMotion ? 0.25 : 1.2 }, reduceMotion ? 0 : 0.28);
        }
      })();
    };

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadAnim, { timeout: 1600 });
    } else {
      // Use global timers: TS narrows `window` oddly after the ric check in some lib setups.
      timeoutId = globalThis.setTimeout(loadAnim, 80);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [locale]);

  return (
    <div className="relative z-10 min-h-[100dvh] bg-[#010101] text-[#d0d5dc]">
      <CssSystemBackdrop />
      <NoiseFilm />

      <div
        className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_85%_65%_at_50%_-8%,rgba(35,55,75,0.14)_0%,transparent_55%),radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(0,0,0,0.85)_0%,transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[2] bg-gradient-to-b from-black/20 via-transparent to-black/90"
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/[0.06] bg-black/20 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 md:px-10">
          <div className="flex min-w-0 flex-wrap items-center gap-3 md:gap-5">
            <span className="font-mono text-[10px] tracking-[0.34em] text-[#e8eaed]">{t('home.brand')}</span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <WalletStrip />
            <div className="flex items-center gap-2.5 font-mono text-[8px] tracking-[0.2em] text-[#4f565e]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500/90" />
              </span>
              {t('home.uplink')}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1200px] px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14">
        <section className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-end lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="font-mono text-[9px] tracking-[0.38em] text-[#5a6169] md:text-[10px]">{t('home.coordLine')}</p>
            <ProtocolManifest />
            <EraCountdown />
            <SatoAirdropPanel />
            <h1
              ref={titleRef}
              className="font-mono mt-6 text-[clamp(1.05rem,3.8vw,1.85rem)] font-normal tracking-[0.38em] text-[#eef1f5] md:tracking-[0.42em]"
            >
              {t('home.title')}
            </h1>
            <p
              ref={subRef}
              className="font-grotesk mx-auto mt-10 max-w-[48ch] text-[10px] font-normal leading-relaxed tracking-[0.36em] text-[#5e656e] md:mx-0 md:text-[11px]"
            >
              {t('home.subtitle')}
            </p>
          </div>

          <aside
            className="mx-auto w-full max-w-sm border border-white/[0.07] bg-black/55 font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md lg:mx-0 lg:max-w-none"
            aria-label={t('home.sessionBar')}
          >
            <div className="border-b border-white/[0.06] px-5 py-3 text-[8px] tracking-[0.28em] text-[#5c636b]">
              {t('home.sessionBar')}
            </div>
            <dl className="space-y-5 px-5 py-6 text-[9px] tracking-[0.14em]">
              <div className="flex justify-between gap-4 border-b border-white/[0.04] pb-4">
                <dt className="text-[#6a7179]">{t('home.parallelChannels')}</dt>
                <dd className="text-[#b8c0c9]">04</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/[0.04] pb-4">
                <dt className="text-[#6a7179]">{t('home.routing')}</dt>
                <dd className="text-right text-[#b8c0c9]">{t('home.routingVal')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6a7179]">{t('home.writePath')}</dt>
                <dd className="text-[#8a929b]">{t('home.writePathVal')}</dd>
              </div>
            </dl>
            <EntropyMicroStrip />
          </aside>
        </section>

        <ProtocolTelemetry />

        <StellarIgnition />

        <section
          className="relative z-30 mt-20 isolate md:mt-28"
          aria-label={t('home.corridorMap')}
        >
          <div className="mb-8 border-b border-white/[0.06] pb-6">
            <div className="min-w-0">
              <h2 className="font-mono text-[10px] tracking-[0.28em] text-[#8e959e]">{t('home.corridorMap')}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-px md:bg-white/[0.07] md:p-px lg:grid-cols-4">
            {PANEL_ORDER.map((pid, i) => {
              const codeClass = CORRIDOR_CODE_CLASS[pid];
              const rgb = CORRIDOR_RGB[pid];
              const corridorCode = `U-${pid.slice(1)}`;
              const era = t(`panels.${pid}.era`);
              const panelLine = t(`panels.${pid}.panelLine`);
              const statusLine = t(`panels.${pid}.statusLine`);
              const keywords = t(`panels.${pid}.keywords`)
                .split('|')
                .map((s) => s.trim())
                .filter(Boolean);
              return (
                <div key={pid} className="min-h-0 md:bg-black">
                  <InstantNavLink
                    href={`/${pid}`}
                    className="group relative z-[1] flex min-h-[260px] flex-col overflow-hidden rounded-none border border-white/[0.07] border-b-0 bg-[#030303] p-6 text-[#d0d5dc] no-underline transition-[background-color,box-shadow,border-color] duration-200 touch-manipulation [-webkit-tap-highlight-color:transparent] active:bg-white/[0.06] md:min-h-[300px] md:border-0"
                  >
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(90deg, rgba(${rgb},0.05) 0%, rgba(${rgb},0.95) 42%, rgba(${rgb},0.25) 100%)`,
                      }}
                      aria-hidden
                    />
                    <span
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at center, rgba(${rgb}, 0.2) 0%, transparent 68%)`,
                      }}
                      aria-hidden
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <span className={`font-mono text-[10px] tracking-[0.34em] ${codeClass}`}>{corridorCode}</span>
                      <span className="font-mono text-[9px] tabular-nums tracking-[0.14em] text-[#454c54]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <span className="font-grotesk relative mt-8 text-[11px] tracking-[0.26em] text-[#c5ccd4]">{era}</span>

                    <p className="font-mono relative mt-3 text-[10px] leading-relaxed tracking-[0.14em] text-[#7b828a]">
                      {panelLine}
                    </p>

                    <div className="relative mt-5 grid min-h-[112px] flex-1 grid-cols-2 gap-2 content-start md:min-h-[120px]">
                      {keywords.map((kw, idx) => {
                        const oddLast =
                          keywords.length % 2 === 1 && idx === keywords.length - 1;
                        return (
                          <span
                            key={`${pid}-${kw}-${idx}`}
                            className={`flex min-h-[2.75rem] min-w-0 items-center justify-center rounded border bg-black/35 px-2 py-2 text-center font-mono text-[9px] leading-snug tracking-[0.08em] text-[#a8b0b8] md:min-h-[3rem] md:text-[10px] md:tracking-[0.1em] ${
                              oddLast ? 'col-span-2' : ''
                            }`}
                            style={{
                              borderColor: `rgba(${rgb},0.32)`,
                              boxShadow: `inset 0 0 0 1px rgba(${rgb},0.06)`,
                            }}
                          >
                            {kw}
                          </span>
                        );
                      })}
                    </div>

                    <div className="relative mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
                      <span className="font-mono text-[9px] tracking-[0.18em] text-[#555c64]">{statusLine}</span>
                      <span
                        className="font-mono text-[9px] tracking-[0.24em] text-[#4f565e] transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-[#9aa3ad]"
                        aria-hidden
                      >
                        {t('home.enter')}
                      </span>
                    </div>
                  </InstantNavLink>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-20 border-t border-white/[0.06] pt-12 text-center md:mt-28">
          <div className="font-mono text-[9px] tracking-[0.28em] text-[#3f454c]">
            <div>{t('home.migration1')}</div>
            <div className="mt-3">{t('home.migration2')}</div>
          </div>
          <div className="mx-auto mt-14 flex flex-col items-center gap-8">
            <div
              className="h-px w-16 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
              aria-hidden
            />
            <a
              href="https://x.com/3body_ca"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('home.socialXLabel')}
              className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-[radial-gradient(ellipse_90%_90%_at_50%_40%,rgba(255,255,255,0.06)_0%,transparent_72%)] text-[#7a828c] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[color,border-color,box-shadow,transform] duration-500 hover:border-white/[0.18] hover:text-[#d7dde4] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_0_24px_rgba(255,255,255,0.04)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/25 active:scale-[0.98] motion-reduce:transition-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[15px] w-[15px] opacity-[0.92] transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
