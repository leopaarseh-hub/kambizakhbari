import { Space_Grotesk, Inter, Vazirmatn } from 'next/font/google';

/**
 * Latin display face. A geometric grotesque with confident, structural energy
 * that echoes the modular brick system without imitating any logo.
 */
export const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Latin body face. Highly readable neutral sans for long-form reading.
 */
export const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * Persian face. Vazirmatn covers Persian letterforms, numerals, and
 * punctuation cleanly. next/font self-hosts the files at build time, so no
 * runtime request to Google is made and no tofu/broken glyphs can appear.
 * The arabic subset carries the full Persian unicode range.
 */
export const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fa',
  display: 'swap',
});

export const fontVariables = `${display.variable} ${sans.variable} ${vazirmatn.variable}`;
