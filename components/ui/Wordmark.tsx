import type { SVGProps } from 'react';
import { clsx } from '@/lib/clsx';

/**
 * The brick mark: a 2x2 plate with two lit studs. Structural and modular,
 * echoing the brick system without imitating any existing logo.
 */
export function BrickMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...props}>
      <rect
        x="2.5"
        y="6.5"
        width="27"
        height="19"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="11" cy="13" r="2.4" fill="rgb(var(--color-brick))" />
      <circle cx="21" cy="13" r="2.4" fill="currentColor" opacity="0.35" />
      <circle cx="11" cy="20" r="2.4" fill="currentColor" opacity="0.35" />
      <circle cx="21" cy="20" r="2.4" fill="rgb(var(--color-brick))" />
    </svg>
  );
}

/** Brick mark paired with the name set in the display face. */
export function Wordmark({
  className,
  name = 'Kambiz Akhbari',
}: {
  className?: string;
  name?: string;
}) {
  return (
    <span className={clsx('inline-flex items-center gap-2.5', className)}>
      <BrickMark className="h-full w-auto" />
      <span className="font-display text-lg font-semibold tracking-tightest text-current">
        {name}
      </span>
    </span>
  );
}
