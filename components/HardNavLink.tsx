'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';

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
  if (typeof window === 'undefined') return href;
  try {
    const u = new URL(href, window.location.origin);
    if (u.pathname !== '/' || u.searchParams.has('lang')) return href;
    const loc = readPersistedLocaleForNav();
    if (!loc) return href;
    u.searchParams.set('lang', loc);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return href;
  }
}

function navigateHard(href: string) {
  const next = withHomeLangHint(href);
  window.location.assign(next);
  window.setTimeout(() => {
    if (window.location.pathname + window.location.search + window.location.hash !== next) {
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

  return <a href={href} onClick={handleClick} {...rest} />;
}
