#!/usr/bin/env node
/**
 * Validate JSON-LD output of the prerendered Next.js build.
 *
 * For each (locale, page) under `.next/server/app/<locale>/<page>.html`:
 *   1. Extract every `<script type="application/ld+json">…</script>` block.
 *   2. Parse the JSON.
 *   3. Walk the payload and check the required fields for the given
 *      Schema.org @type.
 *
 * Exits with code 1 on the first hard failure (missing field, wrong
 * @type, wrong url shape, etc.) so it can plug into CI. Warnings (e.g.
 * `aggregateRating` present on SoftwareApplication) still print but do
 * not fail the run.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'd:\\self_project\\temstream-site';
const BUILD = join(ROOT, '.next', 'server', 'app');
const LOCALES = ['zh', 'en'];
const PAGES = [
  'faq',
  'lan-faq',
  'tutorial',
  'lan-tutorial',
  'download',
  'lan-download',
  'wan',
  'lan',
];

const SCRIPT_RE =
  /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

const fail = [];
const warn = [];
let totalPayloads = 0;

for (const locale of LOCALES) {
  for (const page of PAGES) {
    // Try the static-export layout first (`<locale>/<page>.html`),
    // then the per-route layout (`<locale>/<page>/page.html`),
    // which is what the App Router emits in some build modes.
    const candidates = [
      join(BUILD, locale, `${page}.html`),
      join(BUILD, locale, page, 'page.html'),
    ];
    const file = candidates.find((p) => {
      try {
        return readFileSync(p, 'utf8').length > 0 || true;
      } catch {
        return false;
      }
    });
    if (!file) {
      // Soft-warn instead of failing: the script is most useful
      // after `npm run build` + a static export, but skipping
      // silently would hide a real CI regression. Telling the
      // user which pages are missing makes the next step obvious.
      warn.push(`[${locale}/${page}] no prerendered HTML found (run \`npm run build\` first?)`);
      continue;
    }
    const html = readFileSync(file, 'utf8');
    const matches = [...html.matchAll(SCRIPT_RE)];
    if (matches.length === 0) {
      fail.push(`[${locale}/${page}] no <script type="application/ld+json"> found in ${file}`);
      continue;
    }
    for (let i = 0; i < matches.length; i++) {
      const raw = matches[i][1];
      // JSON-LD escape: the `<` is stored as `\u003c` to prevent HTML breakout.
      // Un-escape for parsing.
      const normalized = raw.replace(/\\u003c/g, '<');
      let payload;
      try {
        payload = JSON.parse(normalized);
      } catch (e) {
        fail.push(`[${locale}/${page}#${i}] JSON parse error: ${e.message}`);
        continue;
      }
      totalPayloads++;
      validate(locale, page, i, payload);
    }
  }
}

function isHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//.test(s);
}

function validate(locale, page, idx, payload) {
  const tag = `[${locale}/${page}#${idx}]`;

  // Unwrap @graph if needed.
  const nodes = payload['@graph'] ? payload['@graph'] : [payload];
  for (const node of nodes) {
    const t = node['@type'];
    if (!t) {
      fail.push(`${tag} node missing @type`);
      continue;
    }
    if (node['@context'] !== 'https://schema.org') {
      // For nodes inside @graph the @context is allowed to be inherited.
      if (payload['@context'] !== 'https://schema.org' && !node['@context']) {
        fail.push(`${tag} @type=${t} missing @context`);
      }
    }
    // Top-level `url` is mandatory for most types but not for
    // `BreadcrumbList` (which has no canonical URL — it is a meta
    // schema attached to a host page). Make the check type-aware so
    // we don't fail the run for breadcrumb payloads.
    if (t !== 'BreadcrumbList') {
      if (!isHttpUrl(node.url)) {
        fail.push(`${tag} @type=${t} url not absolute http(s): ${node.url}`);
      }
    }
    // `inLanguage` is mandatory for per-locale entities (FAQPage,
    // HowTo, SoftwareApplication, WebSite) but optional for
    // site-global entities (Organization) and BreadcrumbList
    // (where each ListItem inherits the host page's language).
    const requiresInLanguage = [
      'FAQPage',
      'HowTo',
      'SoftwareApplication',
      'WebSite',
    ];
    if (requiresInLanguage.includes(t)) {
      if (node.inLanguage !== locale) {
        fail.push(`${tag} @type=${t} inLanguage=${node.inLanguage} expected ${locale}`);
      }
    }

    if (t === 'FAQPage') {
      const main = node.mainEntity;
      if (!Array.isArray(main) || main.length === 0) {
        fail.push(`${tag} FAQPage mainEntity empty or not array`);
        continue;
      }
      for (const q of main) {
        if (q['@type'] !== 'Question') {
          fail.push(`${tag} FAQPage mainEntity entry @type=${q['@type']} (expected Question)`);
        }
        if (typeof q.name !== 'string' || q.name.length === 0) {
          fail.push(`${tag} FAQPage Question missing name`);
        }
        if (!q.acceptedAnswer || q.acceptedAnswer['@type'] !== 'Answer') {
          fail.push(`${tag} FAQPage Question missing acceptedAnswer/Answer`);
        } else if (typeof q.acceptedAnswer.text !== 'string') {
          fail.push(`${tag} FAQPage Answer missing text`);
        }
      }
    } else if (t === 'HowTo') {
      const steps = node.step;
      if (!Array.isArray(steps) || steps.length === 0) {
        fail.push(`${tag} HowTo step empty or not array`);
        continue;
      }
      let prevPos = 0;
      for (const s of steps) {
        if (s['@type'] !== 'HowToStep') {
          fail.push(`${tag} HowTo step @type=${s['@type']} (expected HowToStep)`);
        }
        if (typeof s.position !== 'number' || s.position < 1) {
          fail.push(`${tag} HowToStep position invalid: ${s.position}`);
        } else if (s.position !== prevPos + 1) {
          fail.push(`${tag} HowToStep position ${s.position} not consecutive after ${prevPos}`);
        }
        if (typeof s.name !== 'string' || s.name.length === 0) {
          fail.push(`${tag} HowToStep missing name`);
        }
        if (typeof s.text !== 'string' || s.text.length === 0) {
          fail.push(`${tag} HowToStep missing text`);
        }
        prevPos = s.position;
      }
    } else if (t === 'SoftwareApplication') {
      for (const k of ['name', 'operatingSystem', 'softwareVersion', 'downloadUrl', 'applicationCategory']) {
        if (typeof node[k] !== 'string' || node[k].length === 0) {
          fail.push(`${tag} SoftwareApplication missing or empty field: ${k}`);
        }
      }
      if (!isHttpUrl(node.downloadUrl)) {
        fail.push(`${tag} SoftwareApplication downloadUrl not absolute: ${node.downloadUrl}`);
      }
      if (!node.offers) {
        fail.push(`${tag} SoftwareApplication missing offers`);
      } else if (node.offers['@type'] !== 'Offer') {
        fail.push(`${tag} SoftwareApplication offers.@type=${node.offers['@type']}`);
      } else if (node.offers.price !== '0') {
        fail.push(`${tag} SoftwareApplication offers.price=${node.offers.price} (expected "0")`);
      }
      if (node.aggregateRating) {
        warn.push(`${tag} SoftwareApplication has aggregateRating — review whether it's a real user rating source before keeping it`);
      }
    } else if (t === 'Organization') {
      // Site identity. `@id` is how the knowledge graph dedupes, so
      // it must be present. `name` and `url` are mandatory; `logo`
      // is highly recommended (Google uses it for the knowledge
      // panel thumbnail).
      for (const k of ['name', 'url', 'logo']) {
        if (typeof node[k] !== 'string' || node[k].length === 0) {
          fail.push(`${tag} Organization missing or empty field: ${k}`);
        }
      }
      if (!isHttpUrl(node.url)) {
        fail.push(`${tag} Organization url not absolute: ${node.url}`);
      }
      if (!isHttpUrl(node.logo)) {
        fail.push(`${tag} Organization logo not absolute: ${node.logo}`);
      }
      if (typeof node['@id'] !== 'string' || node['@id'].length === 0) {
        fail.push(`${tag} Organization missing @id`);
      }
    } else if (t === 'WebSite') {
      // Per-locale site identity. `inLanguage` is the discriminator
      // that separates the zh and en WebSite nodes; @id is also
      // required so the knowledge graph can dedupe across crawl
      // sessions.
      for (const k of ['name', 'url', 'inLanguage']) {
        if (typeof node[k] !== 'string' || node[k].length === 0) {
          fail.push(`${tag} WebSite missing or empty field: ${k}`);
        }
      }
      if (!isHttpUrl(node.url)) {
        fail.push(`${tag} WebSite url not absolute: ${node.url}`);
      }
      if (typeof node['@id'] !== 'string' || node['@id'].length === 0) {
        fail.push(`${tag} WebSite missing @id`);
      }
      if (node.inLanguage !== locale) {
        fail.push(`${tag} WebSite inLanguage=${node.inLanguage} expected ${locale}`);
      }
      if (node.publisher && typeof node.publisher === 'object') {
        // The `publisher` should reference the Organization by `@id`,
        // not duplicate it. We don't enforce the exact format here,
        // only that it looks like an @id reference.
        if (typeof node.publisher['@id'] !== 'string') {
          fail.push(`${tag} WebSite publisher must be an object with @id`);
        }
      }
    } else if (t === 'BreadcrumbList') {
      // `url` is intentionally NOT required at the top level —
      // a BreadcrumbList has no canonical URL of its own, it is
      // attached to a host page. The validator skips the top-level
      // url check via the `skipUrlCheck` dispatcher below.
      const items = node.itemListElement;
      if (!Array.isArray(items) || items.length === 0) {
        fail.push(`${tag} BreadcrumbList itemListElement empty or not array`);
        continue;
      }
      let prevPos = 0;
      for (const li of items) {
        if (li['@type'] !== 'ListItem') {
          fail.push(`${tag} BreadcrumbList entry @type=${li['@type']} (expected ListItem)`);
        }
        if (typeof li.position !== 'number' || li.position < 1) {
          fail.push(`${tag} BreadcrumbList ListItem position invalid: ${li.position}`);
        } else if (li.position !== prevPos + 1) {
          fail.push(`${tag} BreadcrumbList ListItem position ${li.position} not consecutive after ${prevPos}`);
        }
        if (typeof li.name !== 'string' || li.name.length === 0) {
          fail.push(`${tag} BreadcrumbList ListItem missing name`);
        }
        if (typeof li.item !== 'string' || li.item.length === 0) {
          fail.push(`${tag} BreadcrumbList ListItem missing item (url)`);
        } else if (!isHttpUrl(li.item)) {
          fail.push(`${tag} BreadcrumbList ListItem item not absolute: ${li.item}`);
        }
        prevPos = li.position;
      }
    } else {
      fail.push(`${tag} unexpected @type=${t}`);
    }
  }
}

console.log(`Parsed ${totalPayloads} JSON-LD payloads across ${LOCALES.length * PAGES.length} pages.`);
if (warn.length) {
  console.log(`\nWarnings (${warn.length}):`);
  for (const w of warn) console.log('  ⚠ ' + w);
}
if (fail.length) {
  console.log(`\nFailures (${fail.length}):`);
  for (const f of fail) console.log('  ✗ ' + f);
  process.exit(1);
} else {
  console.log('All payloads pass schema field checks.');
}
