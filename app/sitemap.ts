import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_PAGES, SITE_URL } from '@/lib/site-config';

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * sitemap.xml served from `/sitemap.xml`. Enumerates every locale-prefixed
 * page (9 paths × 2 locales = 18 URLs) and attaches per-locale alternates
 * for hreflang cross-linking.
 *
 * Static `lastModified` is fine here: the project's source content is
 * version-controlled, so the deploy timestamp is the closest meaningful
 * proxy. Update the date below when shipping notable content changes.
 */
const LAST_MODIFIED = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = [];

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

  return entries;
}