import { notFound } from 'next/navigation';

/**
 * Catch-all for unknown paths under a locale. Renders the localized 404 inside
 * the locale layout so the shell and language stay correct.
 */
export default function CatchAll() {
  notFound();
}
