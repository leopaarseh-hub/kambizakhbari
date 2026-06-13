import { createServerClient } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';

/**
 * Refreshes the Supabase auth session on each request and writes the updated
 * cookies onto the response that next-intl already prepared. Keeping the admin
 * session fresh is what lets protected server components read it reliably.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Touching getUser() triggers a token refresh when needed.
  await supabase.auth.getUser();

  return response;
}
