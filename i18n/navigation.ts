import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation primitives. Always import Link, useRouter, etc.
 * from here so locale prefixes and RTL stay consistent across the app.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
