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