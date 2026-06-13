import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/queries';
import type { ClassRow } from '@/lib/types';
import { ClassManager } from '@/components/admin/ClassManager';

export const dynamic = 'force-dynamic';

export default async function AdminClassesPage() {
  // The layout gates access; this guard also keeps the component safe to render
  // when Supabase is not configured yet.
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false });

  return <ClassManager initial={(data as ClassRow[]) ?? []} />;
}
