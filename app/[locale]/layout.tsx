import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, localeDirection, type Locale } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { PageTransition } from '@/components/motion/PageTransition';
import { SiteBackground } from '@/components/motion/SiteBackground';
import { ChromeGate } from '@/components/sections/ChromeGate';
import { CookieConsent } from '@/components/ui/CookieConsent';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kambizakhbari.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('defaultTitle'),
      template: `%s · ${t('siteName')}`,
    },
    description: t('defaultDescription'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        fa: '/fa',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      url: `/${locale}`,
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: t('ogAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      images: ['/og.jpg'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = localeDirection[locale as Locale];

  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <html lang={locale} dir={dir} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Warm up connections to the hosts that serve images, so thumbnails
            and uploaded photos start downloading sooner. */}
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
      </head>
      <body className="min-h-screen bg-ink antialiased">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-plate focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
          >
            Skip to content
          </a>
          <SiteBackground />
          <ScrollProgress />
          <Header />
          <main id="main">
            <PageTransition>{children}</PageTransition>
          </main>
          <ChromeGate>
            <Footer />
          </ChromeGate>
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
