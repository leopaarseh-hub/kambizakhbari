'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { clsx } from '@/lib/clsx';
import { frameSnap } from '@/components/motion/variants';

interface BrickFrameProps {
  src: string;
  alt: string;
  /** Aspect ratio as a Tailwind class, e.g. aspect-[4/5]. */
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Show a hint of stud detailing at one corner of the frame. */
  studs?: boolean;
  rounded?: boolean;
}

/**
 * Image frame shaped like a clean brick plate, with an optional hint of stud
 * detailing at a corner. The photograph is always the hero; the frame elevates
 * it and never competes. Snaps into place on scroll.
 */
export function BrickFrame({
  src,
  alt,
  aspect = 'aspect-[4/5]',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  studs = true,
  rounded = true,
}: BrickFrameProps) {
  const reduce = useReducedMotion();

  return (
    <motion.figure
      variants={reduce ? undefined : frameSnap}
      className={clsx(
        'group relative overflow-hidden bg-ink shadow-snap',
        rounded && 'rounded-plate',
        aspect,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {/* Hairline inset seam keeps the plate edge crisp over any photo. */}
      <span
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10',
          rounded && 'rounded-plate',
        )}
      />
      {studs && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-3 end-3 flex gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-bone/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-bone/40" />
        </span>
      )}
    </motion.figure>
  );
}
