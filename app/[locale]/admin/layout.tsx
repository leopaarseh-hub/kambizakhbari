import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/queries';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminNav } from '@/components/admin/AdminNav';

// The admin panel is always dynamic and never statically cached.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!isSupabaseConfigured()) {
    return (
      <div className="shell grid min-h-[60vh] place-items-center py-20 text-center">
        <p className="max-w-md text-ink/65">
          Supabase is not configured. Add the environment variables from
          .env.example to enable the admin panel.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-bone">
      <AdminNav email={user.email ?? ''} />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
