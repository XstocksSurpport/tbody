'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n-context';

/** Scroll-revealed protocol console — IntersectionObserver + CSS (no Framer viewport API). */
export function ProtocolTelemetry() {
  const { locale, t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const lines = useMemo(
    () =>
      t('home.protocolLogs')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
    [locale, t]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { root: null, rootMargin: '-48px 0px', threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={t('home.protocolTelemetryAria')}
      className={`protocol-telemetry-panel relative z-[5] mt-16 border border-white/[0.06] bg-black/35 px-4 py-5 backdrop-blur-[2px] md:mt-20 md:px-6 md:py-6 ${visible ? 'is-visible' : ''}`}
    >
      <div className="mb-4 font-mono text-[8px] tracking-[0.35em] text-[#4f565e]">{t('home.protocolTelemetryLabel')}</div>
      <ul className="space-y-2.5 font-mono text-[8px] leading-relaxed tracking-[0.12em] text-[#7d868f] md:text-[9px] md:tracking-[0.14em]">
        {lines.map((line, i) => (
          <li key={`${i}-${line.slice(0, 12)}`} className="flex gap-3 border-l border-emerald-500/15 pl-3">
            <span className="shrink-0 tabular-nums text-[#454c54]">{String(i + 1).padStart(2, '0')}</span>
            <span className="min-w-0 text-[#9aa3ad]">{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
