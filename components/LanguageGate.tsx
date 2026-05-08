'use client';

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import './language-gate.css';
import { useI18n } from '@/lib/i18n-context';
import type { Locale } from '@/lib/dictionaries';

/**
 * Language gate — portaled to document.body (above stacking contexts).
 * Use real `<button type="button">` only — no `href="/?lang="` (avoids wallet extensions /
 * SDKs treating each query URL as a new “source” and blocking interaction).
 */
export function LanguageGate() {
  const { setLocale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  /** After hydration only — delayed portal avoids SSR/client DOM tree mismatch. */
  const [portalReady, setPortalReady] = useState(false);

  useLayoutEffect(() => {
    setPortalReady(true);
  }, []);

  const commit = (loc: Locale) => {
    setLocale(loc);
    if (pathname && pathname !== '/') {
      router.replace('/');
    }
  };

  const ui = (
    <div
      className="lang-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-gate-title"
      suppressHydrationWarning
    >
      <div className="lang-gate-inner">
        <p id="lang-gate-title" className="lang-gate-title">
          {t('gate.title')}
        </p>
        <p className="lang-gate-sub">{t('gate.subtitle')}</p>

        <div className="lang-gate-actions">
          <button
            type="button"
            className="lang-gate-btn lang-gate-btn-en"
            onClick={() => commit('en')}
          >
            <span className="lang-gate-btn-main">{t('gate.chooseEn')}</span>
          </button>
          <button
            type="button"
            className="lang-gate-btn lang-gate-btn-zh"
            onClick={() => commit('zh')}
          >
            <span className="lang-gate-btn-main">{t('gate.chooseZh')}</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (!portalReady) {
    return ui;
  }

  return createPortal(ui, document.body);
}
