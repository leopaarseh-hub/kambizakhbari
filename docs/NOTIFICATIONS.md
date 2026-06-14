# Get notified of new registrations and messages

When someone registers or sends a contact message, Supabase fires a webhook to
`/api/notify` on your site, which sends you a **Telegram message** and/or an
**email**. Pick Telegram (easiest, instant on your phone), email, or both.

## A. Telegram (recommended, ~5 minutes, free)

1. In Telegram, open **@BotFather** → send `/newbot` → follow the prompts →
   copy the **bot token** (looks like `123456:ABC-...`).
2. Open a chat with your new bot and tap **Start** (so it can message you).
3. Open **@userinfobot** in Telegram → it replies with your numeric **chat id**.
4. In **Vercel → Settings → Environment Variables**, add:
   - `TELEGRAM_BOT_TOKEN` = the bot token
   - `TELEGRAM_CHAT_ID` = your chat id
   - `NOTIFY_WEBHOOK_SECRET` = any long random string (you choose it)
5. Redeploy.

To notify more than one person (e.g. you and Kambiz), create a Telegram group,
add the bot to it, and use the group's chat id.

## B. Email via Resend (optional)

1. Create a free account at **resend.com**, create an **API key**.
2. In Vercel add:
   - `RESEND_API_KEY` = the key
   - `NOTIFY_EMAIL` = where to send alerts (e.g. Info@kambizakhbari.com)
   - `NOTIFY_WEBHOOK_SECRET` = the same secret as above
   - (optional) `NOTIFY_FROM` once you verify a domain in Resend; otherwise the
     default test sender is used.
3. Redeploy.

## C. Wire the Supabase webhook (required for both)

In the Supabase dashboard:

1. **Database → Webhooks → Create a new hook**.
2. Name it `notify-registrations`.
   - Table: **registrations**, Events: **Insert**.
   - Type: **HTTP Request**, Method: **POST**.
   - URL: `https://YOUR-SITE.vercel.app/api/notify`
   - HTTP Headers: add `x-notify-secret` = the same value as
     `NOTIFY_WEBHOOK_SECRET`.
   - Save.
3. Repeat for a second hook `notify-messages` on table **contact_messages**
   (Insert), same URL and header.

That's it. New registrations and messages now ping you within seconds, and they
still appear in the admin panel as before.

## Test it

Submit a test contact message on the site (or register for a class). You should
get a Telegram/email alert within a few seconds. If not, check that the env vars
are set in Vercel, the site was redeployed, and the webhook header matches
`NOTIFY_WEBHOOK_SECRET` exactly.
