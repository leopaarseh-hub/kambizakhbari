import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kambizakhbari.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin panel is not for indexing.
      disallow: ['/en/admin', '/fa/admin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
