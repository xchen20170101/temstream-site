/**
 * Server-renderable `<JsonLd>` component for embedding Schema.org
 * JSON-LD into a page.
 *
 * Why this is its own component:
 *
 * 1. **XSS hardening.** Naively `JSON.stringify`'ing a payload and
 *    dropping it into a `<script>` lets any string containing
 *    `</script>` terminate the script element and inject markup. We
 *    escape every `<` to `<\u003c` per Google's published guidance so
 *    that even an attacker-controlled translation string cannot break
 *    out of the JSON-LD block.
 *
 * 2. **Single source of truth.** All Schema.org payloads on the site
 *    go through this component, so we have one place to swap in a
 *    different serializer (e.g. canonical JSON) later.
 *
 * 3. **Server-component friendly.** Renders inside any RSC tree; no
 *    client-side hydration, no runtime cost beyond rendering.
 *
 * Usage:
 *   import { JsonLd } from '@/lib/jsonld';
 *   import { buildFaqPageSchema } from '@/lib/jsonld-schemas';
 *
 *   <JsonLd data={buildFaqPageSchema(items, locale, path, title, desc)} id="faq-schema" />
 */
import type { Thing } from './jsonld-schemas';

export interface JsonLdProps {
  /**
   * A Schema.org thing, or an array of things (rendered as a single
   * `@graph` payload). Arrays are useful when one page exposes more
   * than one top-level entity, e.g. multiple `SoftwareApplication`
   * entries on the download page.
   */
  data: Thing | Thing[];
  /**
   * Optional `id` on the script element. Handy for DOM inspection and
   * for ad-hoc Rich Results Test queries.
   */
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  const json = serialize(data);
  return (
    <script
      type="application/ld+json"
      id={id}
      // `serialize` already strips `</` sequences, so this is safe
      // even when translation strings contain HTML-like content.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

/**
 * Serialize one or many Schema.org things into a safe JSON-LD string.
 *
 * - `<` → `\u003c` prevents an attacker-controlled string from
 *   closing the `<script>` element early. This is the same trick
 *   Next.js itself uses in its built-in JSON-LD helpers.
 * - Compact (no whitespace) output keeps the script block small and
 *   avoids any chance of HTML normalization trimming significant
 *   characters in the middle of a string.
 * - Arrays are wrapped in `@graph` so search engines see a single
 *   top-level node, which is the only shape Google documents for
 *   multi-entity pages.
 */
function serialize(payload: Thing | Thing[]): string {
  const body = Array.isArray(payload) ? { '@graph': payload } : payload;
  return JSON.stringify(body).replace(/</g, '\\u003c');
}
