import type { SettingsRow } from './types';

export interface PaymentDetails {
  iban: string;
  accountHolder: string;
  currency: string;
}

/**
 * Resolve payment instructions from the database settings row, falling back to
 * environment variables when a field is empty. The admin panel is the source of
 * truth once configured, so IBAN is never hardcoded across the app.
 */
export function resolvePaymentDetails(
  settings: SettingsRow | null,
): PaymentDetails {
  return {
    iban: settings?.iban || process.env.NEXT_PUBLIC_PAYMENT_IBAN || '',
    accountHolder:
      settings?.account_holder ||
      process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_HOLDER ||
      'Kambiz Akhbari',
    currency:
      settings?.default_currency ||
      process.env.NEXT_PUBLIC_PAYMENT_CURRENCY ||
      'TRY',
  };
}
