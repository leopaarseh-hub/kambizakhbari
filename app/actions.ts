'use server';

import { revalidatePath } from 'next/cache';

/**
 * Refresh the cached (ISR) public pages immediately after an admin change, so
 * edits to classes, events, settings, and sold-out/active flags appear on the
 * site right away instead of waiting for the timed revalidation.
 */
export async function revalidatePublicContent() {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/classes', 'page');
  revalidatePath('/[locale]/events', 'page');
  revalidatePath('/[locale]/about', 'page');
}
