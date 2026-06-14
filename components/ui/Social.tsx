import { InstagramIcon, MailIcon, YouTubeIcon } from './Icons';
import { clsx } from '@/lib/clsx';

const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ||
  'https://www.youtube.com/channel/UC9MKFDzcbctBeyrwE0zZDsw';
const INSTAGRAM_URL = 'https://instagram.com/kambiz';
const EMAIL = 'Info@kambizakhbari.com';

interface Social {
  key: string;
  label: string;
  href: string;
  external: boolean;
  brand: string;
  Icon: typeof InstagramIcon;
}

const socials: Social[] = [
  { key: 'instagram', label: 'Instagram', href: INSTAGRAM_URL, external: true, brand: '#E1306C', Icon: InstagramIcon },
  { key: 'youtube', label: 'YouTube', href: YOUTUBE_URL, external: true, brand: '#FF0000', Icon: YouTubeIcon },
  { key: 'email', label: 'Email', href: `mailto:${EMAIL}`, external: false, brand: 'rgb(var(--color-brick))', Icon: MailIcon },
];

/**
 * Premium social icon row. Each is a brick-plate button with a hairline edge;
 * on hover it lifts, fills with the platform's signature colour, and casts a
 * soft brand-tinted glow. Used in the hero and footer.
 */
export function SocialLinks({
  size = 'md',
  className,
}: {
  size?: 'md' | 'lg';
  className?: string;
}) {
  const dim = size === 'lg' ? 'h-12 w-12' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-5 w-5' : 'h-[18px] w-[18px]';

  return (
    <ul className={clsx('flex items-center gap-3', className)}>
      {socials.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            aria-label={s.label}
            {...(s.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
            className={clsx(
              'group relative grid place-items-center overflow-hidden rounded-[14px] border border-bone/15 bg-bone/[0.04] text-bone backdrop-blur transition-all duration-300 ease-snap hover:-translate-y-1',
              dim,
            )}
            style={{ ['--brand' as string]: s.brand }}
          >
            {/* brand fill on hover */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ backgroundColor: 'var(--brand)' }}
            />
            {/* soft brand glow */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: '0 10px 26px -8px var(--brand)' }}
            />
            <s.Icon className={clsx('relative z-10 transition-colors duration-300 group-hover:text-white', icon)} />
          </a>
        </li>
      ))}
    </ul>
  );
}
