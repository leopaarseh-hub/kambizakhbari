'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';

/**
 * Hides public chrome (footer, page transition wrapper) on admin routes so the
 * panel stands on its own. The header gates itself directly.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <>{children}</>;
}
