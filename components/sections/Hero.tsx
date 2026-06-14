'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { heroBrick, snapEase } from '@/components/motion/variants';
import { LegoScene } from '@/components/motion/LegoScene';
import { ButtonLink } from '@/components/ui/Button';
import { BrickMark } from '@/components/ui/Wordmark';
import { SocialLinks } from '@/components/ui/Social';

/**
 * Cinematic hero on a deep ink stage. A living LEGO world of colourful bricks
 * and astronaut minifigures drifts behind the composition, while the name
 * assembles brick by brick on first load. Type sits on the dark stage with
 * strong contrast and never under the floating pieces. Reduced motion rests the
 * scene and shows everything statically.
 *
 * IMAGE SLOT: hero.portrait -> public/images/hero-portrait.jpg (portrait, 4:5).
 */
export function Hero({ portraitSrc }: { portraitSrc?: string }) {
  const t = useTranslations('Home');
  const tMeta = useTranslations('Meta');
  const reduce = useReducedMotion();

  const container: Variants = reduce
    ? {}
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
      };

  return (
    <section className="relative overflow-hidden bg-ink text-bone">
      {/* Brand glow and a faint teal wash echoing the photography. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 78% 18%, rgba(34,184,207,0.18), transparent 60%), radial-gradient(50% 50% at 12% 85%, rgba(216,54,43,0.16), transparent 60%)',
        }}
      />
      {/* The animated LEGO world. */}
      <LegoScene variant="hero" />

      <div className="shell relative z-10 grid gap-12 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-32">
        <motion.div
          variants={container}
          initial={reduce ? undefined : 'hidden'}
          animate={reduce ? undefined : 'visible'}
        >
          <motion.div variants={reduce ? undefined : heroBrick} custom={0}>
            <BrickMark className="mb-7 h-11 w-auto text-bone" />
          </motion.div>

          <h1 className="text-legible text-balance text-5xl font-semibold leading-[0.95] tracking-tightest sm:text-6xl lg:text-7xl">
            <motion.span className="block" variants={reduce ? undefined : heroBrick} custom={1}>
              {t('title')}
            </motion.span>
          </h1>

          <motion.p
            variants={reduce ? undefined : heroBrick}
            custom={2}
            className="prose-body measure mt-6 text-lg text-bone/75"
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
            <ButtonLink
              href="/about"
              variant="ghost"
              className="!text-bone ring-1 ring-bone/25 hover:!bg-bone/10"
            >
              {t('bioCta')}
            </ButtonLink>
          </motion.div>

          <motion.div variants={reduce ? undefined : heroBrick} custom={4} className="mt-8">
            <SocialLinks size="lg" />
          </motion.div>
        </motion.div>

        <HeroPortrait portraitSrc={portraitSrc} alt={tMeta('ogAlt')} />
      </div>

      {/* Bottom seam transitioning into the light page below. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink"
      />
    </section>
  );
}

function HeroPortrait({
  portraitSrc,
  alt,
}: {
  portraitSrc?: string;
  alt: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -24, rotate: -1.5 }}
      animate={reduce ? {} : { opacity: 1, y: 0, rotate: 0, transition: { ...snapEase, delay: 0.35 } }}
      className="relative mx-auto w-full max-w-sm"
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative aspect-[4/5] overflow-hidden rounded-plate bg-ink shadow-snap-lg ring-1 ring-bone/10"
      >
        {portraitSrc ? (
          <Image
            src={portraitSrc}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 80vw, 38vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center brick-grid-bg">
            <BrickMark className="h-14 w-auto text-bone/25" />
          </div>
        )}
        {/* studded corner accent */}
        <span className="absolute top-3 end-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brick" />
          <span className="h-2 w-2 rounded-full bg-[#FFC500]" />
          <span className="h-2 w-2 rounded-full bg-[#1574D6]" />
        </span>
      </motion.div>

      {/* A snapped colourful plate behind, for depth. */}
      <div
        aria-hidden
        className="absolute -bottom-4 -z-10 h-24 w-40 rounded-plate bg-brick/90 shadow-snap-lg"
        style={{ insetInlineStart: '-1.25rem' }}
      />
    </motion.div>
  );
}
