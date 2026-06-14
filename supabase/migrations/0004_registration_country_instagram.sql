-- ============================================================================
-- 0004: Capture the registrant's country and Instagram on registrations.
-- Country drives the payment flow (Turkey uses IBAN; elsewhere Kambiz makes
-- contact to arrange payment). Safe to run on top of earlier migrations.
-- ============================================================================

alter table public.registrations
  add column if not exists country text,
  add column if not exists instagram text;
