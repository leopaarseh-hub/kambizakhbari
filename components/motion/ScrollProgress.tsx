'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * A thin scroll-progress rail capped by a single travelling stud. Sits at the
 * top of the viewport as a refined brick accent, not a loud bar.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-[0%] bg-brick"
      style={{ scaleX }}
    />
  );
}
