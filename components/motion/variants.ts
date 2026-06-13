import type { Variants, Transition } from 'framer-motion';

/** A slightly physical settle, like a brick clicking into place. */
export const snapEase: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

export const snapTween: Transition = {
  duration: 0.5,
  ease: [0.2, 0.8, 0.2, 1],
};

/** Container that staggers its children so a section builds brick by brick. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

/** A single brick settling up into place. GPU-accelerated transforms only. */
export const brickItem: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: snapEase,
  },
};

/** Image snapping into its frame. */
export const frameSnap: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  },
};

/** Hero brick assembly from a scattered, lifted state into the composition. */
export const heroBrick: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: -28 - (i % 3) * 10,
    rotate: i % 2 === 0 ? -2 : 2,
  }),
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: snapEase,
  },
};

/** Modular brick wipe used between routes. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};
