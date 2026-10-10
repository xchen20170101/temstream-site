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
];

const SCRIPT_RE =
  /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

const fail = [];
const warn = [];
let totalPayloads = 0;

for (const locale of LOCALES) {
  for (const page of PAGES) {
    const file = join(BUILD, locale, `${page}.html`);
    const html = readFileSync(file, 'utf8');
    const matches = [...html.matchAll(SCRIPT_RE)];
    if (matches.length === 0) {
      fail.push(`[${locale}/${page}] no <script type="application/ld+json"> found`);
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
    if (!isHttpUrl(node.url)) {
      fail.push(`${tag} @type=${t} url not absolute http(s): ${node.url}`);
    }
    if (node.inLanguage !== locale) {
      fail.push(`${tag} @type=${t} inLanguage=${node.inLanguage} expected ${locale}`);
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
