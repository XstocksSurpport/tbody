/**
 * GitHub Pages project sites use `https://<org>.github.io/<repo>/` — Next `basePath`
 * matches `<repo>`. Empty when deploying to domain root (e.g. Vercel).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBasePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (!BASE_PATH) return path;
  if (path === '/') return BASE_PATH;
  return `${BASE_PATH}${path}`;
}

/** `window.location.pathname` includes the Pages prefix; normalize to Next router style (`/u01`). */
export function stripBasePath(pathname: string): string {
  if (!BASE_PATH) return pathname;
  if (pathname === BASE_PATH) return '/';
  if (pathname.startsWith(`${BASE_PATH}/`)) return pathname.slice(BASE_PATH.length);
  return pathname;
}
