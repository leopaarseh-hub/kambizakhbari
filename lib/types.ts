import type { Locale } from '@/i18n/routing';

export type ClassType = 'online' | 'in_person';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type WorkCategory = 'fashion' | 'film' | 'direction';

export interface ClassRow {
  id: string;
  title_en: string;
  title_fa: string;
  description_en: string;
  description_fa: string;
  type: ClassType;
  price: number | null;
  currency: string | null;
  capacity: number | null;
  image_url: string | null;
  active: boolean;
  sold_out: boolean;
  created_at: string;
}

export interface EventRow {
  id: string;
  title_en: string;
  title_fa: string;
  description_en: string;
  description_fa: string;
  event_date: string | null;
  location_en: string | null;
  location_fa: string | null;
  price: number | null;
  currency: string | null;
  capacity: number | null;
  image_url: string | null;
  active: boolean;
  sold_out: boolean;
  created_at: string;
}

/** A class/event enriched with confirmed-seat info and an effective sold-out
 *  flag (manual toggle OR capacity reached by confirmed registrations). */
export type WithSeats<T> = T & { confirmed: number; soldOut: boolean };

export interface RegistrationRow {
  id: string;
  class_id: string | null;
  event_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  instagram: string | null;
  country: string | null;
  preferred_type: ClassType;
  message: string | null;
  status: RegistrationStatus;
  created_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface SettingsRow {
  id: number;
  iban: string | null;
  account_holder: string | null;
  default_currency: string | null;
  hero_image_url: string | null;
  about_image_url: string | null;
}

/** Pick the field for the active locale from a bilingual record. */
export function localized<T>(row: T, base: string, locale: Locale): string {
  const key = `${base}_${locale}` as keyof T;
  return (row[key] as unknown as string) ?? '';
}
