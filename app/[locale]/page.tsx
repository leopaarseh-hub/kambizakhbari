import { getTranslations, setRequestLocale, getLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { YouTubeFeed } from '@/components/sections/YouTubeFeed';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, Brick } from '@/components/motion/Reveal';
import { PlateImage } from '@/components/ui/PlateImage';
import { SoldOutPill } from '@/components/ui/SoldOut';
import { Link } from '@/i18n/navigation';
import {
  getActiveClasses,
  getActiveEvents,
  getSettings,
  isSupabaseConfigured,
  attachSeats,
} from '@/lib/queries';
import { demoClasses, demoEvents } from '@/lib/demo';
import { localized, type ClassRow, type EventRow, type WithSeats } from '@/lib/types';
import { resolvePaymentDetails } from '@/lib/payment';
import { formatDate, formatPrice, isUpcoming } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { clsx } from '@/lib/clsx';

// ISR: the home page is cached and refreshed every 5 minutes instead of being
// rendered on every request, so it is served instantly from the edge.
export const revalidate = 300;

// Hero portrait resolution order: photo uploaded in the admin panel (stored in
// settings) > NEXT_PUBLIC_HERO_PORTRAIT env URL > the file committed under
// public/images.
function heroPortrait(heroUrl: string | null | undefined): string {
  return heroUrl || process.env.NEXT_PUBLIC_HERO_PORTRAIT || '/images/kambiz-hero.webp';
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const tCommon = await getTranslations('Common');
  const soldOutLabel = tCommon('soldOut');
  const activeLocale = (await getLocale()) as Locale;

  const [classesRaw, eventsRaw, settings] = await Promise.all([
    getActiveClasses(),
    getActiveEvents(),
    getSettings(),
  ]);
  const configured = isSupabaseConfigured();
  const classes = configured ? classesRaw : attachSeats(demoClasses);
  const events = configured ? eventsRaw : attachSeats(demoEvents);
  const payment = resolvePaymentDetails(settings);

  // Latest two of each, events preferring upcoming dates.
  const topClasses = classes.slice(0, 2);
  const topEvents = [...events]
    .sort((a, b) => Number(isUpcoming(b.event_date)) - Number(isUpcoming(a.event_date)))
    .slice(0, 2);

  return (
    <>
      <Hero portraitSrc={heroPortrait(settings?.hero_image_url)} />

      {/* Biography summary only. The full bio lives on /about. */}
      <section className="shell py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading title={t('bioCta')} seam />
          <div className="reading-panel p-6 sm:p-8">
            <p className="prose-body measure text-xl text-bone/90">{t('bioSummary')}</p>
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

      {/* What's on: latest classes and events. */}
      <section className="shell py-20 sm:py-24">
        <SectionHeading title={t('latestTitle')} intro={t('latestIntro')} />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {topClasses.length > 0 && (
            <Highlights
              heading={t('classesTitle')}
              cta={t('viewClasses')}
              href="/classes"
            >
              {topClasses.map((c) => (
                <ClassMini key={c.id} item={c} locale={activeLocale}
                  currency={payment.currency} soldOutLabel={soldOutLabel} />
              ))}
            </Highlights>
          )}
          {topEvents.length > 0 && (
            <Highlights
              heading={t('eventsTitle')}
              cta={t('viewEvents')}
              href="/events"
            >
              {topEvents.map((e) => (
                <EventMini key={e.id} item={e} locale={activeLocale}
                  soldOutLabel={soldOutLabel} />
              ))}
            </Highlights>
          )}
        </div>
      </section>

      <YouTubeFeed />
    </>
  );
}

function Highlights({
  heading,
  cta,
  href,
  children,
}: {
  heading: string;
  cta: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tightest text-bone">{heading}</h3>
        <ButtonLink href={href} variant="ghost" withArrow className="!text-bone">
          {cta}
        </ButtonLink>
      </div>
      <Reveal as="ul" className="grid gap-4 sm:grid-cols-2">
        {children}
      </Reveal>
    </div>
  );
}

function ClassMini({
  item,
  locale,
  currency,
  soldOutLabel,
}: {
  item: WithSeats<ClassRow>;
  locale: Locale;
  currency: string;
  soldOutLabel: string;
}) {
  const price = formatPrice(item.price, item.currency ?? currency, locale);
  return (
    <MiniCard
      href="/classes"
      image={item.image_url}
      title={localized(item, 'title', locale)}
      meta={price ?? ''}
      soldOut={item.soldOut}
      soldOutLabel={soldOutLabel}
    />
  );
}

function EventMini({
  item,
  locale,
  soldOutLabel,
}: {
  item: WithSeats<EventRow>;
  locale: Locale;
  soldOutLabel: string;
}) {
  const date = formatDate(item.event_date, locale);
  return (
    <MiniCard
      href="/events"
      image={item.image_url}
      title={localized(item, 'title', locale)}
      meta={date ?? ''}
      soldOut={item.soldOut}
      soldOutLabel={soldOutLabel}
    />
  );
}

function MiniCard({
  href,
  image,
  title,
  meta,
  soldOut,
  soldOutLabel,
}: {
  href: string;
  image: string | null;
  title: string;
  meta: string;
  soldOut: boolean;
  soldOutLabel: string;
}) {
  return (
    <Brick as="li">
      <Link
        href={href}
        className="group block overflow-hidden rounded-plate bg-plate shadow-snap transition-shadow duration-300 hover:shadow-snap-lg"
      >
        <div className="relative aspect-[16/10] bg-ink">
          <PlateImage src={image} alt={title} sizes="(max-width: 1024px) 50vw, 25vw" />
          {soldOut && (
            <span className="absolute top-3 start-3 z-10">
              <SoldOutPill label={soldOutLabel} />
            </span>
          )}
        </div>
        <div className="p-4">
          <h4
            className={clsx(
              'line-clamp-1 font-medium tracking-tightest text-bone',
              soldOut && 'opacity-70',
            )}
          >
            {title}
          </h4>
          {meta && <p className="mt-0.5 text-sm text-bone/55">{meta}</p>}
        </div>
      </Link>
    </Brick>
  );
}
