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
 * Reload → clear locale (language gate again). Normal navigations / HardNavLink full loads → restore
 * locale from sessionStorage so home ↔ corridor flows do not skip back to the gate.
 */
const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var K='3body-locale';var nav=performance.getEntriesByType('navigation')[0];var isReload=nav&&nav.type==='reload';if(!isReload&&performance.navigation&&performance.navigation.type===1)isReload=true;if(isReload){sessionStorage.removeItem(K);document.documentElement.removeAttribute('data-locale')}else{var L=sessionStorage.getItem(K);if(L==='en'||L==='zh')document.documentElement.setAttribute('data-locale',L);else document.documentElement.removeAttribute('data-locale')}var u=new URL(location.href);if(u.searchParams.has('lang')){u.searchParams.delete('lang');history.replaceState({},'',u.pathname+(u.search||'')+(u.hash||''))}}catch(e){}})();`;

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
