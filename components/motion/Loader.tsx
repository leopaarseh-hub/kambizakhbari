'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * First-paint loader: a small cluster of studs assembling into the logo mark,
 * then lifting away to reveal the page. Shows once per session, briefly, and
 * never blocks content for long. Skipped entirely under reduced motion.
 */
export function Loader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    if (sessionStorage.getItem('ka-loaded')) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem('ka-loaded', '1');
      setDone(true);
    }, 1100);
    return () => clearTimeout(t);
  }, [reduce]);

  if (reduce) return null;

  // A 2x2 brick mark: four studs snapping into a square plate.
  const studs = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-[10px] border border-bone/15" />
            {studs.map((s, i) => (
              <motion.span
                key={i}
                className="absolute h-4 w-4 rounded-full bg-brick"
                style={{
                  left: `calc(50% + ${s.x ? 6 : -22}px)`,
                  top: `calc(50% + ${s.y ? 6 : -22}px)`,
                }}
                initial={{ opacity: 0, scale: 0.2, y: -18 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    delay: 0.12 * i,
                    type: 'spring',
                    stiffness: 260,
                    damping: 18,
                  },
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
