import { getTranslations } from 'next-intl/server';
import { localized, type EventRow } from '@/lib/types';
import type { Locale } from '@/i18n/routing';
import { formatDate, isUpcoming } from '@/lib/format';
import { PlateImage } from '@/components/ui/PlateImage';
import { Reveal, Brick } from '@/components/motion/Reveal';
import { clsx } from '@/lib/clsx';

export async function EventList({
  events,
  locale,
}: {
  events: EventRow[];
  locale: Locale;
}) {
  const t = await getTranslations('Events');

  if (events.length === 0) {
    return (
      <div className="rounded-plate border border-dashed border-seam bg-plate p-12 text-center">
        <p className="text-ink/60">{t('empty')}</p>
      </div>
    );
  }

  const upcoming = events.filter((e) => isUpcoming(e.event_date));
  const past = events.filter((e) => !isUpcoming(e.event_date));

  return (
    <div className="space-y-16">
      {upcoming.length > 0 && (
        <EventGroup
          heading={t('upcoming')}
          events={upcoming}
          locale={locale}
          highlight
        />
      )}
      {past.length > 0 && (
        <EventGroup heading={t('past')} events={past} locale={locale} />
      )}
    </div>
  );
}

async function EventGroup({
  heading,
  events,
  locale,
  highlight = false,
}: {
  heading: string;
  events: EventRow[];
  locale: Locale;
  highlight?: boolean;
}) {
  const t = await getTranslations('Events');

  return (
    <section>
      <div className="mb-7 flex items-center gap-3">
        <span className={clsx('h-2 w-2 rounded-full', highlight ? 'bg-brick' : 'bg-graphite/40')} />
        <h2 className="text-xl font-semibold tracking-tightest text-ink">{heading}</h2>
      </div>

      <Reveal as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const title = localized(event, 'title', locale);
          const description = localized(event, 'description', locale);
          const location = localized(event, 'location', locale);
          const date = formatDate(event.event_date, locale);
          return (
            <Brick as="li" key={event.id}>
              <article
                className={clsx(
                  'flex h-full flex-col overflow-hidden rounded-plate bg-plate shadow-snap',
                  !highlight && 'opacity-90',
                )}
              >
                <div className="relative aspect-[16/10] bg-ink">
                  <PlateImage
                    src={event.image_url}
                    alt={title}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold tracking-tightest text-ink">
                    {title}
                  </h3>
                  <p className="prose-body mt-2 line-clamp-3 text-sm text-ink/70">
                    {description}
                  </p>
                  <dl className="mt-4 space-y-1.5 text-sm">
                    {date && (
                      <div className="flex gap-2">
                        <dt className="text-ink/50">{t('date')}:</dt>
                        <dd className="font-medium text-ink">{date}</dd>
                      </div>
                    )}
                    {location && (
                      <div className="flex gap-2">
                        <dt className="text-ink/50">{t('location')}:</dt>
                        <dd className="font-medium text-ink">{location}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </article>
            </Brick>
          );
        })}
      </Reveal>
    </section>
  );
}
