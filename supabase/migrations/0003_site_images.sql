-- ============================================================================
-- 0003: Store the hero and biography portraits in settings, so they can be
-- uploaded straight from the admin panel (no code or GitHub needed).
-- Safe to run on top of 0001/0002.
-- ============================================================================

alter table public.settings
  add column if not exists hero_image_url text,
  add column if not exists about_image_url text;
