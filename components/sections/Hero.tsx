'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { heroBrick, snapEase } from '@/components/motion/variants';
import { ButtonLink } from '@/components/ui/Button';
import { BrickMark } from '@/components/ui/Wordmark';

/**
 * Cinematic hero. On first load the bricks assemble into the composition with a
 * staggered, slightly physical settle, then rest. The name sits on a solid
 * plate so type never competes with texture. Reduced motion renders it static.
 *
 * IMAGE SLOT: hero.portrait -> public/images/hero-portrait.jpg (portrait, 4:5).
 * When absent, a branded ink plate stands in cleanly.
 */
export function Hero({ portraitSrc }: { portraitSrc?: string }) {
  const t = useTranslations('Home');
  const reduce = useReducedMotion();

  const container: Variants = reduce
    ? {}
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
      };

  return (
    <section className="relative overflow-hidden border-b border-seam">
      <div className="shell relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <motion.div
          variants={container}
          initial={reduce ? undefined : 'hidden'}
          animate={reduce ? undefined : 'visible'}
        >
          <motion.div variants={reduce ? undefined : heroBrick} custom={0}>
            <BrickMark className="mb-7 h-10 w-auto text-ink" />
          </motion.div>

          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tightest text-ink sm:text-6xl lg:text-7xl">
            <motion.span className="block" variants={reduce ? undefined : heroBrick} custom={1}>
              {t('title')}
            </motion.span>
          </h1>

          <motion.p
            variants={reduce ? undefined : heroBrick}
            custom={2}
            className="prose-body measure mt-6 text-lg text-ink/70"
          >
            {t('positioning')}
          </motion.p>

          <motion.div
            variants={reduce ? undefined : heroBrick}
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/work" withArrow>
              {t('workCta')}
            </ButtonLink>
            <ButtonLink href="/about" variant="outline">
              {t('bioCta')}
            </ButtonLink>
          </motion.div>
        </motion.div>

        <HeroComposition portraitSrc={portraitSrc} />
      </div>
    </section>
  );
}

function HeroComposition({ portraitSrc }: { portraitSrc?: string }) {
  const reduce = useReducedMotion();
  const tMeta = useTranslations('Meta');

  const plate = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: -22, rotate: i % 2 ? 1.5 : -1.5 },
    animate: reduce
      ? {}
      : { opacity: 1, y: 0, rotate: 0, transition: { ...snapEase, delay: 0.2 + i * 0.08 } },
  });

  return (
    <div className="relative mx-auto grid w-full max-w-md grid-cols-3 grid-rows-4 gap-3 sm:gap-4">
      {/* Primary portrait plate spanning two columns and three rows. */}
      <motion.div
        {...plate(0)}
        className="relative col-span-2 row-span-3 overflow-hidden rounded-plate bg-ink shadow-snap-lg"
      >
        {portraitSrc ? (
          <Image
            src={portraitSrc}
            alt={tMeta('ogAlt')}
            fill
            sizes="(max-width: 1024px) 60vw, 30vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center brick-grid-bg">
            <BrickMark className="h-12 w-auto text-bone/30" />
          </div>
        )}
        <span className="pointer-events-none absolute top-3 end-3 flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-bone/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-bone/40" />
        </span>
      </motion.div>

      {/* Accent brick plate. */}
      <motion.div
        {...plate(1)}
        className="col-span-1 row-span-1 rounded-plate bg-brick shadow-snap"
      />

      {/* Stud plate. */}
      <motion.div
        {...plate(2)}
        className="col-span-1 row-span-2 grid place-items-center rounded-plate bg-plate shadow-snap"
      >
        <span className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="stud" />
          ))}
        </span>
      </motion.div>

      {/* Graphite seam plate along the base. */}
      <motion.div
        {...plate(3)}
        className="col-span-3 row-span-1 flex items-center justify-between rounded-plate bg-ink px-5 shadow-snap"
      >
        <span className="font-display text-sm font-medium tracking-tightest text-bone/80">
          Lead34
        </span>
        <span className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brick" />
          <span className="h-1.5 w-1.5 rounded-full bg-bone/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-bone/40" />
        </span>
      </motion.div>
    </div>
  );
}
