import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Locale-prefixed routing. Both /en and /fa are always present in the URL so
 * each language has a stable, indexable address for SEO and hreflang.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  fa: 'rtl',
};
