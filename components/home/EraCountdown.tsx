'use client';

import { useEffect, useState } from 'react';
import { getMsUntilNextEpoch, pad2, splitMsIntoDHMS } from '@/lib/epochSchedule';
import { useI18n } from '@/lib/i18n-context';

/** Fixed-width segments — avoids digit width jitter every second. */
export function EraCountdown() {
  const { locale, t } = useI18n();
  const loc = locale ?? 'en';
  const [leftMs, setLeftMs] = useState(0);

  useEffect(() => {
    const tick = () => setLeftMs(getMsUntilNextEpoch(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const { days, h, m, s } = splitMsIntoDHMS(leftMs);
  const dayDigits = days >= 100 ? String(days) : pad2(days);

  const stableEra = t('panels.u01.era');

  return (
    <div className="mx-auto mt-12 max-w-[52rem] border border-emerald-500/25 bg-black/40 px-5 py-4 text-center backdrop-blur-[2px] md:mt-16 md:px-8 md:py-5">
      <div className="font-mono text-[9px] tracking-[0.28em] text-[#6a7179] md:text-[10px]">
        <span>{t('home.eraCurrentLabel')}</span>
        <span className="mx-2 text-[#4f565e]">·</span>
        <span className="text-emerald-200/95">{stableEra}</span>
      </div>
      <div className="font-mono mt-4 text-[9px] tracking-[0.26em] text-[#6a7179] md:text-[10px]">{t('home.eraNextLabel')}</div>
      <div
        className="font-mono mt-3 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-[clamp(1rem,4vw,1.35rem)] tabular-nums tracking-normal text-emerald-300/95"
        style={{ fontFeatureSettings: '"tnum" 1' }}
        aria-live="polite"
      >
        <span className="inline-flex min-w-[5.25rem] items-baseline justify-end gap-1 font-mono">
          <span className="inline-block min-w-[2.75ch] text-right">{dayDigits}</span>
          <span className="inline-block w-[1em] shrink-0 text-center text-[0.92em] opacity-95">
            {loc === 'zh' ? '天' : 'd'}
          </span>
        </span>
        <span className="inline-block min-w-[9.25ch] whitespace-nowrap tracking-[0.14em]">
          {pad2(h)}:{pad2(m)}:{pad2(s)}
        </span>
      </div>
    </div>
  );
}
