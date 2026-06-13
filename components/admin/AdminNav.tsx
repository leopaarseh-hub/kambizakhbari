'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { BrickMark } from '@/components/ui/Wordmark';
import { clsx } from '@/lib/clsx';

const items = [
  { href: '/admin', key: 'classes' },
  { href: '/admin/events', key: 'events' },
  { href: '/admin/registrations', key: 'registrations' },
  { href: '/admin/messages', key: 'messages' },
  { href: '/admin/settings', key: 'settings' },
] as const;

export function AdminNav({ email }: { email: string }) {
  const t = useTranslations('Admin');
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-seam bg-ink/85 text-bone backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <BrickMark className="h-6 w-auto text-bone" />
          <span className="font-display text-sm font-semibold tracking-tightest">
            {t('title')}
          </span>
        </div>
        <nav className="flex flex-1 flex-wrap items-center gap-1" aria-label="Admin">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'rounded-full px-3 py-1.5 text-sm transition-colors',
                isActive(item.href)
                  ? 'bg-brick text-bone'
                  : 'text-bone/60 hover:bg-bone/10 hover:text-bone',
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-bone/50 sm:inline" dir="ltr">{email}</span>
          <button
            onClick={signOut}
            className="rounded-full border border-seam px-3 py-1.5 text-sm text-bone transition-colors hover:bg-bone hover:text-ink"
          >
            {t('signOut')}
          </button>
        </div>
      </div>
    </header>
  );
}
