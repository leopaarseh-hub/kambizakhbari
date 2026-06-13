'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { clsx } from '@/lib/clsx';
import { ArrowIcon } from './Icons';

type Variant = 'primary' | 'outline' | 'ghost';

const variants: Record<Variant, string> = {
  primary:
    'bg-brick text-bone shadow-snap hover:shadow-snap-lg',
  outline:
    'bg-transparent text-ink shadow-seam hover:bg-ink hover:text-bone',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
};

const baseClass =
  'group inline-flex items-center gap-2 rounded-plate px-5 py-3 text-sm font-medium transition-colors duration-300 ease-snap focus-visible:outline-2';

function Inner({
  children,
  withArrow,
}: {
  children: ReactNode;
  withArrow?: boolean;
}) {
  return (
    <>
      <span>{children}</span>
      {withArrow && (
        <ArrowIcon className="h-4 w-4 transition-transform duration-300 ease-snap group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      )}
    </>
  );
}

/**
 * Brick-style button. On hover it lifts and clicks into place with a small
 * scale and shadow shift. Reduced motion keeps it static.
 */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  withArrow = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      whileHover={reduce ? undefined : { y: -2, scale: 1.015 }}
      whileTap={reduce ? undefined : { y: 0, scale: 0.99 }}
      className="inline-block"
    >
      <Link href={href} className={clsx(baseClass, variants[variant], className)}>
        <Inner withArrow={withArrow}>{children}</Inner>
      </Link>
    </motion.span>
  );
}

type NativeButtonProps = Omit<
  ComponentProps<'button'>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

export function Button({
  children,
  variant = 'primary',
  withArrow = false,
  className,
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
} & NativeButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileHover={reduce || props.disabled ? undefined : { y: -2, scale: 1.015 }}
      whileTap={reduce || props.disabled ? undefined : { y: 0, scale: 0.99 }}
      className={clsx(
        baseClass,
        variants[variant],
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </motion.button>
  );
}
