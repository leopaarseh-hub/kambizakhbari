import { createClient } from '@supabase/supabase-js';

/**
 * Cookie-free Supabase client for public, read-only data (classes, events,
 * settings). Because it never touches request cookies, pages that use it can be
 * statically rendered and cached (ISR) instead of rendered dynamically on every
 * request, which is a large speed win. All access stays gated by Row Level
 * Security, so only public rows are ever returned.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
