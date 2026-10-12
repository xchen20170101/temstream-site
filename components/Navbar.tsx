'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';

type SectionTone = 'default' | 'wan' | 'lan' | 'box';

type NavLink = {
  href: string;
  /**
   * Translation key. Restricted to the union the i18n `nav` namespace
   * actually defines; pass `null` for entries that are locale-conditional
   * (e.g. `box` is only present in the zh translation), in which case
   * the entry is only rendered when the translation exists.
   */
  key: 'home' | 'wan' | 'lan' | 'box' | null;
  /**
   * Visual style hint. `wan` renders with the violet accent and `lan` with
   * the cyan accent, so the two sections read as parallel rather than as
   * sibling list items. `box` uses amber to mark the 预装盒子 section as
   * a hardware-only zh-locale page.
   */
  tone: SectionTone;
};

const links: NavLink[] = [
  { href: '/', key: 'home', tone: 'default' },
  { href: '/wan', key: 'wan', tone: 'wan' },
  { href: '/lan', key: 'lan', tone: 'lan' },
  { href: '/box', key: 'box', tone: 'box' },
];

/**
 * Top-level navigation. The structure is intentionally minimal:
 *   Home  ·  广域网  ·  局域网
 * The two section entries lead to overview pages (`/wan` and `/lan`) that
 * list the section's sub-pages — this matches the product mental model
 * where the home page introduces the product and each scenario is its
 * own self-contained "interface".
 *
 * Active state: whichever tab the user is on gets a solid coloured fill,
 * a 2px bottom indicator in the section colour, and a soft glow. The
 * three tabs read at the same visual weight so the user can always tell
 * which "section" of the site they are in.
 */
export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname() ?? '/';
  const normalized = pathname.replace(`/${locale}`, '') || '/';

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-base/70 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center" aria-label="temstream home">
          <Logo>temstream</Logo>
        </Link>

        <nav className="hidden items-stretch gap-1 md:flex" role="tablist">
          {links.map((link, idx) => {
            // Locale-conditional entries (e.g. `box` only exists in zh
            // translations) are skipped entirely on locales whose
            // translation does not provide the key. This keeps the
            // English navbar identical to its pre-box shape.
            if (link.key !== null && !t.has(link.key)) {
              return null;
            }
            // Insert a thin vertical separator before the first non-default
            // entry so the boundary between sections is visible.
            const showSeparator = idx > 0 && links[idx - 1].tone !== link.tone;
            // Section links highlight whenever the user is on any page
            // belonging to that section, not just the overview page exactly.
            const active =
              link.tone === 'wan'
                ? normalized === '/wan' ||
                  normalized === '/download' ||
                  normalized === '/tutorial' ||
                  normalized === '/faq'
                : link.tone === 'lan'
                  ? normalized === '/lan' || normalized.startsWith('/lan-')
                  : link.tone === 'box'
                    ? normalized === '/box' || normalized.startsWith('/box-')
                    : normalized === link.href;

            // Per-tone style bundles. Active variants get a solid fill +
            // a 2px bottom indicator in the section colour so the tab reads
            // as "selected" from a glance. Inactive variants use the section
            // colour at 70% so users can still tell which section a tab
            // belongs to even when not selected.
            const toneStyle = (() => {
              if (link.tone === 'wan') {
                return active
                  ? {
                      tab: 'bg-neon-violet/25 text-white shadow-[0_0_18px_-4px_rgba(139,92,246,0.6)]',
                      bar: 'bg-neon-violet shadow-[0_0_10px_rgba(139,92,246,0.9)]',
                      idleText: 'text-neon-violet/80',
                    }
                  : {
                      tab: 'text-neon-violet/70 hover:text-neon-violet hover:bg-neon-violet/10',
                      bar: 'bg-transparent',
                      idleText: '',
                    };
              }
              if (link.tone === 'lan') {
                return active
                  ? {
                      tab: 'bg-neon-cyan/25 text-white shadow-[0_0_18px_-4px_rgba(34,211,238,0.6)]',
                      bar: 'bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.9)]',
                      idleText: 'text-neon-cyan/80',
                    }
                  : {
                      tab: 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10',
                      bar: 'bg-transparent',
                      idleText: '',
                    };
              }
              if (link.tone === 'box') {
                // 预装盒子档：amber 调暖色，与 WAN/LAN 区分开。
                // 该档只在 zh locale 渲染（导航前一步的 t.has 检查已过滤），
                // 所以这里无须区分 en 文案。
                return active
                  ? {
                      tab: 'bg-neon-amber/25 text-white shadow-[0_0_18px_-4px_rgba(245,158,11,0.6)]',
                      bar: 'bg-neon-amber shadow-[0_0_10px_rgba(245,158,11,0.9)]',
                      idleText: 'text-neon-amber/80',
                    }
                  : {
                      tab: 'text-neon-amber/70 hover:text-neon-amber hover:bg-neon-amber/10',
                      bar: 'bg-transparent',
                      idleText: '',
                    };
              }
              // Home tab: neutral white, but still uses an indicator bar
              // so the three tabs read at the same visual weight.
              return active
                ? {
                    tab: 'bg-white/15 text-white shadow-[0_0_18px_-6px_rgba(255,255,255,0.5)]',
                    bar: 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]',
                    idleText: 'text-slate-200',
                  }
                : {
                    tab: 'text-slate-400 hover:text-white hover:bg-white/5',
                    bar: 'bg-transparent',
                    idleText: '',
                  };
            })();

            return (
              <span key={link.href} className="flex items-stretch">
                {showSeparator && (
                  <span aria-hidden className="mx-1 self-stretch w-px bg-white/15" />
                )}
                <Link
                  href={`/${locale}${link.href}`}
                  role="tab"
                  aria-selected={active}
                  aria-current={active ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 text-sm font-medium transition ${toneStyle.tab}`}
                >
                  <span>{t(link.key)}</span>
                  {/* 2px bottom indicator: solid section colour when active,
                      transparent when idle. Always rendered so the active
                      tab does not shift the layout. */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors ${toneStyle.bar}`}
                  />
                </Link>
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
