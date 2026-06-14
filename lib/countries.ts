import type { Locale } from '@/i18n/routing';

export interface Country {
  code: string;
  en: string;
  fa: string;
}

/**
 * Country options for registration. Turkey uses the local IBAN bank transfer;
 * every other country routes to the "Kambiz will contact you" flow, since
 * people outside Turkey (for example in Iran) cannot use the IBAN system.
 */
export const countries: Country[] = [
  { code: 'TR', en: 'Turkey', fa: 'ترکیه' },
  { code: 'IR', en: 'Iran', fa: 'ایران' },
  { code: 'AE', en: 'United Arab Emirates', fa: 'امارات متحده عربی' },
  { code: 'DE', en: 'Germany', fa: 'آلمان' },
  { code: 'GB', en: 'United Kingdom', fa: 'بریتانیا' },
  { code: 'US', en: 'United States', fa: 'ایالات متحده آمریکا' },
  { code: 'CA', en: 'Canada', fa: 'کانادا' },
  { code: 'NL', en: 'Netherlands', fa: 'هلند' },
  { code: 'SE', en: 'Sweden', fa: 'سوئد' },
  { code: 'OTHER', en: 'Another country', fa: 'کشوری دیگر' },
];

/** Only Turkey uses the IBAN bank transfer. */
export function countryUsesIban(code: string | null | undefined): boolean {
  return code === 'TR';
}

export function countryLabel(code: string | null | undefined, locale: Locale): string {
  if (!code) return '';
  const c = countries.find((x) => x.code === code);
  return c ? c[locale] : code;
}
