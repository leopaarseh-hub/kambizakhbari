'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { localized, type EventRow, type WithSeats } from '@/lib/types';
import type { PaymentDetails } from '@/lib/payment';
import type { Locale } from '@/i18n/routing';
import { formatDate, formatPrice, isUpcoming } from '@/lib/format';
import { PlateImage } from '@/components/ui/PlateImage';
import { Button } from '@/components/ui/Button';
import { SoldOutOverlay } from '@/components/ui/SoldOut';
import { Reveal, Brick } from '@/components/motion/Reveal';
import { RegistrationDialog } from './RegistrationDialog';
import { clsx } from '@/lib/clsx';

interface Props {
  events: WithSeats<EventRow>[];
  payment: PaymentDetails;
  contactEmail: string;
}

export function EventList({ events, payment, contactEmail }: Props) {
  const t = useTranslations('Events');
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState<WithSeats<EventRow> | null>(null);

  if (events.length === 0) {
    return (
      <div className="rounded-plate border border-dashed border-seam bg-plate p-12 text-center">
        <p className="text-bone/60">{t('empty')}</p>
      </div>
    );
  }

  const upcoming = events.filter((e) => isUpcoming(e.event_date));
  const past = events.filter((e) => !isUpcoming(e.event_date));

  return (
    <div className="space-y-16">
      {upcoming.length > 0 && (
        <EventGroup heading={t('upcoming')} events={upcoming} locale={locale}
          highlight onRegister={setSelected} />
      )}
      {past.length > 0 && (
        <EventGroup heading={t('past')} events={past} locale={locale}
          onRegister={setSelected} />
      )}

      {selected && (
        <RegistrationDialog
          target={{
            id: selected.id,
            kind: 'event',
            title: localized(selected, 'title', locale),
            price: selected.price,
            currency: selected.currency,
            freeIfNoPrice: true,
          }}
          payment={payment}
          contactEmail={contactEmail}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function EventGroup({
  heading,
  events,
  locale,
  highlight = false,
  onRegister,
}: {
  heading: string;
  events: WithSeats<EventRow>[];
  locale: Locale;
  highlight?: boolean;
  onRegister: (e: WithSeats<EventRow>) => void;
}) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');

  return (
    <section>
      <div className="mb-7 flex items-center gap-3">
        <span className={clsx('h-2 w-2 rounded-full', highlight ? 'bg-brick' : 'bg-graphite/40')} />
        <h2 className="text-xl font-semibold tracking-tightest text-bone">{heading}</h2>
      </div>

      <Reveal as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const title = localized(event, 'title', locale);
          const description = localized(event, 'description', locale);
          const location = localized(event, 'location', locale);
          const date = formatDate(event.event_date, locale);
          const upcoming = isUpcoming(event.event_date);
          const price = formatPrice(event.price, event.currency, locale);
          const priceLabel = event.price != null && event.price > 0 ? price : tCommon('free');

          return (
            <Brick as="li" key={event.id}>
              <article
                className={clsx(
                  'flex h-full flex-col overflow-hidden rounded-plate bg-plate shadow-snap',
                  !highlight && 'opacity-90',
                )}
              >
                <div className="relative aspect-[16/10] bg-ink">
                  <PlateImage src={event.image_url} alt={title}
                    sizes="(max-width: 768px) 100vw, 33vw" />
                  {event.soldOut && <SoldOutOverlay label={tCommon('soldOut')} />}
                  <span className="absolute top-3 start-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-bone backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-brick" />
                    {priceLabel}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold tracking-tightest text-bone">
                    {title}
                  </h3>
                  <p className="prose-body mt-2 line-clamp-3 text-sm text-bone/70">
                    {description}
                  </p>
                  <dl className="mt-4 space-y-1.5 text-sm">
                    {date && (
                      <div className="flex gap-2">
                        <dt className="text-bone/50">{t('date')}:</dt>
                        <dd className="font-medium text-bone">{date}</dd>
                      </div>
                    )}
                    {location && (
                      <div className="flex gap-2">
                        <dt className="text-bone/50">{t('location')}:</dt>
                        <dd className="font-medium text-bone">{location}</dd>
                      </div>
                    )}
                  </dl>

                  {upcoming && (
                    <div className="mt-5 pt-1">
                      {event.soldOut ? (
                        <Button variant="outline" disabled
                          className="w-full justify-center uppercase tracking-widest">
                          {tCommon('soldOut')}
                        </Button>
                      ) : (
                        <Button onClick={() => onRegister(event)} withArrow
                          className="w-full justify-center">
                          {tCommon('registerNow')}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Brick>
          );
        })}
      </Reveal>
    </section>
  );
}
