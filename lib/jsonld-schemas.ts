/**
 * Schema.org JSON-LD payload factories.
 *
 * Each function returns a plain object that satisfies the relevant
 * Schema.org type. Keep this file free of React / Next imports so it
 * can be reused from server components, route handlers, and the
 * future validation script without dragging in framework code.
 *
 * Important constraints we bake in here:
 *
 * - **No fake ratings.** `SoftwareApplication` is a tempting place
 *   to put `aggregateRating: { ratingValue: 5, reviewCount: 1 }` to
 *   get the star-snippet treatment. Google treats invented ratings
 *   as a manual action. We never include `aggregateRating` until a
 *   real, user-generated rating source exists.
 *
 * - **Per-locale, not per-domain.** Every page renders a JSON-LD
 *   payload in its own locale's language. We do not emit a single
 *   English schema on a Chinese page; the two audiences need
 *   different search-result copy.
 *
 * - **Honest `license`.** temstream ships from `temstream_release`,
 *   a repack of upstream open-source Sunshine (GPLv3) and Moonlight
 *   (GPLv3). We point `license` at the upstream GPL URL, not at a
 *   temstream-specific license that does not exist. If we ever add
 *   proprietary components, this needs to become an `Offer` plus a
 *   per-component license.
 */
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOGO_PATH } from './site-config';

/* ─── Shared types ──────────────────────────────────────────────────────── */

export type Locale = 'zh' | 'en';

export interface Thing {
  '@type': string;
  [key: string]: unknown;
}

/* ─── FAQPage ───────────────────────────────────────────────────────────── */

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Build a `FAQPage` JSON-LD payload. The `mainEntity` array is what
 * Google shows in the "People also ask" / FAQ rich result; each
 * `Question` must have an `acceptedAnswer.text` for the snippet to
 * render.
 */
export function buildFaqPageSchema(
  items: FaqItem[],
  locale: Locale,
  path: string,
  pageTitle: string,
  pageDescription: string,
): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    name: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${locale}${path}`,
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.a,
      },
    })),
  };
}

/* ─── HowTo ─────────────────────────────────────────────────────────────── */

export interface HowToStepInput {
  name: string;
  text: string;
  /** Optional 1-indexed position. Defaults to index + 1. */
  position?: number;
}

/**
 * Build a `HowTo` JSON-LD payload. Each entry in `steps` becomes a
 * `HowToStep` with sequential `position`. `totalTime` follows ISO 8601
 * duration syntax (e.g. `PT5M`); pass an integer number of seconds
 * via `totalSeconds` and we format it for you, or omit if unknown.
 */
export function buildHowToSchema(
  steps: HowToStepInput[],
  locale: Locale,
  path: string,
  name: string,
  description: string,
  totalSeconds?: number,
): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    inLanguage: locale,
    name,
    description,
    url: `${SITE_URL}/${locale}${path}`,
    ...(totalSeconds && totalSeconds > 0
      ? { totalTime: `PT${totalSeconds}S` }
      : {}),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: s.position ?? i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/* ─── SoftwareApplication ───────────────────────────────────────────────── */

export interface SoftwareApplicationInput {
  /** Stable id, used to build the `@id` and to dedupe per-page. */
  id: string;
  /** Localized display name of the application. */
  name: string;
  /** Free-text platform, e.g. "Windows". */
  platform: string;
  /** Version string, e.g. "v0.4". */
  version: string;
  /** Absolute URL to the primary download. */
  downloadUrl: string;
  /**
   * Schema.org `operatingSystem` value. Free text, but conventionally
   * a comma-separated list of OS names, e.g. "Windows 10, Windows 11".
   * Pass a single OS string here; the factory takes care of quoting.
   */
  operatingSystem: string;
  /** Locale-free page path, e.g. `/download`. */
  pagePath: string;
  /** Active locale (used to compute the canonical URL). */
  locale: Locale;
  /**
   * Application category. Defaults to `'MultimediaApplication'`,
   * which is what Schema.org recommends for streaming / media tools.
   * Override only if the upstream project explicitly uses a different
   * category.
   */
  applicationCategory?: string;
}

/**
 * Build a `SoftwareApplication` JSON-LD payload.
 *
 * Intentionally omitted:
 *
 * - `aggregateRating` — no real user rating source yet; emitting
 *   fabricated ratings invites a manual action.
 * - `featureList` — would be fine, but our pages don't list
 *   per-application features consistently across languages, so we
 *   leave the field out to avoid mismatch penalties.
 */
export function buildSoftwareApplicationSchema(
  input: SoftwareApplicationInput,
): Thing {
  const {
    id,
    name,
    platform,
    version,
    downloadUrl,
    operatingSystem,
    pagePath,
    locale,
  } = input;
  const pageUrl = `${SITE_URL}/${locale}${pagePath}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    // A stable `@id` lets future crawlers merge facts about the same
    // app across the WAN and LAN download pages instead of treating
    // them as two unrelated things.
    '@id': `${pageUrl}#${id}`,
    inLanguage: locale,
    name,
    url: pageUrl,
    applicationCategory: input.applicationCategory ?? 'MultimediaApplication',
    operatingSystem: `${operatingSystem} (${platform})`,
    softwareVersion: version,
    downloadUrl,
    // The repack itself does not add a license; the upstream is GPLv3.
    license: 'https://www.gnu.org/licenses/gpl-3.0.html',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

