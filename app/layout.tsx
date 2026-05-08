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

/**
 * Before React: skip entirely on reload (user must pass language gate again).
 * Otherwise `?lang=` (exit-to-home) or sessionStorage for same-session navigation only.
 */
const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var K='3body-locale';var nav=performance.getEntriesByType('navigation')[0];var isReload=nav&&nav.type==='reload';if(!isReload&&performance.navigation&&performance.navigation.type===1)isReload=true;if(isReload){try{sessionStorage.removeItem(K)}catch(e){}try{document.documentElement.removeAttribute('data-locale')}catch(e){}return;}var q=new URLSearchParams(location.search).get('lang');if(q==='en'||q==='zh'){document.documentElement.setAttribute('data-locale',q);return;}var L=sessionStorage.getItem(K);if(L==='en'||L==='zh')document.documentElement.setAttribute('data-locale',L)}catch(e){}})();`;

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
