import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { ClassList } from '@/components/sections/ClassList';
import {
  getActiveClasses,
  getSettings,
  isSupabaseConfigured,
  attachSeats,
} from '@/lib/queries';
import { resolvePaymentDetails } from '@/lib/payment';
import { demoClasses } from '@/lib/demo';

export const revalidate = 300; // ISR: cached, refreshed every 5 minutes

const CONTACT_EMAIL = 'Info@kambizakhbari.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Classes' });
  return { title: t('title'), description: t('intro') };
}

export default async function ClassesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Classes');

  const [classes, settings] = await Promise.all([
    getActiveClasses(),
    getSettings(),
  ]);
  // Show example classes until the backend is connected.
  const list = isSupabaseConfigured() ? classes : attachSeats(demoClasses);
  const payment = resolvePaymentDetails(settings);

  return (
    <div className="pb-8">
      <PageHeader title={t('title')} intro={t('intro')} />
      <section className="shell mt-14">
        <ClassList classes={list} payment={payment} contactEmail={CONTACT_EMAIL} />
      </section>
    </div>
  );
}
