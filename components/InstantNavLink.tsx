'use client';

import { isSafeInternalHref, routesMatchLocation } from '@/lib/app-nav';
import { withBasePath } from '@/lib/basePath';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';

const warmedHrefs = new Set<string>();

function isPlainPrimaryClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (e.button !== 0) return false;
  if (e.currentTarget.getAttribute('target') === '_blank') return false;
  return true;
}

function warmHref(router: ReturnType<typeof useRouter>, href: string) {
  if (!isSafeInternalHref(href)) return;
  try {
    router.prefetch(href);
  } catch {
    /* */
  }

  if (typeof window === 'undefined' || warmedHrefs.has(href)) return;
  warmedHrefs.add(href);
  window.setTimeout(() => {
    void fetch(withBasePath(href), { cache: 'no-store', credentials: 'same-origin' }).catch(() => {
      warmedHrefs.delete(href);
    });
  }, 0);
}

export function InstantNavLink({
  href,
  onClick,
  onFocus,
  onPointerDown,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const router = useRouter();
  const navBusy = useRef(false);
  const fallbackTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isSafeInternalHref(href)) return;
    warmHref(router, href);
  }, [href, router]);

  useEffect(() => {
    return () => {
      if (fallbackTimer.current !== undefined) window.clearTimeout(fallbackTimer.current);
    };
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLAnchorElement>) => {
    onPointerDown?.(e);
    if (e.defaultPrevented) return;
    warmHref(router, href);
  };

  const handleFocus = (e: FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(e);
    if (e.defaultPrevented) return;
    warmHref(router, href);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!isSafeInternalHref(href)) {
      e.preventDefault();
      return;
    }
    if (!isPlainPrimaryClick(e)) return;
    if (navBusy.current) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    navBusy.current = true;
    warmHref(router, href);

    router.push(href);
    window.setTimeout(() => {
      navBusy.current = false;
    }, 320);

    if (fallbackTimer.current !== undefined) window.clearTimeout(fallbackTimer.current);
    fallbackTimer.current = window.setTimeout(() => {
      fallbackTimer.current = undefined;
      if (typeof window === 'undefined') return;
      if (!routesMatchLocation(window.location.pathname, href)) {
        window.location.assign(withBasePath(href));
      }
    }, 4500);
  };

  const safe = isSafeInternalHref(href);

  return (
    <a
      href={safe ? withBasePath(href) : '#'}
      aria-disabled={!safe}
      onClick={handleClick}
      onFocus={handleFocus}
      onPointerDown={handlePointerDown}
      {...rest}
    />
  );
}
