import { createPublicClient } from './supabase/public';
import type { ClassRow, EventRow, SettingsRow, WithSeats } from './types';

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

/** Effective sold-out: a manual toggle, or capacity reached by confirmations. */
export function isSoldOut(
  item: { sold_out: boolean; capacity: number | null },
  confirmed: number,
): boolean {
  if (item.sold_out) return true;
  if (item.capacity != null && confirmed >= item.capacity) return true;
  return false;
}

/** Wrap plain rows (e.g. demo data) with zero confirmed seats. */
export function attachSeats<T extends { sold_out: boolean; capacity: number | null }>(
  rows: T[],
): WithSeats<T>[] {
  return rows.map((r) => ({ ...r, confirmed: 0, soldOut: isSoldOut(r, 0) }));
}

export async function getActiveClasses(): Promise<WithSeats<ClassRow>[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const [{ data, error }, { data: counts }] = await Promise.all([
    supabase.from('classes').select('*').eq('active', true).order('created_at', { ascending: false }),
    supabase.from('class_seat_counts').select('*'),
  ]);
  if (error) return [];
  const taken = new Map<string, number>(
    (counts ?? []).map((c: { class_id: string; confirmed: number }) => [c.class_id, c.confirmed]),
  );
  return ((data as ClassRow[]) ?? []).map((c) => {
    const confirmed = taken.get(c.id) ?? 0;
    return { ...c, confirmed, soldOut: isSoldOut(c, confirmed) };
  });
}

export async function getActiveEvents(): Promise<WithSeats<EventRow>[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const [{ data, error }, { data: counts }] = await Promise.all([
    supabase.from('events').select('*').eq('active', true).order('event_date', { ascending: false }),
    supabase.from('event_seat_counts').select('*'),
  ]);
  if (error) return [];
  const taken = new Map<string, number>(
    (counts ?? []).map((c: { event_id: string; confirmed: number }) => [c.event_id, c.confirmed]),
  );
  return ((data as EventRow[]) ?? []).map((e) => {
    const confirmed = taken.get(e.id) ?? 0;
    return { ...e, confirmed, soldOut: isSoldOut(e, confirmed) };
  });
}

export async function getSettings(): Promise<SettingsRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) return null;
  return (data as SettingsRow) ?? null;
}