/* ─── Organization ───────────────────────────────────────────────────────── */

/**
 * Build the site-wide `Organization` JSON-LD payload. Mount this from
 * the locale-less root layout so the same entity is published once
 * across every page; Google's knowledge graph builder deduplicates by
 * `url` + `name` so a single canonical payload is enough.
 *
 * Why this is conservative:
 *
 * - We do not include `logo` dimensions. Schema.org docs make
 *   dimensions optional, and supplying wrong ones is a soft quality
 *   signal. The icon is square; if you need width/height later,
 *   re-render the icon at the exact pixel size and add it here.
 * - We do not include `address` / `founder` / `foundingDate` /
 *   `contactPoint`. temstream is an unofficial community project;
 *   we do not have a registered business address to publish. Adding
 *   invented values here is the kind of thing Google's manual
 *   action team flags.
 * - We do not list `sameAs` (social profile URLs) until the project
 *   actually has a GitHub org / Twitter / Bilibili account to point
 *   at. Empty arrays / placeholders are worse than no array.
 */
export function buildOrganizationSchema(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${SITE_LOGO_PATH}`,
    description: SITE_DESCRIPTION,
  };
}

/* ─── WebSite ────────────────────────────────────────────────────────────── */

/**
 * Build a per-locale `WebSite` JSON-LD payload. This is the schema
 * that powers the "sitelinks search box" rich result in Google.
 *
 * `SearchAction` is intentionally omitted: temstream has no on-site
 * search engine, so pointing `potentialAction.target` at a
 * non-existent search template would either 404 the user or — worse
 * — let Google index a search-results page that we never render.
 * When/if we add a search route, re-introduce `potentialAction` with
 * a real URL template like `/<locale>/search?q={search_term_string}`.
 *
 * `@id` uses the locale-specific root so that the Chinese and
 * English WebSite payloads are treated as separate entities by the
 * knowledge graph; this is what Google's documentation recommends
 * for multi-locale sites.
 */
export function buildWebSiteSchema(locale: Locale): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/${locale}#website`,
    inLanguage: locale,
    name: locale === 'zh' ? 'temstream · Moonlight + Sunshine 中文指南' : `${SITE_NAME} · Moonlight + Sunshine guide`,
    url: `${SITE_URL}/${locale}`,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}#organization` },
  };
}

/* ─── BreadcrumbList ──────────────────────────────────────────────────────── */

export interface BreadcrumbInput {
  /**
   * Locale-free path under the site root, e.g. `/wan` or `/download`.
   * Pass the empty string `''` for the locale root (the home page).
   */
  path: string;
  /**
   * Localized display name for the crumb. Use the same text shown
   * in the visible breadcrumb UI so visible-vs-schema mismatches
   * never happen.
   */
  name: string;
}

/**
 * Build a `BreadcrumbList` JSON-LD payload. Each input becomes one
 * `ListItem` with sequential `position` (1-indexed, mandatory).
 *
 * Convention used by this site:
 *   - Crumb 1: locale root ("首页" / "Home")
 *   - Crumb 2: section root ("广域网" / "WAN" or "局域网" / "LAN")
 *   - Crumb 3: leaf page ("下载" / "Download", etc.)
 *
 * The `item` URL is resolved against `SITE_URL` so the breadcrumb
 * points at a canonical absolute URL even on the Vercel preview
 * domain.
 */
export function buildBreadcrumbListSchema(
  items: BreadcrumbInput[],
  locale: Locale,
): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: locale,
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      // `item` (not `url`) is the Schema.org-recognised property for
      // the breadcrumb target URL; the validator (Google's Rich
      // Results Test) flags `ListItem` nodes that use `url` instead.
      item: `${SITE_URL}/${locale}${c.path}`,
    })),
  };
}
