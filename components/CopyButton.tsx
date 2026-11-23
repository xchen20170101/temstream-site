'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copy-to-clipboard button for the WorkBuddy prompt block.
 *
 * Kept as a standalone client component so the download page itself stays
 * a server component — only this button ships JS.
 *
 * Two paths: the async Clipboard API when available (HTTPS / localhost),
 * and a hidden-textarea + execCommand fallback for plain-HTTP contexts
 * where `navigator.clipboard` is undefined or rejects.
 */
export function CopyButton({
  text,
  copyLabel,
  copiedLabel,
}: {
  text: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onCopy = useCallback(async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-9999px';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        ok = document.execCommand('copy');
        document.body.removeChild(area);
      } catch {
        ok = false;
      }
    }

    if (!ok) return;

    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-live="polite"
      className="btn-ghost shrink-0 gap-1.5 px-3 py-1.5 text-xs"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <path
            d="m5 12.5 4.5 4.5L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4H6a2 2 0 0 0-2 2v7.5A1.5 1.5 0 0 0 5.5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
