'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useOptionalI18n } from '@/lib/i18n-context';

const NF_FALLBACK: Record<string, string> = {
  'notFound.brand': '3BODY',
  'notFound.tag': '[ 404 ]',
  'notFound.title': 'Not found',
  'notFound.back': '← home',
};

export default function NotFound() {
  const i18n = useOptionalI18n();
  const t = useMemo(() => {
    if (i18n) return i18n.t;
    return (path: string) => NF_FALLBACK[path] ?? path;
  }, [i18n]);

  return (
    <div className="shell not-found-page bg-black">
      <header className="site-header" style={{ borderBottom: '1px solid var(--line)' }}>
        <Link href="/" className="site-brand">
          {t('notFound.brand')}
        </Link>
      </header>
      <main className="enter-header" style={{ paddingTop: 48 }}>
        <p className="system-tag">{t('notFound.tag')}</p>
        <h1 className="enter-title">{t('notFound.title')}</h1>
        <Link href="/" className="ctrl" style={{ marginTop: 28, display: 'inline-block' }}>
          {t('notFound.back')}
        </Link>
      </main>
    </div>
  );
}
