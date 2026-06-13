import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/queries';
import type { EventRow } from '@/lib/types';
import { EventManager } from '@/components/admin/EventManager';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  return <EventManager initial={(data as EventRow[]) ?? []} />;
}
