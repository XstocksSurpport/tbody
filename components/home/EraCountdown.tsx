'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import { getMsUntilNextEpoch, pad2, splitMsIntoDHMS } from '@/lib/epochSchedule';
import { useI18n } from '@/lib/i18n-context';

/** Fixed-width segments — avoids digit width jitter every second. */
export function EraCountdown() {
  const { locale, t } = useI18n();
  const loc = locale ?? 'en';
  /** `null` until first client tick — avoids SSR/hydration showing a bogus 00:00:00 and matches figure layout after sync. */
  const [leftMs, setLeftMs] = useState<number | null>(null);

  const tick = useCallback(() => {
    setLeftMs(getMsUntilNextEpoch(Date.now()));
  }, []);

  useLayoutEffect(() => {
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
  }, [tick]);

  const { days, h, m, s } = splitMsIntoDHMS(leftMs ?? 0);
  const dayDigits = days >= 100 ? String(days) : pad2(days);
  const stableEra = t('panels.u01.era');
  const ready = leftMs !== null;

  return (
    <div className="mx-auto mt-12 max-w-[52rem] border border-emerald-500/25 bg-black/40 px-5 py-4 text-center backdrop-blur-[2px] md:mt-16 md:px-8 md:py-5">
      <div className="font-mono text-[9px] tracking-[0.28em] text-[#6a7179] md:text-[10px]">
        <span>{t('home.eraCurrentLabel')}</span>
        <span className="mx-2 text-[#4f565e]">·</span>
        <span className="text-emerald-200/95">{stableEra}</span>
      </div>
      <div className="font-mono mt-4 text-[9px] tracking-[0.26em] text-[#6a7179] md:text-[10px]">{t('home.eraNextLabel')}</div>
      <div
        className="font-mono mt-3 flex flex-nowrap items-baseline justify-center gap-x-2 text-[clamp(1rem,4vw,1.35rem)] tabular-nums tracking-normal text-emerald-300/95 sm:gap-x-3"
        style={{ fontFeatureSettings: '"tnum" 1' }}
        aria-live="polite"
      >
        {!ready ? (
          <span className="inline-block min-h-[1.35em] whitespace-nowrap text-emerald-300/35" aria-hidden>
            …
          </span>
        ) : loc === 'zh' ? (
          <span className="inline-block max-w-[100vw] whitespace-nowrap px-1">
            {dayDigits}天 {pad2(h)}:{pad2(m)}:{pad2(s)}
          </span>
        ) : (
          <span className="inline-flex max-w-[100vw] flex-nowrap items-baseline justify-center gap-x-2 whitespace-nowrap px-1 sm:gap-x-3">
            <span className="inline-flex shrink-0 items-baseline gap-1 font-mono">
              <span className="inline-block min-w-[2.75ch] text-right">{dayDigits}</span>
              <span className="inline-block shrink-0 text-[0.92em] opacity-95">d</span>
            </span>
            <span className="inline-block min-w-[9.25ch] shrink-0 whitespace-nowrap tracking-[0.14em]">
              {pad2(h)}:{pad2(m)}:{pad2(s)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
