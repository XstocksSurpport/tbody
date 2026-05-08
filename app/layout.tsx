import type { Metadata } from 'next';
import './globals.css';
import { AppChrome } from '@/components/AppChrome';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: '3BODY',
  description: 'Civilization observation interface.',
  icons: { icon: '/icon.svg' },
  openGraph: { locale: 'en_US', type: 'website' },
  other: { 'content-language': 'en' },
};

/** Every full page load: no restored locale — user always passes the language gate first. Strip `?lang=` noise. */
const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var K='3body-locale';sessionStorage.removeItem(K);document.documentElement.removeAttribute('data-locale');var u=new URL(location.href);if(u.searchParams.has('lang')){u.searchParams.delete('lang');var n=u.pathname+(u.search||'')+(u.hash||'');history.replaceState({},'',n)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_BOOTSTRAP_SCRIPT }} />
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
