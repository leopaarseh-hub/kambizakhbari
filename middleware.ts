import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const handleI18n = createMiddleware(routing);

/**
 * Runs locale routing first, then refreshes the Supabase session on the same
 * response so admin auth cookies stay current. Supabase env vars are optional
 * at build time, so we skip the refresh gracefully when they are absent.
 */
export default async function middleware(request: NextRequest) {
  const response = handleI18n(request);

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return updateSession(request, response);
  }

  return response;
}

export const config = {
  // Match all routes except API, Next internals, and files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
