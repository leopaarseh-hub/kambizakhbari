import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'media';

/**
 * Upload an admin-provided image to the public Storage bucket and return its
 * public URL. Files are namespaced by folder and timestamped to avoid clashes.
 */
export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: string,
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
