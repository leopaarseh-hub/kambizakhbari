import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/queries';
import type { SettingsRow } from '@/lib/types';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
  return <SettingsForm initial={(data as SettingsRow) ?? null} />;
}
