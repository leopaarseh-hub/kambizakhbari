# First time with Supabase: adding classes and events

You have two ways to add content. The **Admin panel** is the easy, everyday
way. The **Supabase Table Editor** is the direct way, useful to understand
what is happening underneath. Both write to the same database.

Before either works, the one-time setup in `SETUP.md` must be done:
run the schema, create the admin user, and add the two keys.

---

## Option A — the easy way: the website Admin panel (recommended)

1. Go to your site and add `/admin` to the address, for example
   `https://yoursite.com/en/admin` (or `/fa/admin`).
2. Sign in with the admin email and password you created in Supabase.
3. **Classes** tab → **New class**. Fill the form:
   - Title and description in English and Persian.
   - Type: Online or In person, private.
   - Price, currency, capacity.
   - Image: choose a photo (it uploads to Supabase Storage automatically).
   - Leave **Active** checked so it shows on the site.
   - Save.
4. **Events** tab → **New event**, same idea, plus date and location.
5. The new class or event appears on the public Classes / Events page right
   away. Untick **Active** to hide something without deleting it.

That is the whole workflow. You never need to touch SQL.

---

## Option B — directly in your Supabase account (Table Editor, no code)

Use this if you want to add rows from the Supabase dashboard itself.

### Add a class

1. Open your project at supabase.com → left sidebar → **Table Editor**.
2. Choose the **classes** table.
3. Click **Insert** → **Insert row**.
4. Fill the columns:
   - `title_en`, `title_fa` — the title in each language.
   - `description_en`, `description_fa` — the description in each language.
   - `type` — type exactly `online` or `in_person`.
   - `price` — a number, e.g. `150` (or leave empty).
   - `currency` — e.g. `TRY`.
   - `capacity` — a number, e.g. `12` (or leave empty).
   - `image_url` — leave empty for now (see "Adding an image" below).
   - `active` — set to `true` so it shows on the site.
   - `id` and `created_at` fill in automatically. Leave them.
5. Click **Save**. Refresh the Classes page on your site to see it.

### Add an event

Same steps, but pick the **events** table. Columns:
`title_en`, `title_fa`, `description_en`, `description_fa`,
`event_date` (a date like `2026-09-20`), `location_en`, `location_fa`,
`image_url` (optional), and `active` = `true`.

### Adding an image in Supabase

1. Left sidebar → **Storage** → open the **media** bucket
   (created by the schema).
2. **Upload file** and pick your photo.
3. Click the uploaded file → **Get URL** (the public URL).
4. Copy that URL and paste it into the `image_url` column of your class or
   event row.

If `image_url` is empty, the site shows a clean branded placeholder instead of
a broken image, so it is always safe to leave blank.

---

## Where registrations and messages go

- When a visitor registers for a class, a row appears in the **registrations**
  table with status `pending`. Review it in the Admin panel under
  **Registrations** and mark it **Confirm** or **Cancel** after the bank
  transfer arrives. You can also see these in the Supabase Table Editor.
- Contact form messages land in **contact_messages** and in the Admin panel
  under **Messages**.

## Setting the IBAN for payments

Admin panel → **Settings** → enter the IBAN, account holder, and currency.
That is what visitors see on the registration confirmation screen.
