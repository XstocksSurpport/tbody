'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { stripBasePath, withBasePath } from '@/lib/basePath';

const LOCALE_KEY = '3body-locale';

/** Same tab session only — matches i18n (sessionStorage + live `data-locale`). */
function readPersistedLocaleForNav(): 'en' | 'zh' | null {
  if (typeof document === 'undefined') return null;
  try {
    const h = document.documentElement.getAttribute('data-locale');
    if (h === 'en' || h === 'zh') return h;
    const ss = sessionStorage.getItem(LOCALE_KEY);
    if (ss === 'en' || ss === 'zh') return ss;
  } catch {
    /* */
  }
  return null;
}

/** Append `?lang=` when returning to `/` so the next document resolves locale before React. */
function withHomeLangHint(href: string): string {
  if (typeof window === 'undefined') return withBasePath(href.startsWith('/') ? href : `/${href}`);
  try {
    const absolute = withBasePath(href.startsWith('/') ? href : `/${href}`);
    const u = new URL(absolute, window.location.origin);
    const pathSansBase = stripBasePath(u.pathname);
    if (pathSansBase !== '/' || u.searchParams.has('lang')) {
      return `${u.pathname}${u.search}${u.hash}`;
    }
    const loc = readPersistedLocaleForNav();
    if (!loc) return `${u.pathname}${u.search}${u.hash}`;
    u.searchParams.set('lang', loc);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return withBasePath(href.startsWith('/') ? href : `/${href}`);
  }
}

function navigateHard(href: string) {
  const next = withHomeLangHint(href);
  window.location.assign(next);
  window.setTimeout(() => {
    const current = window.location.pathname + window.location.search + window.location.hash;
    if (current !== next) {
      window.location.href = next;
    }
  }, 80);
}

/**
 * Full document navigation — avoids App Router soft-nav delays / stuck taps on mobile.
 * Modified clicks (new tab, etc.) keep normal `<a>` behavior.
 */
export function HardNavLink({
  href,
  onClick,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    if (e.currentTarget.getAttribute('target') === '_blank') return;
    e.preventDefault();
    e.stopPropagation();
    navigateHard(href);
  };

  return <a href={withBasePath(href.startsWith('/') ? href : `/${href}`)} onClick={handleClick} {...rest} />;
}
