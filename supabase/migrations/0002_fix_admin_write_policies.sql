-- ============================================================================
-- 0002: Make admin write access reliable.
-- Some Supabase setups evaluate auth.role() inconsistently, which can silently
-- block the single admin from inserting/updating content. This switches every
-- write policy to the robust "is a signed-in user" check, auth.uid() is not
-- null. Safe to run on top of 0001 (it replaces the same-named policies).
--
-- Run this in the Supabase SQL editor if creating classes/events does nothing.
-- ============================================================================

-- Classes ---------------------------------------------------------------------
drop policy if exists "classes public read" on public.classes;
create policy "classes public read" on public.classes
  for select using (active = true or auth.uid() is not null);

drop policy if exists "classes admin write" on public.classes;
create policy "classes admin write" on public.classes
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Events ----------------------------------------------------------------------
drop policy if exists "events public read" on public.events;
create policy "events public read" on public.events
  for select using (active = true or auth.uid() is not null);

drop policy if exists "events admin write" on public.events;
create policy "events admin write" on public.events
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Registrations ---------------------------------------------------------------
drop policy if exists "registrations admin read" on public.registrations;
create policy "registrations admin read" on public.registrations
  for select using (auth.uid() is not null);

drop policy if exists "registrations admin update" on public.registrations;
create policy "registrations admin update" on public.registrations
  for update using (auth.uid() is not null);

drop policy if exists "registrations admin delete" on public.registrations;
create policy "registrations admin delete" on public.registrations
  for delete using (auth.uid() is not null);

-- Contact messages ------------------------------------------------------------
drop policy if exists "messages admin read" on public.contact_messages;
create policy "messages admin read" on public.contact_messages
  for select using (auth.uid() is not null);

-- Settings --------------------------------------------------------------------
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Storage (admin-uploaded images) --------------------------------------------
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert with check (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.uid() is not null);
