import { stripBasePath } from '@/lib/basePath';

/** Strip query/hash and trailing slash — consistent router pathname comparison. */
export function normalizeRoutePath(path: string): string {
  if (!path) return '/';
  let x = path.startsWith('/') ? path : `/${path}`;
  const qi = x.indexOf('?');
  const hi = x.indexOf('#');
  const end = Math.min(qi === -1 ? x.length : qi, hi === -1 ? x.length : hi);
  x = x.slice(0, end);
  if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
  return x || '/';
}

/** Allow only same-origin path URLs (App Router) — blocks `//`, `javascript:`, etc. */
export function isSafeInternalHref(href: string): boolean {
  if (typeof href !== 'string') return false;
  const t = href.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return false;
  const low = t.toLowerCase();
  if (low.startsWith('/javascript:') || low.startsWith('/data:') || low.startsWith('/vbscript:')) return false;
  return true;
}

export function routesMatchLocation(pathname: string, href: string): boolean {
  return normalizeRoutePath(stripBasePath(pathname)) === normalizeRoutePath(href);
}
