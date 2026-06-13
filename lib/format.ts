import type { Locale } from '@/i18n/routing';

/**
 * Render digits in the locale's natural numeral system: Persian numerals for
 * FA, Latin numerals for EN. Applied consistently across prices, dates, counts.
 */
export function toLocaleDigits(value: string | number, locale: Locale): string {
  const str = String(value);
  if (locale !== 'fa') return str;
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persian[Number(d)]);
}

/** Format a price with its currency, in the locale's numerals. */
export function formatPrice(
  amount: number | null,
  currency: string | null,
  locale: Locale,
): string | null {
  if (amount == null) return null;
  const formatted = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return currency ? `${formatted} ${currency}` : formatted;
}

/** Format an ISO date for display in the active locale. */
export function formatDate(iso: string | null, locale: Locale): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** True when an event date is today or in the future. */
export function isUpcoming(iso: string | null): boolean {
  if (!iso) return true;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() >= today.getTime();
}
