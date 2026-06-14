'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { clsx } from '@/lib/clsx';
import { CloseIcon, MenuIcon, GlobeIcon } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';

const navItems = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/work', key: 'work' },
  { href: '/classes', key: 'classes' },
  { href: '/events', key: 'events' },
  { href: '/contact', key: 'contact' },
] as const;

const languages: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fa', label: 'فارسی' },
];

/**
 * Globe button that opens a small panel to choose the language. Both locales
 * are listed, the active one marked. An invisible full-screen backdrop closes
 * the panel on any outside click.
 */
function LocaleSwitch() {
  const t = useTranslations('Nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('languageLabel')}
        aria-haspopup="menu"
        aria-expanded={open}
        className={clsx(
          'grid h-10 w-10 place-items-center rounded-full border transition-colors',
          open
            ? 'border-bone bg-bone text-ink'
            : 'border-seam text-bone hover:border-bone',
        )}
      >
        <GlobeIcon className="h-5 w-5" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="absolute end-0 z-50 mt-2 w-40 overflow-hidden rounded-[12px] border border-seam bg-plate p-1 shadow-snap-lg"
          >
            {languages.map((lang) => {
              const active = lang.code === locale;
              return (
                <Link
                  key={lang.code}
                  href={pathname}
                  locale={lang.code}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'flex items-center justify-between rounded-[8px] px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-bone/10 text-bone'
                      : 'text-bone/70 hover:bg-bone/10 hover:text-bone',
                  )}
                >
                  <span dir={lang.code === 'fa' ? 'rtl' : 'ltr'}>{lang.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-brick" />}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function Header() {
  const t = useTranslations('Nav');
  const tMeta = useTranslations('Meta');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // The admin panel carries its own chrome, so the public header steps aside.
  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-seam/70 bg-ink/95">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Kambiz Akhbari">
          <Wordmark className="h-7 w-auto text-bone" name={tMeta('siteName')} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={clsx(
                'relative rounded-full px-3.5 py-2 text-sm transition-colors',
                isActive(item.href)
                  ? 'text-bone'
                  : 'text-bone/60 hover:text-bone',
              )}
            >
              {isActive(item.href) && (
                <span className="absolute start-3 bottom-1 h-1 w-1 rounded-full bg-brick" />
              )}
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t('close') : t('menu')}
            className="grid h-10 w-10 place-items-center rounded-full border border-seam text-bone md:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden border-t border-seam/70 bg-ink md:hidden"
          >
            <ul className="shell flex flex-col py-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 rounded-[10px] px-3 py-3 text-base',
                      isActive(item.href)
                        ? 'bg-bone/10 text-bone'
                        : 'text-bone/70',
                    )}
                  >
                    <span
                      className={clsx(
                        'h-2 w-2 rounded-full',
                        isActive(item.href) ? 'bg-brick' : 'bg-graphite/40',
                      )}
                    />
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
