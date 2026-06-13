'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { workItems } from '@/lib/work';
import type { Locale } from '@/i18n/routing';
import type { WorkCategory } from '@/lib/types';
import { clsx } from '@/lib/clsx';
import { PlateImage } from '@/components/ui/PlateImage';
import { CloseIcon } from '@/components/ui/Icons';

const filters: Array<{ key: 'all' | WorkCategory; label: string }> = [
  { key: 'all', label: 'filterAll' },
  { key: 'fashion', label: 'filterFashion' },
  { key: 'film', label: 'filterFilm' },
  { key: 'direction', label: 'filterDirection' },
];

export function WorkWall() {
  const t = useTranslations('Work');
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const [active, setActive] = useState<'all' | WorkCategory>('all');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const visible = workItems.filter(
    (item) => active === 'all' || item.category === active,
  );
  const current = workItems.find((item) => item.id === lightbox);

  return (
    <div>
      {/* Stud-style filter toggles. */}
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label={t('title')}>
        {filters.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(f.key)}
              className={clsx(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200',
                isActive
                  ? 'border-ink bg-ink text-bone'
                  : 'border-seam text-ink/70 hover:border-ink/40',
              )}
            >
              <span
                className={clsx(
                  'h-1.5 w-1.5 rounded-full',
                  isActive ? 'bg-brick' : 'bg-graphite/40',
                )}
              />
              {t(f.label)}
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        <motion.ul
          layout={!reduce}
          className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.li
                key={item.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="break-inside-avoid"
              >
                <button
                  onClick={() => setLightbox(item.id)}
                  aria-label={t('openLabel')}
                  className="group relative block w-full overflow-hidden rounded-plate bg-ink shadow-snap transition-shadow duration-300 hover:shadow-snap-lg"
                >
                  <div className={clsx('relative', item.aspect)}>
                    <PlateImage
                      src={item.src}
                      alt={item.alt[locale]}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <span className="pointer-events-none absolute inset-0 rounded-plate ring-1 ring-inset ring-ink/10" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-ink/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label={t('closeLabel')}
              className="absolute top-5 end-5 grid h-11 w-11 place-items-center rounded-full border border-bone/30 text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <motion.div
              initial={reduce ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                'relative w-full max-w-3xl overflow-hidden rounded-plate bg-ink shadow-snap-lg',
                current.aspect,
              )}
            >
              <PlateImage
                src={current.src}
                alt={current.alt[locale]}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
