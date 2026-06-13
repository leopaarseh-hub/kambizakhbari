import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { InstagramIcon, MailIcon } from '@/components/ui/Icons';
import { BrickMark } from '@/components/ui/Wordmark';
import { StudSeam } from '@/components/ui/Stud';
import { LegoScene } from '@/components/motion/LegoScene';

const navItems = [
  { href: '/about', key: 'about' },
  { href: '/work', key: 'work' },
  { href: '/classes', key: 'classes' },
  { href: '/events', key: 'events' },
  { href: '/contact', key: 'contact' },
] as const;

const INSTAGRAM_URL = 'https://instagram.com/kambiz';
const EMAIL = 'Info@kambizakhbari.com';

export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const tMeta = useTranslations('Meta');
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-seam bg-ink text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/3 opacity-80 md:block"
      >
        <LegoScene variant="ambient" />
      </div>
      <div className="shell relative z-10 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrickMark className="h-8 w-auto text-bone" />
              <span className="font-display text-xl font-semibold tracking-tightest">
                {tMeta('siteName')}
              </span>
            </div>
            <p className="prose-body measure mt-4 text-bone/70">{t('tagline')}</p>
          </div>

          <nav aria-label={t('navTitle')}>
            <h3 className="text-sm font-semibold text-bone/50">{t('navTitle')}</h3>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-bone/80 transition-colors hover:text-bone"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-bone/50">{t('connectTitle')}</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-3 text-bone/80 transition-colors hover:text-bone"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-bone/20 transition-colors group-hover:border-brick group-hover:text-brick">
                    <InstagramIcon className="h-5 w-5" />
                  </span>
                  {t('instagram')}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center gap-3 text-bone/80 transition-colors hover:text-bone"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-bone/20 transition-colors group-hover:border-brick group-hover:text-brick">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <StudSeam className="my-10 opacity-70" />

        <div className="flex flex-col items-center justify-between gap-3 text-sm text-bone/50 sm:flex-row">
          <p>
            © {year} {tMeta('siteName')}. {t('rights')}
          </p>
          <p>{t('builtIn')}</p>
        </div>
      </div>
    </footer>
  );
}
