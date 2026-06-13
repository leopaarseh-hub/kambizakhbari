import type { Config } from 'tailwindcss';

/**
 * Design tokens for the "Architectural LEGO" system.
 * Colors and the brick grid map to CSS variables declared in app/globals.css
 * so the brick scale stays consistent across the whole site.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        bone: 'rgb(var(--color-bone) / <alpha-value>)',
        brick: 'rgb(var(--color-brick) / <alpha-value>)',
        graphite: 'rgb(var(--color-graphite) / <alpha-value>)',
        seam: 'rgb(var(--color-seam) / <alpha-value>)',
        plate: 'rgb(var(--color-plate) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-fa)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'var(--font-fa)', 'system-ui', 'sans-serif'],
        fa: ['var(--font-fa)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Brick unit scale. One stud equals the base brick unit.
        brick: 'var(--brick-unit)',
        'brick-2': 'calc(var(--brick-unit) * 2)',
        'brick-3': 'calc(var(--brick-unit) * 3)',
        'brick-4': 'calc(var(--brick-unit) * 4)',
        'brick-6': 'calc(var(--brick-unit) * 6)',
      },
      borderRadius: {
        plate: 'var(--plate-radius)',
        stud: '9999px',
      },
      boxShadow: {
        // Paper-thin elevation so plates feel snapped together, never glossy.
        snap: '0 1px 0 0 rgb(var(--color-ink) / 0.04), 0 2px 6px -2px rgb(var(--color-ink) / 0.12)',
        'snap-lg': '0 1px 0 0 rgb(var(--color-ink) / 0.05), 0 12px 28px -10px rgb(var(--color-ink) / 0.22)',
        seam: 'inset 0 0 0 1px rgb(var(--color-seam) / 0.7)',
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};

export default config;
