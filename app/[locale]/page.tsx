import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, Brick } from '@/components/motion/Reveal';
import { PlateImage } from '@/components/ui/PlateImage';
import { StudSeam } from '@/components/ui/Stud';
import { teaserWork } from '@/lib/work';
import type { Locale } from '@/i18n/routing';
import { clsx } from '@/lib/clsx';

// The hero portrait. Either drop a file at public/images/hero-portrait.jpg, or
// set NEXT_PUBLIC_HERO_PORTRAIT to a hosted image URL (e.g. a Supabase Storage
// public URL). The env var wins so the photo can be set without a commit.
const HERO_PORTRAIT =
  process.env.NEXT_PUBLIC_HERO_PORTRAIT || '/images/hero-portrait.jpg';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const activeLocale = (await getLocale()) as Locale;

  return (
    <>
      <Hero portraitSrc={HERO_PORTRAIT} />

      {/* Biography summary only. The full bio lives on /about. */}
      <section className="shell py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading title={t('bioCta')} seam />
          <div className="reading-panel p-6 sm:p-8">
            <p className="prose-body measure text-xl text-bone/90">
              {t('bioSummary')}
            </p>
            <div className="mt-7">
              <ButtonLink href="/about" variant="outline" withArrow>
                {t('bioCta')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <div className="shell">
        <div className="seam" />
      </div>

      {/* Curated portfolio teaser. */}
      <section className="shell py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={t('workTitle')} intro={t('workIntro')} />
          <ButtonLink href="/work" variant="ghost" withArrow>
            {t('workCta')}
          </ButtonLink>
        </div>

        <Reveal
          as="ul"
          className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
        >
          {teaserWork.map((item, i) => (
            <Brick
              as="li"
              key={item.id}
              className={clsx(i % 2 === 1 ? 'mt-0 sm:mt-8' : '')}
            >
              <div
                className={clsx(
                  'relative overflow-hidden rounded-plate bg-ink shadow-snap',
                  item.aspect,
                )}
              >
                <PlateImage
                  src={item.src}
                  alt={item.alt[activeLocale]}
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <span className="pointer-events-none absolute inset-0 rounded-plate ring-1 ring-inset ring-ink/10" />
              </div>
            </Brick>
          ))}
        </Reveal>
      </section>

      {/* Classes and Events teasers as paired plates. */}
      <section className="shell py-20 sm:py-24">
        <StudSeam className="mb-12" />
        <div className="grid gap-6 lg:grid-cols-2">
          <TeaserPlate
            title={t('classesTitle')}
            intro={t('classesIntro')}
            cta={t('classesCta')}
            href="/classes"
            tone="ink"
          />
          <TeaserPlate
            title={t('eventsTitle')}
            intro={t('eventsIntro')}
            cta={t('eventsCta')}
            href="/events"
            tone="plate"
          />
        </div>
      </section>
    </>
  );
}

function TeaserPlate({
  title,
  intro,
  cta,
  href,
  tone,
}: {
  title: string;
  intro: string;
  cta: string;
  href: string;
  tone: 'ink' | 'plate';
}) {
  const ink = tone === 'ink';
  return (
    <div
      className={clsx(
        'flex flex-col justify-between gap-8 rounded-plate bg-plate p-8 text-bone shadow-snap sm:p-10',
        ink && 'ring-1 ring-brick/40',
      )}
    >
      <div>
        <div className="mb-5 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-brick" />
          <span className={clsx('h-2 w-2 rounded-full', ink ? 'bg-bone/30' : 'bg-graphite/30')} />
          <span className={clsx('h-2 w-2 rounded-full', ink ? 'bg-bone/30' : 'bg-graphite/30')} />
        </div>
        <h3 className="text-2xl font-semibold tracking-tightest sm:text-3xl">
          {title}
        </h3>
        <p
          className={clsx(
            'prose-body measure mt-4',
            ink ? 'text-bone/75' : 'text-bone/70',
          )}
        >
          {intro}
        </p>
      </div>
      <ButtonLink
        href={href}
        variant={ink ? 'primary' : 'outline'}
        withArrow
        className="self-start"
      >
        {cta}
      </ButtonLink>
    </div>
  );
}
