import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from './site-config';

type Locale = (typeof routing.locales)[number];
type OgLocale = 'zh_CN' | 'en_US';

/**
 * Map a site locale (zh/en) to the OpenGraph locale tag (zh_CN / en_US).
 */
export function ogLocale(locale: string): OgLocale {
  return locale === 'zh' ? 'zh_CN' : 'en_US';
}

/**
 * Build the `alternates` block (canonical + hreflang languages + x-default)
 * for a page at `path` (locale-free pathname, e.g. '/wan/download').
 *
 * Returns a value suitable for `metadata.alternates`. Pass an empty string
 * for `path` to refer to the locale root (home page).
 */
export function makeAlternates(locale: string, path: string): NonNullable<Metadata['alternates']> {
  const normalised = path === '' ? '' : path;
  const canonical = `${SITE_URL}/${locale}${normalised}`;

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${normalised}`;
  }
  // x-default points at the site's default-locale version of the same page,
  // which is how Google/Bing pick the canonical when no Accept-Language
  // signal is available.
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${normalised}`;

  return { canonical, languages };
}

/**
 * The full set of `alternates.languages` values for a given page path,
 * shaped as an array (used by the sitemap). Each entry is the locale code
 * (zh/en) + the absolute URL.
 */
export function localeUrlPairs(path: string): { locale: Locale; url: string }[] {
  const normalised = path === '' ? '' : path;
  return routing.locales.map((l) => ({
    locale: l,
    url: `${SITE_URL}/${l}${normalised}`,
  }));
}

/* ─── Breadcrumb label helpers ───────────────────────────────────────────── */

/**
 * Short, stable breadcrumb label for the locale root. Used in the
 * JSON-LD `BreadcrumbList` payload; the same string is reused by
 * every page so visible-vs-schema text never diverges.
 *
 * The visible UI does not currently render a breadcrumb trail; the
 * schema is published ahead of the visual component so Google can
 * start recognising the site hierarchy as soon as possible.
 */
export function homeCrumbLabel(locale: string): string {
  return locale === 'zh' ? '首页' : 'Home';
}

/**
 * Short breadcrumb label for a top-level section. The full `title`
 * field on `wanOverview` / `lanOverview` is sentence-length and reads
 * awkwardly in a breadcrumb (e.g. "广域网串流：出门在外也要玩家里
 * 电脑"); these short labels fit.
 */
export function sectionCrumbLabel(
  locale: string,
  section: 'wan' | 'lan',
): string {
  if (section === 'wan') {
    return locale === 'zh' ? '广域网' : 'WAN';
  }
  return locale === 'zh' ? '局域网' : 'LAN';
}

/**
 * Short breadcrumb label for a leaf page. Mirrors the visible H1
 * title as closely as a breadcrumb can — the i18n `title` field for
 * `tutorial` is "安全又简单：4 步搞定 Sunshine 串流" which is too
 * long, so we keep a deliberately short label here.
 */
export function pageCrumbLabel(
  locale: string,
  key: 'download' | 'tutorial' | 'faq',
): string {
  const map: Record<'zh' | 'en', Record<'download' | 'tutorial' | 'faq', string>> = {
    zh: { download: '下载', tutorial: '教程', faq: '常见问题' },
    en: { download: 'Download', tutorial: 'Tutorial', faq: 'FAQ' },
  };
  return map[locale === 'zh' ? 'zh' : 'en'][key];
}