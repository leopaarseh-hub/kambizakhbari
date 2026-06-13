import { createClient } from './supabase/server';
import type { ClassRow, EventRow, SettingsRow } from './types';

/**
 * True when Supabase is configured. Lets every page render cleanly during
 * local development or preview builds before the backend is wired up.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getActiveClasses(): Promise<ClassRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data as ClassRow[]) ?? [];
}

export async function getClassById(id: string): Promise<ClassRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();
  if (error) return null;
  return (data as ClassRow) ?? null;
}

export async function getActiveEvents(): Promise<EventRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('active', true)
    .order('event_date', { ascending: false });
  if (error) return [];
  return (data as EventRow[]) ?? [];
}

export async function getSettings(): Promise<SettingsRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) return null;
  return (data as SettingsRow) ?? null;
}
