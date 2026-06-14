'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Page enter animation that is safe for the App Router. Each route renders in a
 * wrapper keyed by pathname, so React remounts it and a lightweight CSS
 * keyframe fades the new page in. There is no AnimatePresence and no exit
 * "wait" phase, which is what previously stranded new pages until a reload.
 * The reduced-motion rule in globals.css neutralises the animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="ka-page-in">
      {children}
    </div>
  );
}
