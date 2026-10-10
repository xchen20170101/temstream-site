import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';

/**
 * robots.txt served from `/robots.txt`.
 *
 * - Global `*` rule: allow all well-behaved crawlers, block the Next.js
 *   build artefacts and any future API routes.
 * - Explicit per-engine rules for the four Chinese search engines
 *   (Baidu / Sogou / 360 / Shenma). They inherit the same `disallow`
 *   list as the global rule but are listed individually so that
 *   site-owner tools (Baidu Zhanzhang, Sogou Webmaster, etc.) can show
 *   that we are intentionally allowing them, and so that future
 *   per-engine tweaks (e.g. a stricter crawl-delay) are easy to add
 *   without rewriting the wildcard rule.
 * - `Sitemap` is read by every major crawler and takes priority over
 *   any sitemap declared inside the global rules block.
 * - `Host` is the canonical production domain. We default to
 *   `temstream.cloud` because `temstream-site.vercel.app` is not
 *   reachable from mainland China.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/_next/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Sogou Pic Spider',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Sogou web spider',
        allow: '/',
        disallow,
      },
      {
        userAgent: '360Spider',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'HaosouSpider',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'YisouSpider',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}