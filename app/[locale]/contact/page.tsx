import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { ContactForm } from '@/components/sections/ContactForm';
import { InstagramIcon, MailIcon } from '@/components/ui/Icons';

const INSTAGRAM_URL = 'https://instagram.com/kambiz';
const INSTAGRAM_HANDLE = '@kambiz';
const EMAIL = 'Info@kambizakhbari.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return { title: t('title'), description: t('intro') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');

  return (
    <div className="pb-8">
      <PageHeader title={t('title')} intro={t('intro')} />

      <div className="shell mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <ContactForm />

        <aside className="rounded-plate bg-ink p-8 text-bone shadow-snap">
          <h2 className="text-sm font-semibold text-bone/50">{t('directTitle')}</h2>
          <ul className="mt-5 space-y-4">
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-4 transition-colors"
              >
                <span className="grid h-12 w-12 place-items-center rounded-[12px] border border-bone/20 transition-colors group-hover:border-brick group-hover:bg-brick group-hover:text-bone">
                  <InstagramIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm text-bone/55">{t('instagram')}</span>
                  <span className="font-display font-medium tracking-tightest" dir="ltr">
                    {INSTAGRAM_HANDLE}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="group flex items-center gap-4 transition-colors"
              >
                <span className="grid h-12 w-12 place-items-center rounded-[12px] border border-bone/20 transition-colors group-hover:border-brick group-hover:bg-brick group-hover:text-bone">
                  <MailIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm text-bone/55">{t('emailLabel')}</span>
                  <span className="font-display font-medium tracking-tightest" dir="ltr">
                    {EMAIL}
                  </span>
                </span>
              </a>
            </li>
          </ul>

          <div className="mt-8 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brick" />
            <span className="h-2 w-2 rounded-full bg-bone/30" />
            <span className="h-2 w-2 rounded-full bg-bone/30" />
          </div>
        </aside>
      </div>
    </div>
  );
}
