'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useReducedMotion, motion } from 'framer-motion';
import { localized, type ClassRow } from '@/lib/types';
import type { PaymentDetails } from '@/lib/payment';
import type { Locale } from '@/i18n/routing';
import { formatPrice, toLocaleDigits } from '@/lib/format';
import { PlateImage } from '@/components/ui/PlateImage';
import { Button } from '@/components/ui/Button';
import { Reveal, Brick } from '@/components/motion/Reveal';
import { RegistrationDialog } from './RegistrationDialog';
import { clsx } from '@/lib/clsx';

interface Props {
  classes: ClassRow[];
  payment: PaymentDetails;
  contactEmail: string;
}

export function ClassList({ classes, payment, contactEmail }: Props) {
  const t = useTranslations('Classes');
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState<ClassRow | null>(null);

  if (classes.length === 0) {
    return (
      <div className="rounded-plate border border-dashed border-seam bg-plate p-12 text-center">
        <p className="text-bone/60">{t('empty')}</p>
      </div>
    );
  }

  return (
    <>
      <Reveal as="ul" className="grid gap-6 md:grid-cols-2">
        {classes.map((klass) => (
          <ClassCard
            key={klass.id}
            klass={klass}
            locale={locale}
            currencyFallback={payment.currency}
            onRegister={() => setSelected(klass)}
          />
        ))}
      </Reveal>

      {selected && (
        <RegistrationDialog
          klass={selected}
          payment={payment}
          contactEmail={contactEmail}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function ClassCard({
  klass,
  locale,
  currencyFallback,
  onRegister,
}: {
  klass: ClassRow;
  locale: Locale;
  currencyFallback: string;
  onRegister: () => void;
}) {
  const t = useTranslations('Classes');
  const reduce = useReducedMotion();
  const title = localized(klass, 'title', locale);
  const description = localized(klass, 'description', locale);
  const price = formatPrice(klass.price, klass.currency ?? currencyFallback, locale);
  const isOnline = klass.type === 'online';

  return (
    <Brick as="li">
      <motion.article
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="flex h-full flex-col overflow-hidden rounded-plate bg-plate shadow-snap transition-shadow duration-300 hover:shadow-snap-lg"
      >
        <div className="relative aspect-[16/10] bg-ink">
          <PlateImage
            src={klass.image_url}
            alt={title}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span
            className={clsx(
              'absolute top-3 start-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur',
              isOnline ? 'bg-ink/80 text-bone' : 'bg-brick text-bone',
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {isOnline ? t('online') : t('inPerson')}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold tracking-tightest text-bone">
            {title}
          </h3>
          <p className="prose-body mt-2 line-clamp-4 text-bone/70">{description}</p>

          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brick" />
              <dt className="text-bone/55">{t('price')}:</dt>
              <dd className="font-medium text-bone">{price ?? t('priceOnRequest')}</dd>
            </div>
            {klass.capacity != null && (
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-graphite/40" />
                <dt className="text-bone/55">{t('capacity')}:</dt>
                <dd className="font-medium text-bone">
                  {t('seats', { count: toLocaleDigits(klass.capacity, locale) })}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-6 pt-2">
            <Button onClick={onRegister} withArrow className="w-full justify-center">
              {t('register')}
            </Button>
          </div>
        </div>
      </motion.article>
    </Brick>
  );
}
