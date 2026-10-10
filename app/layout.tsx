import type { Metadata } from 'next';
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
  title: {
    // No `template` here on purpose: every page sets an absolute `title`
    // via `generateMetadata`, so the template would only duplicate
    // "· temstream" at the end of every page title.
    default: 'temstream · Moonlight + Sunshine 中文指南',
  },
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'temstream · Moonlight + Sunshine 中文指南',
    description:
      '开源、低延迟、自托管的游戏串流方案。Windows / Android 客户端 + Windows 服务端一键下载。',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon',
  },
};

// Root layout is intentionally empty: the [locale]/layout.tsx renders the
// <html> and <body> per locale (required pattern for next-intl + static
// export).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}