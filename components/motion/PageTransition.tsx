'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { pageTransition } from './variants';

/**
 * Smooth modular wipe between routes. Keyed on the pathname so each navigation
 * animates the new plate in. Reduced motion renders without transition.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-[60vh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
