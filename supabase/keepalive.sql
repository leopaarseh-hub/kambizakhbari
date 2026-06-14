-- Supabase free-tier keepalive.
-- A tiny table that the scheduled GitHub Action reads every few days so the
-- project keeps registering activity and is not paused after 7 days idle.
-- Run this once in the Supabase SQL editor (project xsyzeftbmuoymxfihfdq).

create table if not exists keepalive (
  id int primary key default 1,
  pinged_at timestamptz default now()
);

insert into keepalive (id) values (1) on conflict (id) do nothing;
