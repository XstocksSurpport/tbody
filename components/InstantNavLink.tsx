'use client';

import { stripBasePath, withBasePath } from '@/lib/basePath';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  type AnchorHTMLAttributes,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';

const warmedHrefs = new Set<string>();

function normalizeRoutePath(p: string) {
  if (!p) return '/';
  let x = p.startsWith('/') ? p : `/${p}`;
  if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
  return x;
}

function isPlainPrimaryClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (e.button !== 0) return false;
  if (e.currentTarget.getAttribute('target') === '_blank') return false;
  return true;
}

function warmHref(router: ReturnType<typeof useRouter>, href: string) {
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

  useEffect(() => {
    warmHref(router, href);
  }, [href, router]);

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
    if (!isPlainPrimaryClick(e)) return;

    e.preventDefault();
    e.stopPropagation();
    warmHref(router, href);
    router.push(href);

    window.setTimeout(() => {
      const cur = normalizeRoutePath(stripBasePath(window.location.pathname));
      const want = normalizeRoutePath(href);
      if (cur !== want) {
        window.location.assign(withBasePath(href));
      }
    }, 4500);
  };

  return (
    <a
      href={withBasePath(href)}
      onClick={handleClick}
      onFocus={handleFocus}
      onPointerDown={handlePointerDown}
      {...rest}
    />
  );
}
