'use client';

import { useId } from 'react';
import { useI18n } from '@/lib/i18n-context';

/** Pseudo-scientific credibility — static SVG curve + abstract supply axioms (no charts library). */
export function EntropyMicroStrip() {
  const { t } = useI18n();
  const gradId = useId().replace(/:/g, '');

  return (
    <div className="border-t border-white/[0.06] px-5 py-5">
      <div className="font-mono text-[8px] tracking-[0.28em] text-[#5c636b]">{t('home.microEntropyLabel')}</div>
      <p className="font-mono mt-2 text-[8px] leading-relaxed tracking-[0.14em] text-[#454c54]">{t('home.microEntropyCaption')}</p>
      <svg
        className="mt-4 h-10 w-full text-sky-400/45"
        viewBox="0 0 120 28"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`entropy-fill-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(120, 185, 210, 0.14)" />
            <stop offset="100%" stopColor="rgba(10, 14, 18, 0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 20 L15 17 L30 21 L45 12 L60 18 L75 10 L90 15 L105 11 L120 14 L120 28 L0 28 Z"
          fill={`url(#entropy-fill-${gradId})`}
        />
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          points="0,20 15,17 30,21 45,12 60,18 75,10 90,15 105,11 120,14"
        />
      </svg>
      <dl className="font-mono mt-5 space-y-3 border-t border-white/[0.05] pt-4 text-[8px] tracking-[0.18em]">
        <div className="flex justify-between gap-3">
          <dt className="text-[#5a6169]">{t('home.axiomSupply')}</dt>
          <dd className="text-right text-[#8a929b]">{t('home.axiomSupplyVal')}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#5a6169]">{t('home.axiomInflation')}</dt>
          <dd className="text-right text-[#8a929b]">{t('home.axiomInflationVal')}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#5a6169]">{t('home.axiomExtraction')}</dt>
          <dd className="text-right text-[#8a929b]">{t('home.axiomExtractionVal')}</dd>
        </div>
      </dl>
    </div>
  );
}
