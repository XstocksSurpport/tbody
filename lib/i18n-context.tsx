'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { Locale } from '@/lib/dictionaries';
import { dictionaries } from '@/lib/dictionaries';

function deepGet(obj: unknown, path: string): string {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined) return path;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : path;
}

type I18nCtx = {
  locale: Locale | null;
  setLocale: (l: Locale) => void;
  t: (path: string) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

function setHtmlDataLocale(loc: Locale | null) {
  if (typeof document === 'undefined') return;
  try {
    if (loc) document.documentElement.setAttribute('data-locale', loc);
    else document.documentElement.removeAttribute('data-locale');
  } catch {
    /* */
  }
}

/** Same-tab SPA only — never persisted across full document loads (see layout bootstrap script). */
let localeListeners = new Set<() => void>();
let activeLocaleOverride: Locale | null = null;

function subscribeLocale(onStoreChange: () => void) {
  localeListeners.add(onStoreChange);
  return () => {
    localeListeners.delete(onStoreChange);
  };
}

function notifyLocaleListeners() {
  localeListeners.forEach((fn) => fn());
}

function getClientLocaleSnapshot(): Locale | null {
  if (typeof window === 'undefined') return null;
  return activeLocaleOverride;
}

function getServerLocaleSnapshot(): null {
  return null;
}

/** Drop legacy persistence from older builds. */
function clearLegacyLocalePersistence() {
  try {
    localStorage.removeItem('3body-locale');
    sessionStorage.removeItem('3body-locale');
    document.cookie = `3body-locale=;path=/;max-age=0;SameSite=Lax`;
  } catch {
    /* */
  }
}

function stripLangQueryFromBar() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('lang')) return;
    url.searchParams.delete('lang');
    const next = url.pathname + (url.search ? url.search : '') + (url.hash || '');
    window.history.replaceState({}, '', next || url.pathname);
  } catch {
    /* */
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, getClientLocaleSnapshot, getServerLocaleSnapshot);

  const setLocale = useCallback((l: Locale) => {
    activeLocaleOverride = l;
    try {
      sessionStorage.removeItem('3body-locale');
    } catch {
      /* */
    }
    setHtmlDataLocale(l);
    stripLangQueryFromBar();
    notifyLocaleListeners();
  }, []);

  useLayoutEffect(() => {
    clearLegacyLocalePersistence();
  }, []);

  useEffect(() => {
    const onPop = () => notifyLocaleListeners();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const t = useMemo(() => {
    return (path: string) => {
      const loc = locale ?? 'en';
      const raw = deepGet(dictionaries[loc], path);
      if (raw !== path) return raw;
      return deepGet(dictionaries.en, path);
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const x = useContext(Ctx);
  if (!x) throw new Error('useI18n must be used inside LocaleProvider');
  return x;
}

export function useOptionalI18n(): I18nCtx | null {
  return useContext(Ctx);
}
