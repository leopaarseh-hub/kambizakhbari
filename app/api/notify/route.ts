import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Receives a Supabase Database Webhook on INSERT into `registrations` or
 * `contact_messages` and sends a notification to Telegram and/or email.
 *
 * Security: if NOTIFY_WEBHOOK_SECRET is set, the request must include a matching
 * `x-notify-secret` header (configured as a custom header on the Supabase
 * webhook), so the endpoint cannot be triggered by random callers.
 *
 * Channels (configure whichever you want; both work together):
 *  - Telegram: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
 *  - Email (Resend): RESEND_API_KEY + NOTIFY_EMAIL (+ optional NOTIFY_FROM)
 */
export async function POST(req: NextRequest) {
  const secret = process.env.NOTIFY_WEBHOOK_SECRET;
  if (secret && req.headers.get('x-notify-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const table: string = body?.table ?? 'unknown';
  const record: Record<string, any> = body?.record ?? body ?? {};
  const { subject, lines } = format(table, record);
  const text = `${subject}\n${lines.join('\n')}`;

  await Promise.allSettled([sendTelegram(text), sendEmail(subject, lines)]);

  return NextResponse.json({ ok: true });
}

function format(table: string, r: Record<string, any>): { subject: string; lines: string[] } {
  if (table === 'registrations') {
    return {
      subject: '🎟️ New registration',
      lines: [
        `Name: ${r.full_name ?? '-'}`,
        `Email: ${r.email ?? '-'}`,
        `Phone: ${r.phone ?? '-'}`,
        `Instagram: ${r.instagram ?? '-'}`,
        `Country: ${r.country ?? '-'}`,
        `For: ${r.event_id ? 'event' : r.class_id ? 'class' : '-'}`,
        `Format: ${r.preferred_type ?? '-'}`,
        r.message ? `Message: ${r.message}` : '',
      ].filter(Boolean),
    };
  }
  if (table === 'contact_messages') {
    return {
      subject: '✉️ New contact message',
      lines: [
        `Name: ${r.name ?? '-'}`,
        `Email: ${r.email ?? '-'}`,
        `Message: ${r.message ?? '-'}`,
      ],
    };
  }
  return { subject: `🔔 New ${table} entry`, lines: [JSON.stringify(r)] };
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
}

async function sendEmail(subject: string, lines: string[]) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;
  const from = process.env.NOTIFY_FROM || 'Kambiz Akhbari <onboarding@resend.dev>';
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
    <h2 style="margin:0 0 8px">${subject}</h2>
    ${lines.map((l) => `<p style="margin:2px 0">${escapeHtml(l)}</p>`).join('')}
  </div>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
