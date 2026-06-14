import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { EventList } from '@/components/sections/EventList';
import {
  getActiveEvents,
  getSettings,
  isSupabaseConfigured,
  attachSeats,
} from '@/lib/queries';
import { resolvePaymentDetails } from '@/lib/payment';
import { demoEvents } from '@/lib/demo';

export const revalidate = 300; // ISR: cached, refreshed every 5 minutes

const CONTACT_EMAIL = 'Info@kambizakhbari.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Events' });
  return { title: t('title'), description: t('intro') };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Events');

  const [events, settings] = await Promise.all([getActiveEvents(), getSettings()]);
  const list = isSupabaseConfigured() ? events : attachSeats(demoEvents);
  const payment = resolvePaymentDetails(settings);

  return (
    <div className="pb-8">
      <PageHeader title={t('title')} intro={t('intro')} />
      <section className="shell mt-14">
        <EventList events={list} payment={payment} contactEmail={CONTACT_EMAIL} />
      </section>
    </div>
  );
}
