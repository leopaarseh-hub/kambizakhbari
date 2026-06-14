import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { Reveal, Brick } from '@/components/motion/Reveal';
import { PlateImage } from '@/components/ui/PlateImage';
import { Stud } from '@/components/ui/Stud';
import { ButtonLink } from '@/components/ui/Button';
import { getSettings } from '@/lib/queries';

// Biography portrait resolution order: photo uploaded in the admin panel >
// NEXT_PUBLIC_ABOUT_PORTRAIT env URL > the file committed under public/images.
function aboutPortrait(url: string | null | undefined): string {
  return url || process.env.NEXT_PUBLIC_ABOUT_PORTRAIT || '/images/kambiz-biography.webp';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return { title: t('title'), description: t('lead') };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const tNav = await getTranslations('Nav');

  const body = t.raw('body') as string[];
  const facts = t.raw('facts') as Array<{ label: string; value: string }>;
  const settings = await getSettings();
  const ABOUT_PORTRAIT = aboutPortrait(settings?.about_image_url);

  return (
    <article className="pb-8">
      <PageHeader title={t('title')} intro={t('lead')} />

      <div className="shell mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Long-form editorial body on a frosted reading panel so the moving
            background never interferes with the copy. */}
        <Reveal className="order-2 lg:order-1">
          <div className="reading-panel p-6 sm:p-8">
            <div className="prose-body space-y-6 text-lg text-bone/90">
              {body.map((para, i) => (
                <Brick key={i} as="div">
                  <p className="measure">{para}</p>
                </Brick>
              ))}
            </div>

            <div className="mt-10">
              <ButtonLink href="/contact" variant="outline" withArrow>
                {tNav('contact')}
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        {/* Portrait plate and facts. */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-plate bg-ink shadow-snap-lg">
            <PlateImage
              src={ABOUT_PORTRAIT}
              alt={t('title')}
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <span className="pointer-events-none absolute top-3 end-3 flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-bone/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-bone/40" />
            </span>
          </div>

          <div className="mt-6 rounded-plate bg-plate p-6 shadow-snap">
            <h2 className="text-sm font-semibold text-bone/50">
              {t('factsTitle')}
            </h2>
            <dl className="mt-4 space-y-3.5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-start gap-3">
                  <Stud className="mt-2 shrink-0" />
                  <div>
                    <dt className="text-sm text-bone/55">{fact.label}</dt>
                    <dd className="font-display font-medium tracking-tightest text-bone">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
