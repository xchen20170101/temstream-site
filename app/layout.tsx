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
  // Search-engine ownership tokens. Each platform returns a per-site
  // token after the verification step (HTML tag, DNS TXT, or file
  // upload). We read from `NEXT_PUBLIC_*` env vars so the same code
  // path works in local dev (no token → no meta tag) and in
  // production (token present → meta tag emitted).
  //
  // To activate: set the relevant env var in Vercel
  // (Project → Settings → Environment Variables) and redeploy.
  //
  //   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → Google Search Console
  //   - `NEXT_PUBLIC_BAIDU_SITE_VERIFICATION` → 百度搜索资源平台
  //   - `NEXT_PUBLIC_BING_SITE_VERIFICATION`  → Bing Webmaster Tools
  //   - `NEXT_PUBLIC_YANDEX_VERIFICATION`     → Yandex Webmaster
  //
  // Both Baidu and Bing are set under `other` because Next.js's
  // `MetadataVerification` type only ships typed keys for `google`,
  // `yahoo`, `yandex`, and `me`. `other` still renders the
  // `<meta name="<key>-site-verification" content="…">` tag that
  // each platform's verification tool expects.
  verification: (() => {
    const out: NonNullable<Metadata['verification']> = {};
    const g = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
    const b = process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION;
    const bi = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
    const y = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
    if (g) out.google = g;
    if (y) out.yandex = y;
    const other: Record<string, string> = {};
    if (b) other['baidu-site-verification'] = b;
    if (bi) other['msvalidate.01'] = bi;
    if (Object.keys(other).length > 0) out.other = other;
    return Object.keys(out).length > 0 ? out : undefined;
  })(),
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
//
// The global `Organization` JSON-LD is mounted in the locale layout's
// <body> instead of here. A previous version of this layout returned
//
//     <>
//       {children}
//       <JsonLd data={buildOrganizationSchema()} ... />
//     </>
//
// which on the client expanded to a fragment with two top-level children
// — the locale's `<html>` and a sibling `<script>` — and the browser
// rejected the second one with `HierarchyRequestError: Only one element
// on document allowed`. Co-locating both JSON-LD payloads in the locale
// body keeps every page's `<head>` / `<body> /<script>` structure
// valid. Google's knowledge-graph builder deduplicates by `url` + `name`,
// so a single canonical payload per locale is enough — we don't need
// to re-render it per page.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}