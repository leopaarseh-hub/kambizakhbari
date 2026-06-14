-- ============================================================================
-- Kambiz Akhbari portfolio: schema, Row Level Security, and Storage.
-- Run this in the Supabase SQL editor, or via the Supabase CLI:
--   supabase db push
-- ============================================================================

-- Enums -----------------------------------------------------------------------
do $$ begin
  create type class_type as enum ('online', 'in_person');
exception when duplicate_object then null; end $$;

do $$ begin
  create type registration_status as enum ('pending', 'confirmed', 'cancelled');
exception when duplicate_object then null; end $$;

-- Classes ---------------------------------------------------------------------
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_fa text not null,
  description_en text not null default '',
  description_fa text not null default '',
  type class_type not null default 'online',
  price numeric,
  currency text default 'TRY',
  capacity integer,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Events ----------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_fa text not null,
  description_en text not null default '',
  description_fa text not null default '',
  event_date date,
  location_en text,
  location_fa text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Registrations ---------------------------------------------------------------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_type class_type not null default 'online',
  message text,
  status registration_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Contact messages ------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Settings (singleton row id = 1) --------------------------------------------
create table if not exists public.settings (
  id integer primary key default 1,
  iban text,
  account_holder text,
  default_currency text default 'TRY',
  hero_image_url text,
  about_image_url text,
  constraint settings_singleton check (id = 1)
);

insert into public.settings (id, iban, account_holder, default_currency)
values (1, null, 'Kambiz Akhbari', 'TRY')
on conflict (id) do nothing;

-- ============================================================================
-- Row Level Security
-- Public can read active content and the settings row, and can insert
-- registrations and contact messages. Only the authenticated admin can read
-- private data and perform writes/updates/deletes on content.
-- ============================================================================
alter table public.classes enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.settings enable row level security;

-- Classes: public read of active rows; admin full access.
drop policy if exists "classes public read" on public.classes;
create policy "classes public read" on public.classes
  for select using (active = true or auth.uid() is not null);

drop policy if exists "classes admin write" on public.classes;
create policy "classes admin write" on public.classes
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Events: public read of active rows; admin full access.
drop policy if exists "events public read" on public.events;
create policy "events public read" on public.events
  for select using (active = true or auth.uid() is not null);

drop policy if exists "events admin write" on public.events;
create policy "events admin write" on public.events
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Registrations: anyone may create; only admin may read/update/delete.
drop policy if exists "registrations public insert" on public.registrations;
create policy "registrations public insert" on public.registrations
  for insert with check (true);

drop policy if exists "registrations admin read" on public.registrations;
create policy "registrations admin read" on public.registrations
  for select using (auth.uid() is not null);

drop policy if exists "registrations admin update" on public.registrations;
create policy "registrations admin update" on public.registrations
  for update using (auth.uid() is not null);

drop policy if exists "registrations admin delete" on public.registrations;
create policy "registrations admin delete" on public.registrations
  for delete using (auth.uid() is not null);

-- Contact messages: anyone may create; only admin may read.
drop policy if exists "messages public insert" on public.contact_messages;
create policy "messages public insert" on public.contact_messages
  for insert with check (true);

drop policy if exists "messages admin read" on public.contact_messages;
create policy "messages admin read" on public.contact_messages
  for select using (auth.uid() is not null);

-- Settings: public may read the singleton; only admin may write.
drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings
  for select using (true);

drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ============================================================================
-- Storage: public bucket for admin-uploaded images.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can read public objects; only the admin can upload, update, delete.
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert with check (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.uid() is not null);
