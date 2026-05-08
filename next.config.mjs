import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const staticExport = process.env.STATIC_EXPORT === '1';
/** GitHub Pages project URL prefix, e.g. `/tbody` for `user.github.io/tbody/` */
const pagesBase = (process.env.PAGES_BASE_PATH || '').trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Dev-only: hides the bottom-left Next “N” indicator that spins during compile / route work */
  devIndicators: false,
  ...(process.env.NODE_ENV === 'production'
    ? {
        productionBrowserSourceMaps: false,
        compiler: {
          removeConsole: { exclude: ['error', 'warn'] },
        },
      }
    : {}),
  ...(pagesBase ? { basePath: pagesBase } : {}),
  ...(staticExport
    ? {
        output: 'export',
        images: { unoptimized: true },
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBase,
  },
  ...(!staticExport
    ? {
        async redirects() {
          return [
            { source: '/nova', destination: '/', permanent: true },
            { source: '/universe/u01', destination: '/u01', permanent: true },
            { source: '/universe/u02', destination: '/u02', permanent: true },
            { source: '/universe/u03', destination: '/u03', permanent: true },
            { source: '/universe/u04', destination: '/u04', permanent: true },
          ];
        },
        async rewrites() {
          return [{ source: '/favicon.ico', destination: '/icon.svg' }];
        },
        /** Hashed assets — long cache for CDN/edge in production only (dev HMR must not get stuck). */
        async headers() {
          if (process.env.NODE_ENV !== 'production') return [];
          return [
            {
              source: '/_next/static/:path*',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
          ];
        },
      }
    : {}),
  /**
   * Dev server only (ignored in production). Without this, loading the app via `http://127.0.0.1:3000`
   * while assets expect `localhost` (or vice versa) can block or break `/_next/*` fetches — chunk/CSS
   * fail → white page, hydration dies, wallet shows “not authorized”.
   * Always use ONE origin in the address bar; this config allows both hostnames.
   */
  ...(process.env.NODE_ENV !== 'production'
    ? {
        /** Include LAN / IPv6 hosts — wrong origin blocks `/_next/*` in dev → blank page + spinner. */
        allowedDevOrigins: ['127.0.0.1', 'localhost', '[::1]'],
      }
    : {}),
  webpack: (config, ctx) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    // Windows: native FS watchers often race with Defender/indexers → incomplete `.next` chunks,
    // missing `vendor-chunks/*.js`, HMR 404 spirals. Polling trades CPU for consistent rebuilds.
    if (ctx.dev && process.platform === 'win32') {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 400,
      };
    }

    /**
     * Extra string-array obfuscation for prod client bundles only (slows casual copying; does not
     * secure secrets — browser JS remains downloadable). Set `NEXT_DISABLE_OBFUSCATION=1` to skip.
     */
    if (
      process.env.NODE_ENV === 'production' &&
      !ctx.dev &&
      !ctx.isServer &&
      process.env.NEXT_DISABLE_OBFUSCATION !== '1'
    ) {
      try {
        const WebpackObfuscatorPlugin = require('webpack-obfuscator');
        config.plugins.push(
          new WebpackObfuscatorPlugin(
            {
              compact: true,
              controlFlowFlattening: false,
              deadCodeInjection: false,
              debugProtection: false,
              disableConsoleOutput: false,
              identifierNamesGenerator: 'hexadecimal',
              log: false,
              renameGlobals: false,
              selfDefending: false,
              simplify: true,
              splitStrings: false,
              stringArray: true,
              stringArrayEncoding: ['base64'],
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayThreshold: 0.62,
              unicodeEscapeSequence: false,
            },
            [
              '**/framework*.js',
              '**/main-app*.js',
              '**/webpack*.js',
              '**/polyfills*.js',
              '**/react-refresh*.js',
              '**/amp*.js',
            ]
          )
        );
      } catch (e) {
        console.warn('[next] client obfuscation skipped:', e);
      }
    }

    return config;
  },
};

export default nextConfig;
