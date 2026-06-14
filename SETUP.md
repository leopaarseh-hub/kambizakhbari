# Connect Supabase (3 steps, ~5 minutes)

The code is ready. Do these three things and the whole backend is live.

## 1. Run the schema (Supabase Dashboard → SQL Editor)

Open the SQL Editor, click **New query**, paste the entire contents of
`supabase/migrations/0001_schema.sql`, and click **Run**.

This creates every table, the Row Level Security policies, and the public
`media` storage bucket. To get sample classes and an event, also run
`supabase/seed.sql` the same way (optional).

> If you later see "Bucket not found" when uploading an image, the bucket was
> not created (creating buckets via SQL is unreliable). Fix it in the dashboard:
> **Storage → New bucket →** name it exactly **`media`** and turn **Public** on.
> Then re-run `supabase/migrations/0002_fix_admin_write_policies.sql` so the
> upload policies apply.

## 2. Create the admin user (Authentication → Users → Add user)

Add one user with an email and password. This is the only login for `/admin`.
There is no public sign-up.

## 3. Add the keys

From **Project Settings → API**, copy the **Project URL** and the
**anon / public** key into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Then verify the connection:

```bash
npm run check:supabase
```

A healthy result shows `classes`, `events`, and `settings` reachable, and
`registrations` / `contact_messages` reported as protected by RLS (that is
correct, not an error), and the `media` bucket present.

## For production (Vercel)

Add the same two variables (plus `NEXT_PUBLIC_SITE_URL`) under
**Project Settings → Environment Variables**, then redeploy. Add your Vercel
domain under Supabase **Authentication → URL Configuration** so admin login
redirects resolve.

## After connecting

- Sign in at `/en/admin` (or `/fa/admin`).
- Open **Settings** and set the real IBAN, account holder, and currency.
- Add classes and events; upload their images there.
- Drop the static photos into the slots in `docs/IMAGE_MANIFEST.md`.
