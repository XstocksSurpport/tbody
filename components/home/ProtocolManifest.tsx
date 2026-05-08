'use client';

import { useI18n } from '@/lib/i18n-context';

/** Cold worldview line + oversized protocol mark — minimal, slow, institutional (CSS animation). */
export function ProtocolManifest() {
  const { t } = useI18n();

  return (
    <div className="mt-6 md:mt-8">
      <p className="mx-auto max-w-[56ch] font-mono text-[9px] leading-relaxed tracking-[0.28em] text-sky-200/35 md:text-[10px] lg:mx-0">
        {t('home.manifestLine')}
      </p>
      <div className="protocol-manifest-hero mt-10 md:mt-12">
        <div className="font-mono text-[clamp(2.6rem,13vw,5rem)] font-extralight tabular-nums tracking-[0.48em] text-[#f0f3f6]/[0.88]">
          {t('home.heroMark')}
        </div>
        <p className="font-mono mt-4 max-w-[52ch] text-[9px] tracking-[0.32em] text-[#5c646e] md:text-[10px]">
          {t('home.heroInfraLine')}
        </p>
      </div>
    </div>
  );
}
