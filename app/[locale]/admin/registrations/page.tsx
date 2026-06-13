import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/queries';
import type { ClassRow, RegistrationRow } from '@/lib/types';
import { RegistrationsTable } from '@/components/admin/RegistrationsTable';

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const [{ data: regs }, { data: classes }] = await Promise.all([
    supabase.from('registrations').select('*').order('created_at', { ascending: false }),
    supabase.from('classes').select('id, title_en'),
  ]);

  const classTitles: Record<string, string> = {};
  for (const c of (classes as Pick<ClassRow, 'id' | 'title_en'>[]) ?? []) {
    classTitles[c.id] = c.title_en;
  }

  return (
    <RegistrationsTable
      initial={(regs as RegistrationRow[]) ?? []}
      classTitles={classTitles}
    />
  );
}
