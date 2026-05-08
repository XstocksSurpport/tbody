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

const LOCALE_STORAGE_KEY = '3body-locale';

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

function readHtmlDataLocale(): Locale | null {
  if (typeof document === 'undefined') return null;
  try {
    const v = document.documentElement.getAttribute('data-locale');
    if (v === 'en' || v === 'zh') return v;
  } catch {
    /* */
  }
  return null;
}

function setHtmlDataLocale(loc: Locale | null) {
  if (typeof document === 'undefined') return;
  try {
    if (loc) document.documentElement.setAttribute('data-locale', loc);
    else document.documentElement.removeAttribute('data-locale');
  } catch {
    /* */
  }
}

function readSessionLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = sessionStorage.getItem(LOCALE_STORAGE_KEY);
    if (s === 'en' || s === 'zh') return s;
  } catch {
    /* */
  }
  return null;
}

/** In-memory override for same document before storage sync completes. */
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
  if (activeLocaleOverride) return activeLocaleOverride;
  const fromHtml = readHtmlDataLocale();
  if (fromHtml) return fromHtml;
  return readSessionLocale();
}

function getServerLocaleSnapshot(): null {
  return null;
}

/** Remove obsolete localStorage/cookie keys only — session locale is managed by layout bootstrap + setLocale. */
function clearLegacyLocalePersistence() {
  try {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    document.cookie = `${LOCALE_STORAGE_KEY}=;path=/;max-age=0;SameSite=Lax`;
  } catch {
    /* */
  }
}

function persistLocale(loc: Locale) {
  try {
    sessionStorage.setItem(LOCALE_STORAGE_KEY, loc);
    setHtmlDataLocale(loc);
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
    persistLocale(l);
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
