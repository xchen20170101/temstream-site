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
import { SITE_URL } from './site-config';

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
