/**
 * Site-wide constants for SEO / sitemap / canonical URLs.
 *
 * `SITE_URL` is read from the build-time environment variable
 * `NEXT_PUBLIC_SITE_URL` so that a custom production domain (e.g.
 * `https://temstream.cloud`) can override the Vercel preview domain without
 * code changes. Falls back to the custom production domain if unset.
 *
 * The fallback is intentionally `https://temstream.cloud` rather than the
 * Vercel preview domain: temstream-site.vercel.app is not reachable from
 * mainland China (Baidu/Bing-CN crawlers get timeouts and visitors get
 * blocked), so sitemap + OG + hreflang must point at the China-friendly
 * domain by default.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  'https://temstream.cloud';

/**
 * Locale-free pathname for every page that should appear in `sitemap.xml`
 * and in the `hreflang` map. The empty string `''` represents the locale
 * root, i.e. the home page.
 *
 * IMPORTANT: keep this list in sync with the routes under `app/[locale]/`.
 * Each entry corresponds to one URL per locale.
 */
export const SITE_PAGES = [
  '', // home
  '/wan',
  '/download',
  '/tutorial',
  '/faq',
  '/lan',
  '/lan-download',
  '/lan-tutorial',
  '/lan-faq',
] as const;

export type SitePath = (typeof SITE_PAGES)[number];