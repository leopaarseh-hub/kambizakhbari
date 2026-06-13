import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { WorkWall } from '@/components/sections/WorkWall';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Work' });
  return { title: t('title'), description: t('intro') };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Work');

  return (
    <div className="pb-8">
      <PageHeader title={t('title')} intro={t('intro')} />
      <section className="shell mt-14">
        <WorkWall />
      </section>
    </div>
  );
}
