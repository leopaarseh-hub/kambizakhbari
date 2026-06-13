'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { brickItem, staggerContainer } from './variants';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'ul' | 'article';
}

/**
 * Scroll-triggered container that builds its children brick by brick.
 * Respects prefers-reduced-motion with a calm, immediate static render.
 */
export function Reveal({ children, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
    >
      {children}
    </MotionTag>
  );
}

interface BrickProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'figure';
}

/** A single brick that settles into place inside a Reveal group. */
export function Brick({ children, className, as = 'div' }: BrickProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={brickItem}>
      {children}
    </MotionTag>
  );
}
