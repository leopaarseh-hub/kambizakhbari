import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { EventList } from '@/components/sections/EventList';
import { getActiveEvents, isSupabaseConfigured } from '@/lib/queries';
import { demoEvents } from '@/lib/demo';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

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
  const events = await getActiveEvents();
  // Show example events until the backend is connected.
  const list = isSupabaseConfigured() ? events : demoEvents;

  return (
    <div className="pb-8">
      <PageHeader title={t('title')} intro={t('intro')} />
      <section className="shell mt-14">
        <EventList events={list} locale={locale as Locale} />
      </section>
    </div>
  );
}
