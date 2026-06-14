import { getLocale, getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { YouTubeIcon, PlayIcon, ArrowIcon } from '@/components/ui/Icons';
import { BrickMark } from '@/components/ui/Wordmark';
import { formatDate } from '@/lib/format';
import type { Locale } from '@/i18n/routing';

interface Video {
  id: string;
  title: string;
  published: string | null;
  views: number | null;
}

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? 'UC9MKFDzcbctBeyrwE0zZDsw';
const CHANNEL_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ||
  (CHANNEL_ID ? `https://www.youtube.com/channel/${CHANNEL_ID}` : 'https://www.youtube.com');

const YT_RED = '#FF0000';

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

/**
 * Latest uploads from the channel's public RSS feed (title, date, and view
 * count). No API key or token is needed. Returns an empty list (so a "Watch on
 * YouTube" card shows) when no channel is configured or the request fails.
 */
async function fetchVideos(): Promise<Video[]> {
  if (!CHANNEL_ID) return [];
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 1800 } },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    const videos: Video[] = [];
    for (const entry of entries) {
      const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
      if (!id || !title) continue;
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? null;
      const viewsStr = entry.match(/<media:statistics[^>]*views="(\d+)"/)?.[1];
      videos.push({
        id,
        title: decode(title.trim()),
        published,
        views: viewsStr ? Number(viewsStr) : null,
      });
      if (videos.length >= 7) break;
    }
    return videos;
  } catch {
    return [];
  }
}

function formatViews(views: number | null, locale: Locale, label: string): string | null {
  if (views == null) return null;
  const n = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(views);
  return `${n} ${label}`;
}

// hqdefault is the only size guaranteed to exist for every video. In a 16:9
// container with object-cover its 4:3 letterboxing is cropped away cleanly.
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export async function YouTubeFeed() {
  const t = await getTranslations('Home');
  const locale = (await getLocale()) as Locale;
  const videos = await fetchVideos();

  const meta = (v: Video) =>
    [formatDate(v.published, locale), formatViews(v.views, locale, t('youtubeViews'))]
      .filter(Boolean)
      .join('  ·  ');

  const featured = videos[0];
  const rest = videos.slice(1, 7);

  return (
    <section className="shell py-20 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading title={t('youtubeTitle')} intro={t('youtubeIntro')} />
        <YouTubeCta label={t('youtubeCta')} />
      </div>

      {videos.length === 0 ? (
        <WatchCard cta={t('youtubeCta')} />
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Featured latest video */}
          {featured && (
            <a
              href={watchUrl(featured.id)}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative block overflow-hidden rounded-plate bg-ink shadow-snap-lg"
            >
              <div className="relative aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb(featured.id)}
                  alt={featured.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#FF0000] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                  <YouTubeIcon className="h-3.5 w-3.5" />
                  {t('youtubeFeatured')}
                </span>
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-[#FF0000] text-white shadow-snap-lg transition-transform duration-300 group-hover:scale-110">
                    <PlayIcon className="h-7 w-7" />
                  </span>
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="line-clamp-2 text-lg font-semibold tracking-tightest text-bone sm:text-xl">
                  {featured.title}
                </h3>
                {meta(featured) && (
                  <p className="mt-1.5 text-sm text-bone/70">{meta(featured)}</p>
                )}
              </div>
            </a>
          )}

          {/* Recent list */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((video) => (
              <li key={video.id}>
                <a
                  href={watchUrl(video.id)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex gap-3 overflow-hidden rounded-plate bg-plate p-2 shadow-snap transition-shadow duration-300 hover:shadow-snap-lg"
                >
                  <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-[10px] bg-ink sm:w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb(video.id)}
                      alt={video.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-ink/25 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FF0000] text-white">
                        <PlayIcon className="h-4 w-4" />
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 self-center pe-2">
                    <h4 className="line-clamp-2 text-sm font-medium tracking-tightest text-bone">
                      {video.title}
                    </h4>
                    {meta(video) && (
                      <p className="mt-1 text-xs text-bone/55">{meta(video)}</p>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** A real, branded YouTube call-to-action button. */
function YouTubeCta({ label }: { label: string }) {
  return (
    <a
      href={CHANNEL_URL}
      target="_blank"
      rel="noreferrer noopener"
      className="group inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-snap transition-all duration-300 hover:shadow-snap-lg hover:brightness-110"
      style={{ backgroundColor: YT_RED }}
    >
      <YouTubeIcon className="h-5 w-5" />
      <span>{label}</span>
      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </a>
  );
}

/** Fallback shown when no channel is configured or the feed is unavailable. */
function WatchCard({ cta }: { cta: string }) {
  return (
    <div className="mt-12 overflow-hidden rounded-plate bg-plate shadow-snap">
      <div className="grid gap-8 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
        <div>
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[12px] text-white"
            style={{ backgroundColor: YT_RED }}>
            <YouTubeIcon className="h-6 w-6" />
          </div>
          <p className="prose-body max-w-prose text-bone/70">
            Watch films, music videos, and behind the scenes on YouTube.
          </p>
          <div className="mt-6">
            <YouTubeCta label={cta} />
          </div>
        </div>
        <div className="hidden gap-2 sm:flex">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="grid h-16 w-28 place-items-center rounded-[10px] bg-ink/60">
              <BrickMark className="h-5 w-auto text-bone/20" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
