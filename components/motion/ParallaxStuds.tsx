'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

/**
 * A faint background layer of studs that drifts subtly on scroll for depth.
 * Lives behind content in margins only, never under reading text, and never
 * loud enough to compete with photography. Hidden under reduced motion.
 */
export function ParallaxStuds({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  if (reduce) return null;

  const studs = Array.from({ length: 18 });

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div style={{ y }} className="grid h-full grid-cols-6 gap-10 p-10">
        {studs.map((_, i) => (
          <span
            key={i}
            className="block h-2 w-2 self-start justify-self-start rounded-full"
            style={{
              backgroundColor:
                i % 7 === 0
                  ? 'rgb(var(--color-brick) / 0.5)'
                  : 'rgb(var(--color-graphite) / 0.22)',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
