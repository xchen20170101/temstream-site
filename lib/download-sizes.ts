import type { DownloadItem } from '@/lib/downloads';

/**
 * Resolves the *real* byte size of each release asset at request time.
 *
 * Why not hardcode: the old `SIZE` table had drifted to 15/8/12 MB while
 * the actual v1.0 assets are ~55/47/79 MB — the UI was under-reporting by
 * up to 6x. Sizes now follow the release itself, and an unknown size is
 * rendered as nothing rather than as a wrong number.
 *
 * Why not fetch in the browser: the GitHub API rate-limits per client IP
 * (60/h unauthenticated), and Gitee's API sends no CORS headers.
 *
 * Resolution order (first hit wins, per asset):
 *   1. GitHub Releases API `assets[].size` — authoritative, one request
 *      covers every file of a tag, cached for an hour in Next's data cache.
 *   2. `HEAD` on the download URL, reading `Content-Length`. This is the
 *      only way to get a size out of Gitee (its v5 API omits `size`).
 *   3. Nothing — the card omits the size entirely.
 *
 * Both mirrors ship byte-identical files today (verified: apk is
 * 48,898,538 B on both), so a single number per asset name is enough.
 */

const GITHUB_API_BASE = 'https://api.github.com/repos/xchen20170101/temstream_release';
const REVALIDATE_SECONDS = 60 * 60;
/** Hard cap so a slow/hanging upstream can never stall a page render. */
const TIMEOUT_MS = 4000;

/** asset file name -> size in bytes. Missing keys mean "unknown". */
export type ReleaseSizeMap = Record<string, number>;

type GitHubAsset = { name?: unknown; size?: unknown };

function isUsableSize(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/**
 * Pull every asset size for a tag from the GitHub Releases API.
 * Returns an empty map on any failure — callers treat that as "unknown"
 * and fall through to the HEAD probe.
 */
async function sizesFromGitHubApi(tag: string): Promise<ReleaseSizeMap> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'temstream-site',
    };
    // Optional. Vercel's shared egress IP can burn through the anonymous
    // 60/hour budget; a token lifts that to 5000/hour. Without it we still
    // work, we just lean on the HEAD fallback more often.
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`${GITHUB_API_BASE}/releases/tags/${encodeURIComponent(tag)}`, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Next data cache: one upstream call per tag per hour, shared by all
      // visitors and by every page that asks for the same tag.
      next: { revalidate: REVALIDATE_SECONDS, tags: [`release-sizes:${tag}`] },
    });
    if (!res.ok) return {};

    const json = (await res.json()) as { assets?: GitHubAsset[] };
    if (!Array.isArray(json?.assets)) return {};

    const sizes: ReleaseSizeMap = {};
    for (const asset of json.assets) {
      if (typeof asset?.name === 'string' && isUsableSize(asset.size)) {
        sizes[asset.name] = asset.size;
      }
    }
    return sizes;
  } catch {
    return {};
  }
}

/** Read `Content-Length` from a download URL without pulling the body. */
async function sizeFromHead(url: string): Promise<number | undefined> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      // A probe is cheap and single-use; never let a transient failure get
      // cached for an hour.
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return undefined;
    const raw = res.headers.get('content-length');
    const bytes = raw === null ? NaN : Number(raw);
    return Number.isFinite(bytes) && bytes > 0 ? bytes : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolve sizes for the given items under a specific release tag.
 *
 * `tag` matters: v1.0 and lan_v1.0 contain *different* builds with
 * different sizes, so a global file-name -> size table would be wrong.
 *
 * Never throws. A partial map is a valid result; unknown assets are
 * simply absent from it.
 */
export async function resolveSizes(
  items: DownloadItem[],
  tag: string,
  locale: string,
): Promise<ReleaseSizeMap> {
  const names = Array.from(new Set(items.map((item) => item.fileName)));
  if (names.length === 0) return {};

  const apiSizes = await sizesFromGitHubApi(tag);
  const missing = names.filter((name) => !apiSizes[name]);

  const probed: ReleaseSizeMap = {};
  if (missing.length > 0) {
    // Probe the URL the visitor would actually click (Gitee for zh, GitHub
    // for en) so the number describes that mirror.
    const results = await Promise.all(
      items
        .filter((item) => missing.includes(item.fileName))
        .map(async (item) => {
          const url = locale === 'zh' ? item.urlZh : item.urlEn;
          return [item.fileName, await sizeFromHead(url)] as const;
        }),
    );
    for (const [name, bytes] of results) {
      if (bytes) probed[name] = bytes;
    }
  }

  const resolved: ReleaseSizeMap = {};
  for (const name of names) {
    const bytes = apiSizes[name] ?? probed[name];
    if (bytes) resolved[name] = bytes;
  }
  return resolved;
}
