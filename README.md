# Kambiz Akhbari

Bilingual (English + Persian) portfolio for Kambiz Akhbari: fashion
photographer, filmmaker, and art director based in Istanbul.

Built on a restrained "Architectural LEGO" design system: a strict modular
brick grid, refined stud accents, generous whitespace, and cinematic
Framer Motion assembly. Photography is always the hero.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS with a CSS-variable design-token layer
- Framer Motion for all animation, page transitions, and reduced-motion fallback
- next-intl for i18n (EN/FA) with locale-prefixed routes and full RTL
- Supabase for Postgres, Auth (single admin), and Storage
- next/font self-hosting Vazirmatn (Persian), Space Grotesk (display), Inter (body)
- Deploy target: Vercel

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000  (redirects to /en)
```

The site runs without Supabase configured: dynamic sections (classes, events)
render their empty states and the admin panel shows a configuration notice.
Wire up Supabase to enable the full backend.

## Environment variables

See `.env.example`. Summary:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (RLS-gated) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key (kept out of client bundles) |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | Public image bucket name (default `media`) |
| `NEXT_PUBLIC_PAYMENT_IBAN` | Fallback IBAN if the `settings` row is empty |
| `NEXT_PUBLIC_PAYMENT_ACCOUNT_HOLDER` | Fallback account holder |
| `NEXT_PUBLIC_PAYMENT_CURRENCY` | Fallback currency (default `TRY`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO / Open Graph |

Payment details are read from the `settings` table first and fall back to these
env vars, so the IBAN is never hardcoded across the app.

## Supabase setup

1. Create a project at supabase.com.
2. Open the SQL editor and run `supabase/migrations/0001_schema.sql`. This
   creates the tables, enums, Row Level Security policies, and the public
   `media` Storage bucket.
3. (Optional) Run `supabase/seed.sql` for sample classes and an event.
4. Create the single admin user under Authentication > Users > Add user
   (email + password). There is no public sign-up; this user is the only login.
5. In the admin panel, open Settings and set the IBAN, account holder, and
   default currency.

Using the Supabase CLI instead:

```bash
supabase link --project-ref <ref>
supabase db push          # applies migrations
```

### Data model

- `classes` — bilingual title/description, type (online | in_person), price,
  currency, capacity, image, active.
- `events` — bilingual title/description, date, bilingual location, image, active.
- `registrations` — class_id, contact details, preferred_type, message,
  status (pending | confirmed | cancelled).
- `contact_messages` — name, email, message.
- `settings` — singleton row (id = 1): iban, account_holder, default_currency.

### Security model (RLS)

- Public can read active `classes`, active `events`, and the `settings` row.
- Public can insert into `registrations` and `contact_messages`.
- Only the authenticated admin can read registrations/messages and
  create/update/delete content, and upload to Storage.

## Registration to payment flow

Classes have no payment gateway. A registration is a manual bank transfer:

1. The visitor opens a class and fills the registration form.
2. On submit, a row is written to `registrations` with status `pending`.
3. A confirmation screen shows the IBAN, account holder, amount, and a note to
   email the transfer receipt to `Info@kambizakhbari.com`. The IBAN is copyable.
4. The admin reviews the registration and marks it `confirmed` or `cancelled`.

## Admin panel

Visit `/en/admin` (or `/fa/admin`). Unauthenticated visitors see a login
screen. After signing in with the admin account you can:

- CRUD classes and events, toggle active, upload images to Storage.
- Review registrations, filter by status, and confirm/cancel them.
- Read inbound contact messages.
- Edit the IBAN, account holder, and default currency in Settings.

## Images

The photography slots are documented in `docs/IMAGE_MANIFEST.md`. Drop the
provided photos into the named paths under `public/images/`. Until a slot is
filled, a clean branded placeholder plate is shown (never a broken image).
Class and event images are uploaded through the admin panel.

## Internationalisation and RTL

- Routes are locale-prefixed: `/en` (LTR) and `/fa` (RTL).
- `dir` is set per locale at the document level; layouts use CSS logical
  properties throughout, so nothing is hardcoded left/right.
- Persian uses Vazirmatn, self-hosted via next/font (no broken glyphs).
- Numerals render in Persian for FA and Latin for EN.
- All copy lives in `messages/en.json` and `messages/fa.json`.

## Scripts

```bash
npm run dev        # local development
npm run build      # production build (runs type-check and lint)
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Deploy to Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Add every variable from `.env.example` in Project Settings > Environment
   Variables.
3. In Supabase, add your Vercel domain under Authentication > URL
   Configuration so admin auth redirects resolve.
4. Deploy. The framework preset is Next.js; no extra configuration is needed.

## Accessibility and performance

- Semantic HTML, keyboard navigation, visible focus states, alt text on every
  image, and a skip-to-content link.
- `prefers-reduced-motion` is fully respected with a calm static fallback.
- Images use `next/image` with AVIF/WebP, lazy loading, and stable aspect
  ratios to avoid layout shift.
