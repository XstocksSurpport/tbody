import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--ibm-mono)', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
        grotesk: ['var(--font-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        corridor: {
          u01: '#2fd87a',
          u02: '#d4a574',
          u03: '#9eb9e8',
          u04: '#6eb896',
        },
      },
      boxShadow: {
        'panel-inner': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
} satisfies Config;
