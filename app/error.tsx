'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useOptionalI18n } from '@/lib/i18n-context';

const FAULT_FALLBACK: Record<string, string> = {
  'fault.tag': '[ fault ]',
  'fault.title': 'Something broke',
  'fault.digest': 'digest',
  'fault.retry': 'retry',
  'fault.home': '← home',
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const i18n = useOptionalI18n();
  const t = useMemo(() => {
    if (i18n) return i18n.t;
    return (path: string) => FAULT_FALLBACK[path] ?? path;
  }, [i18n]);

  return (
    <div className="shell">
      <main className="mx-auto max-w-xl px-7 py-12 md:px-8">
        <p className="system-tag">{t('fault.tag')}</p>
        <h1 className="enter-title">{t('fault.title')}</h1>
        <p className="subtle" style={{ marginTop: 14, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {error.message || 'Unknown error'}
        </p>
        {error.digest ? (
          <p className="subtle" style={{ marginTop: 10, opacity: 0.65 }}>
            {t('fault.digest')} {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" className="ctrl ctrl-primary" onClick={() => reset()}>
            {t('fault.retry')}
          </button>
          <Link href="/" className="ctrl" prefetch>
            {t('fault.home')}
          </Link>
        </div>
      </main>
    </div>
  );
}
