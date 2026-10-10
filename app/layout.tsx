import type { Metadata, Viewport } from 'next';
import './globals.css';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site-config';
import { ogLocale } from '@/lib/seo';

/**
 * Root layout only renders `<html>`/`<body>` inside `app/[locale]/layout.tsx`
 * (required by next-intl + static export). The metadata defined here is the
 * site-wide default and is overridden by `generateMetadata` on every page.
 *
 * `metadataBase` is read from `NEXT_PUBLIC_SITE_URL` so that OG images,
 * canonical URLs and hreflang values stay correct when the project is
 * deployed under a custom domain.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Plain string (not the `{ default, template }` form): every page sets an
  // absolute `title` via `generateMetadata`, so a template would only
  // append "· temstream" twice. Next.js 15 also tightened the type so
  // that `{ default }` without `template` no longer type-checks.
  title: 'temstream · Moonlight + Sunshine 中文指南',
  description:
    'temstream 是一个非官方 Moonlight + Sunshine 中文站点，提供 Windows / Android 客户端与 Windows 服务端的下载、教程与常见问题。',
  applicationName: 'temstream',
  keywords: [
    'Moonlight',
    'Sunshine',
    '游戏串流',
    'game streaming',
    '开源串流',
    '远程串流',
    'temstream',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'zh': '/zh',
      'en': '/en',
      'x-default': '/zh',
    },
  },
  openGraph: {
    title: 'temstream · Moonlight + Sunshine 中文指南',
    description:
      '开源、低延迟、自托管的游戏串流方案。Windows / Android 客户端 + Windows 服务端一键下载。',
    type: 'website',
    locale: ogLocale(routing.defaultLocale),
    url: '/',
    siteName: 'temstream',
    // Resolved against `metadataBase` above. The actual file is generated
    // by `app/opengraph-image.tsx`.
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'temstream · Moonlight + Sunshine 中文指南',
    description: '开源、低延迟、自托管的游戏串流方案。Windows / Android 客户端 + Windows 服务端一键下载。',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

/**
 * Site-wide viewport / browser chrome. Exported separately from
 * `metadata` per the Next.js 15 App Router convention so it can be
 * statically hoisted into the `<head>` and so per-page overrides are
 * possible. `themeColor` matches the `--bg-base` token in globals.css
 * so the mobile address bar blends in with the page on dark mode.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06070d',
  colorScheme: 'dark',
};

// Root layout is intentionally empty: the [locale]/layout.tsx renders the
// <html> and <body> per locale (required pattern for next-intl + static
// export).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}