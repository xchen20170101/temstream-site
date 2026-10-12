import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_PAGES, ZH_ONLY_PAGES, SITE_URL } from '@/lib/site-config';

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * sitemap.xml served from `/sitemap.xml`. Enumerates every locale-prefixed
 * page (9 paths × 2 locales = 18 URLs) and attaches per-locale alternates
 * for hreflang cross-linking.
 *
 * Plus a small set of ZH_ONLY_PAGES (`/box`, `/box-faq`) that only exist
 * under `/zh/` — the corresponding `/en/<path>` 404s by design, so we
 * emit a single zh-only entry without alternates rather than a broken
 * hreflang pair.
 *
 * Static `lastModified` is fine here: the project's source content is
 * version-controlled, so the deploy timestamp is the closest meaningful
 * proxy. Update the date below when shipping notable content changes.
 */
const LAST_MODIFIED = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = [];

  // Bilingual paths: every locale gets an entry, with per-locale
  // alternates so hreflang linking is consistent.
  for (const path of SITE_PAGES) {
    for (const locale of routing.locales) {
      const url = `${SITE_URL}/${locale}${path}`;
      entries.push({
        url,
        lastModified: LAST_MODIFIED,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path === '/wan' || path === '/lan' ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries([
            ...routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`] as const),
            ['x-default', `${SITE_URL}/${routing.defaultLocale}${path}`] as const,
          ]),
        },
      });
    }
  }

  // Zh-only paths: the page itself 404s in `/en`, so the only valid
  // URL is the default-locale one. `alternates.languages` is omitted
  // because emitting an `en` alternate that 404s is worse than no
  // alternate at all.
  for (const path of ZH_ONLY_PAGES) {
    entries.push({
      url: `${SITE_URL}/${routing.defaultLocale}${path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}