import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { YouTubeIcon, PlayIcon } from '@/components/ui/Icons';
import { BrickMark } from '@/components/ui/Wordmark';

interface Video {
  id: string;
  title: string;
}

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? 'UC9MKFDzcbctBeyrwE0zZDsw';
const CHANNEL_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ||
  (CHANNEL_ID ? `https://www.youtube.com/channel/${CHANNEL_ID}` : 'https://www.youtube.com');

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
 * Fetches the latest uploads from a channel's public RSS feed. No API key or
 * token is needed. Returns an empty list (so a "Watch on YouTube" card shows)
 * when no channel is configured or the request fails.
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
      if (id && title) videos.push({ id, title: decode(title.trim()) });
      if (videos.length >= 6) break;
    }
    return videos;
  } catch {
    return [];
  }
}

export async function YouTubeFeed() {
  const t = await getTranslations('Home');
  const videos = await fetchVideos();

  return (
    <section className="shell py-20 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading title={t('youtubeTitle')} intro={t('youtubeIntro')} />
        <ButtonLink href={CHANNEL_URL} variant="ghost" withArrow className="!text-bone">
          {t('youtubeCta')}
        </ButtonLink>
      </div>

      {videos.length > 0 ? (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <li key={video.id}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer noopener"
                className="group block overflow-hidden rounded-plate bg-plate shadow-snap transition-shadow duration-300 hover:shadow-snap-lg"
              >
                <div className="relative aspect-video bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-ink/30 transition-colors group-hover:bg-ink/45">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-brick text-bone shadow-snap-lg transition-transform duration-300 group-hover:scale-110">
                      <PlayIcon className="h-5 w-5" />
                    </span>
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="line-clamp-2 text-sm font-medium tracking-tightest text-bone">
                    {video.title}
                  </h4>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <WatchCard cta={t('youtubeCta')} />
      )}
    </section>
  );
}

/** Fallback shown when no channel is configured. */
function WatchCard({ cta }: { cta: string }) {
  return (
    <div className="mt-12 overflow-hidden rounded-plate bg-plate shadow-snap">
      <div className="grid gap-8 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
        <div>
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-brick text-bone">
            <YouTubeIcon className="h-6 w-6" />
          </div>
          <p className="prose-body max-w-prose text-bone/70">
            Watch films, music videos, and behind the scenes on YouTube.
          </p>
          <div className="mt-6">
            <ButtonLink href={CHANNEL_URL} withArrow>
              {cta}
            </ButtonLink>
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
