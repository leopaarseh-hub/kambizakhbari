import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { InstagramIcon } from '@/components/ui/Icons';
import { BrickMark } from '@/components/ui/Wordmark';

interface IgPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
}

const HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'kambiz';
const PROFILE_URL = `https://instagram.com/${HANDLE}`;

/**
 * Fetches the latest Instagram posts using a long-lived access token. Returns
 * an empty list (so the section falls back to a follow card) whenever the token
 * is missing or the request fails, so the page never breaks.
 */
async function fetchPosts(): Promise<IgPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=6&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: IgPost[] };
    return (json.data ?? []).filter((p) => p.media_url || p.thumbnail_url).slice(0, 6);
  } catch {
    return [];
  }
}

export async function InstagramFeed() {
  const t = await getTranslations('Home');
  const posts = await fetchPosts();

  return (
    <section className="shell py-20 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading title={t('instagramTitle')} intro={t('instagramIntro')} />
        <ButtonLink href={PROFILE_URL} variant="ghost" withArrow className="!text-bone">
          {t('instagramCta')}
        </ButtonLink>
      </div>

      {posts.length > 0 ? (
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {posts.map((post) => {
            const src =
              post.media_type === 'VIDEO' ? post.thumbnail_url ?? post.media_url : post.media_url;
            return (
              <li key={post.id}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group relative block aspect-square overflow-hidden rounded-plate bg-ink shadow-snap"
                >
                  <Image
                    src={src}
                    alt={post.caption?.slice(0, 120) ?? 'Instagram post'}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-ink/0 text-bone opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                    <InstagramIcon className="h-7 w-7" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <FollowCard cta={t('instagramCta')} />
      )}
    </section>
  );
}

/** Premium fallback shown when no Instagram token is configured. */
function FollowCard({ cta }: { cta: string }) {
  return (
    <div className="mt-12 overflow-hidden rounded-plate bg-plate shadow-snap">
      <div className="grid gap-8 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
        <div>
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-brick text-bone">
            <InstagramIcon className="h-6 w-6" />
          </div>
          <p className="font-display text-2xl font-semibold tracking-tightest text-bone" dir="ltr">
            @{HANDLE}
          </p>
          <p className="prose-body mt-2 max-w-prose text-bone/70">
            See the latest work and behind the scenes on Instagram.
          </p>
          <div className="mt-6">
            <ButtonLink href={PROFILE_URL} withArrow>
              {cta}
            </ButtonLink>
          </div>
        </div>
        {/* a quiet row of brick-plate tiles for texture */}
        <div className="hidden grid-cols-3 gap-2 sm:grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="grid h-16 w-16 place-items-center rounded-[10px] bg-ink/60"
            >
              <BrickMark className="h-5 w-auto text-bone/20" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
