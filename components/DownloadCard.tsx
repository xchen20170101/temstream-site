import { primaryUrl, mirrorUrl, releasesUrlFor, formatSize, type DownloadItem } from '@/lib/downloads';
import type { Locale } from '@/lib/jsonld-schemas';

export type DownloadCardLabels = {
  downloadBtn: string;
  mirrorBtn: string;
  mirrorHint: string;
  viewAll: string;
  primaryFrom: string;
};

/**
 * Renders a single download card.
 *
 * Layout (top → bottom):
 *   1. Platform icon + optional step badge (numbered install order)
 *   2. Title (name) + meta chips (version · size · arch)
 *   3. Package description (one-liner)
 *   4. Single, full-width primary CTA ("Download")
 *   5. Footer line with primary mirror, switch-mirror link, view-all link
 *
 * Notes:
 *   - The old `<dl>` triple of platform/arch/version was redundant
 *     with the header subtitle and has been removed.
 *   - The "size (field)" was a dead i18n key; we now show the real
 *     byte count from `item.sizeBytes`.
 *   - The mirror hostname used to be crammed inside the button. It
 *     now lives on a quieter footer line so the button stays calm.
 */
export function DownloadCard({
  item,
  locale,
  labels,
  stepNumber,
}: {
  item: DownloadItem;
  locale: Locale;
  labels: DownloadCardLabels;
  /** ① ② … install-order hint shown as a badge in the top-right. */
  stepNumber?: number;
}) {
  const label = item.label[locale];
  const description = item.packageLabel[locale];
  const primary = primaryUrl(item, locale);
  const mirror = mirrorUrl(item, locale);
  const releases = releasesUrlFor(item, locale);

  let primaryHost = primary;
  let mirrorHost = mirror;
  try {
    primaryHost = new URL(primary).hostname;
    mirrorHost = new URL(mirror).hostname;
  } catch {
    /* keep raw string if URL parsing fails */
  }

  const sizeLabel = formatSize(item.sizeBytes);

  return (
    <article className="download-card group relative flex flex-col gap-5 overflow-hidden">
      {stepNumber !== undefined && (
        <span
          aria-hidden="true"
          className="absolute right-5 top-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-neon-cyan/15 text-sm font-bold text-neon-cyan ring-1 ring-neon-cyan/40"
        >
          {stepNumber}
        </span>
      )}

      <header className="flex flex-col items-center gap-3 pt-2 text-center">
        <PlatformIcon id={item.id} />
        <h3 className="text-lg font-semibold leading-snug text-white">{label}</h3>
      </header>

      <ul className="download-meta flex flex-wrap items-center justify-center gap-2 text-xs">
        <li className="chip font-mono">{item.version}</li>
        <li className="chip font-mono">{sizeLabel}</li>
        <li className="chip">{item.arch}</li>
      </ul>

      <p className="text-sm leading-relaxed text-slate-300 text-center">
        {description}
      </p>

      <div className="mt-auto">
        <a
          href={primary}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full justify-center text-sm"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {labels.downloadBtn}
          <span className="ml-1 text-xs font-mono opacity-80">· {sizeLabel}</span>
        </a>
      </div>

      <div className="download-footer flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-white/5 pt-3 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon-green/80" aria-hidden="true" />
          {labels.primaryFrom}{' '}
          <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-slate-200">
            {primaryHost}
          </code>
        </span>
        <a
          href={mirror}
          target="_blank"
          rel="noopener noreferrer"
          title={labels.mirrorHint}
          className="inline-flex items-center gap-1 text-slate-300 transition hover:text-neon-cyan"
        >
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
            <path
              d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M20 4v4h-4M4 20v-4h4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {labels.mirrorBtn} ·{' '}
          <code className="font-mono">{mirrorHost}</code>
        </a>
        {releases && (
          <a
            href={releases}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 transition hover:text-neon-cyan"
          >
            {labels.viewAll} →
          </a>
        )}
      </div>
    </article>
  );
}

/**
 * Inline SVG icons for the three download targets. One glyph per
 * platform so the cards have an obvious visual differentiator and
 * users can find the right build at a glance. Keeping these inline
 * (vs. an icon library) means no extra dependency and they pick up
 * the currentColor from the surrounding `text-neon-cyan` ring.
 */
function PlatformIcon({ id }: { id: DownloadItem['id'] }) {
  if (id === 'moonlight-windows-x64') {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 text-neon-cyan ring-1 ring-neon-cyan/30 transition group-hover:from-neon-cyan/30 group-hover:to-neon-violet/30"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M3 5.5L11 3.5v8H3v-6Zm0 6.5h8v8L3 18.5v-6.5Zm9-8.6L21 2v9.5h-9V3.4Zm0 9.6h9V21l-9-1.5v-6Z" />
        </svg>
      </span>
    );
  }
  if (id === 'moonlight-android-apk') {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 text-neon-green ring-1 ring-neon-green/30 transition group-hover:from-neon-green/30 group-hover:to-neon-cyan/30"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 9c0-2.8 2.2-5 5-5s5 2.2 5 5" strokeLinecap="round" />
          <rect x="6.5" y="9" width="11" height="11" rx="2.2" />
          <circle cx="10" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="14" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
          <path d="M8.6 6.5 7.4 4.5M15.4 6.5l1.2-2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  // sunshine-windows-installer (server / desktop host)
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-violet/20 to-neon-pink/20 text-neon-violet ring-1 ring-neon-violet/30 transition group-hover:from-neon-violet/30 group-hover:to-neon-pink/30"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" strokeLinecap="round" />
        <path d="M9 9h6M9 12h4" strokeLinecap="round" />
      </svg>
    </span>
  );
}