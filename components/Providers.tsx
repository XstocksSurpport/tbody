'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { useState, type ReactNode } from 'react';
import { wagmiConfig } from '@/lib/wagmi';
import { LocaleProvider, useI18n } from '@/lib/i18n-context';

/**
 * Wallet / RPC only mounts after a locale is chosen — avoids wagmi + browser extensions
 * treating `/?lang=` navigations as unauthorized “sources” on the language gate.
 */
function WagmiAfterLocale({ children, queryClient }: { children: ReactNode; queryClient: QueryClient }) {
  const { locale } = useI18n();
  if (!locale) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <LocaleProvider>
      <WagmiAfterLocale queryClient={queryClient}>{children}</WagmiAfterLocale>
    </LocaleProvider>
  );
}
