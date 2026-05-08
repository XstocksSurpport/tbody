'use client';

import Link from 'next/link';
import './globals.css';

/**
 * Root-level fault surface — renders when the root layout fails (default Next page is a bare “500”).
 * Must define html/body; keep visually aligned with the 3BODY shell.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        <div className="crash-root">
          <main className="crash-main">
            <div className="mx-auto max-w-xl px-7 py-16 md:px-8">
              <p className="system-tag">[ fault ]</p>
              <h1 className="enter-title">System fault</h1>
              <p className="subtle" style={{ marginTop: 14, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {error.message || 'Unknown error'}
              </p>
              {error.digest ? (
                <p className="subtle" style={{ marginTop: 10, opacity: 0.65 }}>
                  digest {error.digest}
                </p>
              ) : null}
              <div className="mt-10 flex flex-wrap gap-4">
                <button type="button" className="ctrl ctrl-primary" onClick={() => reset()}>
                  retry
                </button>
                <Link href="/" className="ctrl" prefetch>
                  ← home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
