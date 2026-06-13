import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { ClassList } from '@/components/sections/ClassList';
import { getActiveClasses, getSettings } from '@/lib/queries';
import { resolvePaymentDetails } from '@/lib/payment';

// Classes are dynamic from Supabase, so render on each request.
export const dynamic = 'force-dynamic';

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
  const payment = resolvePaymentDetails(settings);

  return (
    <div className="pb-8">
      <PageHeader title={t('title')} intro={t('intro')} />
      <section className="shell mt-14">
        <ClassList classes={classes} payment={payment} contactEmail={CONTACT_EMAIL} />
      </section>
    </div>
  );
}
