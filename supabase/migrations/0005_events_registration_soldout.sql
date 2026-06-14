-- ============================================================================
-- 0005: Event registration, pricing/capacity, and sold-out support.
--  - Classes and events get a manual sold_out flag.
--  - Events get price, currency, capacity (so an event can be free-with-capacity
--    or paid).
--  - Registrations can belong to an event as well as a class.
--  - Public, PII-free views expose the confirmed-seat count per class/event so
--    the site can auto-mark items sold out once confirmed registrations reach
--    capacity.
-- Safe to run on top of earlier migrations.
-- ============================================================================

alter table public.classes
  add column if not exists sold_out boolean not null default false;

alter table public.events
  add column if not exists price numeric,
  add column if not exists currency text default 'TRY',
  add column if not exists capacity integer,
  add column if not exists sold_out boolean not null default false;

alter table public.registrations
  add column if not exists event_id uuid references public.events (id) on delete set null;

-- Confirmed-seat counts, aggregated only (no personal data exposed).
create or replace view public.class_seat_counts as
  select class_id, count(*)::int as confirmed
  from public.registrations
  where status = 'confirmed' and class_id is not null
  group by class_id;

create or replace view public.event_seat_counts as
  select event_id, count(*)::int as confirmed
  from public.registrations
  where status = 'confirmed' and event_id is not null
  group by event_id;

grant select on public.class_seat_counts to anon, authenticated;
grant select on public.event_seat_counts to anon, authenticated;
