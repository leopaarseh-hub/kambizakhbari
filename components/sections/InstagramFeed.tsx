import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { InstagramIcon } from '@/components/ui/Icons';
import { BrickMark } from '@/components/ui/Wordmark';

interface IgPost {
  id: string;
  caption?: string;
  image: string;
  permalink: string;
}

const HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'kambiz';
const PROFILE_URL = `https://instagram.com/${HANDLE}`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalize(json: any): IgPost[] {
  // Accept the Instagram Graph API shape ({ data: [...] }), a hosted feed
  // service shape ({ posts: [...] }, e.g. Behold), or a bare array.
  const items: any[] = Array.isArray(json)
    ? json
    : json?.data ?? json?.posts ?? [];
  return items
    .map((p) => {
      const isVideo = (p.media_type ?? p.mediaType) === 'VIDEO';
      const image = isVideo
        ? p.thumbnail_url ?? p.thumbnailUrl ?? p.media_url ?? p.mediaUrl
        : p.media_url ?? p.mediaUrl ?? p.thumbnail_url ?? p.thumbnailUrl ?? p.sizes?.medium?.mediaUrl;
      return {
        id: String(p.id ?? p.permalink ?? image ?? Math.random()),
        caption: p.caption ?? p.prunedCaption,
        image,
        permalink: p.permalink ?? PROFILE_URL,
      } as IgPost;
    })
    .filter((p) => Boolean(p.image))
    .slice(0, 6);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Loads the latest Instagram posts. Two sources are supported, in order:
 *  1. INSTAGRAM_FEED_URL: a hosted JSON feed (e.g. Behold.so) — easiest, no
 *     token management.
 *  2. INSTAGRAM_ACCESS_TOKEN: the official Instagram Graph API.
 * Returns an empty list (so a follow card shows) when neither is configured or
 * a request fails, so the page never breaks.
 */
async function fetchPosts(): Promise<IgPost[]> {
  const feedUrl = process.env.INSTAGRAM_FEED_URL;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const url = feedUrl
    ? feedUrl
    : token
      ? `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=6&access_token=${token}`
      : null;
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    return normalize(await res.json());
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
          {posts.map((post) => (
            <li key={post.id}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative block aspect-square overflow-hidden rounded-plate bg-ink shadow-snap"
              >
                {/* External CDN images: a plain img keeps any host working. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.caption?.slice(0, 120) ?? 'Instagram post'}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 text-bone opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                  <InstagramIcon className="h-7 w-7" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <FollowCard cta={t('instagramCta')} />
      )}
    </section>
  );
}

/** Premium fallback shown when no Instagram source is configured. */
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
