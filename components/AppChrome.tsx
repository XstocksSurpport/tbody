'use client';

import type { ReactNode } from 'react';
import { I18nShell } from '@/components/I18nShell';
import { SiteAmbient } from '@/components/SiteAmbient';

/**
 * Single client boundary for the whole app chrome below `Providers`.
 * Keeps `crash-root` / `I18nShell` / `SiteAmbient` in one manifest — do not insert
 * Server Components between `Providers` and `I18nShell` (Next 15 client-manifest failures).
 */
export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="crash-root">
      <main className="crash-main">
        <I18nShell>
          {children}
          <SiteAmbient />
        </I18nShell>
      </main>
    </div>
  );
}
