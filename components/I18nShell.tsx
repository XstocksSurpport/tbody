'use client';

import { useEffect, type ReactNode } from 'react';
import { LanguageGate } from '@/components/LanguageGate';
import { useI18n } from '@/lib/i18n-context';

export function I18nShell({ children }: { children: ReactNode }) {
  const { locale } = useI18n();

  useEffect(() => {
    if (!locale) return;
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  if (!locale) {
    return <LanguageGate />;
  }

  return <>{children}</>;
}
