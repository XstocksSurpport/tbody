import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * In `next dev`, a cached HTML shell can still reference an old `/_next/static/chunks/...` hash
 * after HMR — the browser then requests a path the `send` layer treats as bad → 400, white page.
 * Force no-store for document navigations so a normal refresh always picks up the latest build id.
 */
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.next();
  }
  const accept = request.headers.get('accept') ?? '';
  if (!accept.includes('text/html')) {
    return NextResponse.next();
  }
  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|css|js|woff2?)$).*)',
  ],
};
