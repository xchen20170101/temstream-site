import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';

/**
 * robots.txt served from `/robots.txt`. Allows all well-behaved crawlers,
 * blocks the Next.js build artefacts and any future API routes, and points
 * crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}