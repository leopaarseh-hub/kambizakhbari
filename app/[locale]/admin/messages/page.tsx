import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/queries';
import type { ContactMessageRow } from '@/lib/types';
import { MessagesTable } from '@/components/admin/MessagesTable';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return <MessagesTable initial={(data as ContactMessageRow[]) ?? []} />;
}
