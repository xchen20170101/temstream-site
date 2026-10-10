/**
 * Site-wide constants for SEO / sitemap / canonical URLs.
 *
 * `SITE_URL` is read from the build-time environment variable
 * `NEXT_PUBLIC_SITE_URL` so that a custom production domain (e.g.
 * `https://temstream.app`) can override the Vercel preview domain without
 * code changes. Falls back to the Vercel preview domain if unset.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  'https://temstream-site.vercel.app';

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