import Link from 'next/link';

export type SectionKey = 'wan' | 'lan' | 'box';

interface SectionContextProps {
  locale: string;
  section: SectionKey;
  /**
   * Optional override for the "switch to" target. Defaults to the other
   * section's overview page. Pass an explicit href to override (e.g. when
   * the user is already on an overview page and we want to skip the link).
   */
  switchHref?: string;
}

/**
 * Persistent context bar that sits at the top of every non-home page to make
 * the current section (WAN / LAN) unambiguous. Renders a "switch to the
 * other section" link on the right so the user can hop between the two
 * without using the top nav.
 *
 * Designed to be placed inside the page's first section, right under the
 * page header, with `container-x` and a comfortable top spacing.
 */
export function SectionContext({ locale, section, switchHref }: SectionContextProps) {
  const isBox = section === 'box';
  const isWan = section === 'wan';
  const isLan = section === 'lan';
  // `box` is a 预装盒子-only zh-locale page; resolve the "other" target
  // to the box overview root (not lan/wan) so the switch link never
  // bounces an English visitor away from a missing cross-section.
  const other: SectionKey = isWan ? 'lan' : isLan ? 'wan' : 'wan';
  // box section has no en copy — the page 404s in /en. Hard-code the
  // zh labels here so the component still renders correctly when the
  // surrounding layout is /zh.
  const labels = isBox
    ? {
        sectionName: '预装盒子',
        sectionShort: 'Box',
        desc: '预装 Moonlight 客户端专属特性（USBIP + Samba）—— 把盒子 USB 和存储借给游戏 PC',
        switchTo: '返回首页',
        overview: '盒子概览',
      }
    : isWan
      ? {
          sectionName: '广域网 (WAN)',
          sectionShort: 'WAN',
          desc: '出门在外也要玩家里电脑 —— VPN / 管理端 / 公网访问',
          switchTo: '切换到 局域网',
          overview: '广域网概览',
        }
      : {
          sectionName: '局域网 (LAN)',
          sectionShort: 'LAN',
          desc: '客厅 PC 串到卧室 / 阳台 / 电视 —— 同子网直连，最快最稳',
          switchTo: '切换到 广域网',
          overview: '局域网概览',
        };
  const labelsEn = isWan
    ? {
        sectionName: 'Public internet (WAN)',
        sectionShort: 'WAN',
        desc: 'Reach your home PC from anywhere — VPN / portal / public-internet access',
        switchTo: 'Switch to LAN',
        overview: 'WAN overview',
      }
    : {
        sectionName: 'Home network (LAN)',
        sectionShort: 'LAN',
        desc: 'Living-room PC to bedroom / balcony / TV — direct same-subnet, fastest path',
        switchTo: 'Switch to WAN',
        overview: 'LAN overview',
      };
  // box 档只在中文站出现，强制走 zh 文案；en 标签只为兜底。
  const useEn = !isBox && locale === 'en';
  const t = isBox ? labels : useEn ? labelsEn : labels;

  // 调色板：WAN = violet/pink，LAN = cyan，Box = amber（硬件专属的暖色调）
  const accentBorder = isBox
    ? 'border-neon-amber/40'
    : isWan
      ? 'border-neon-violet/35'
      : 'border-neon-cyan/35';
  const accentBg = isBox
    ? 'from-neon-amber/25 via-neon-amber/5 to-transparent'
    : isWan
      ? 'from-neon-violet/20 via-neon-violet/5 to-transparent'
      : 'from-neon-cyan/20 via-neon-cyan/5 to-transparent';
  const badgeBg = isBox
    ? 'from-neon-amber/40 to-neon-amber-soft/25 text-white shadow-neon-amber'
    : isWan
      ? 'from-neon-violet/35 to-neon-pink/25 text-white'
      : 'from-neon-cyan/35 to-neon-cyan/15 text-white';
  const accentText = isBox ? 'text-neon-amber' : isWan ? 'text-neon-violet' : 'text-neon-cyan';

  // Default "switch to" target: box 档跳首页（en 模式下页面已 404，
  // 这里仅在 zh locale 才会真正渲染），其它档跳对侧 section 概览页。
  const resolvedSwitchHref = isBox
    ? `/${locale}`
    : (switchHref ?? `/${locale}/${other}`);

  return (
    <div
      role="region"
      aria-label={useEn ? `Section: ${t.sectionShort}` : `当前章节：${t.sectionName}`}
      className={`relative mx-auto mb-8 flex w-full max-w-5xl flex-col gap-3 overflow-hidden rounded-2xl border ${accentBorder} bg-gradient-to-r ${accentBg} p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5`}
    >
      {/* Left: section identity */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${badgeBg} shadow-neon`}
        >
          {isBox ? (
            // 盒子 / 主机图标
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <rect x="3" y="5" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="7" cy="13.5" r="0.9" fill="currentColor" />
              <path d="M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : isWan ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M5 13a10 10 0 0 1 14 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M8.5 16.5a5 5 0 0 1 7 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M12 20h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {useEn ? 'You are in' : '你正在浏览'}
          </p>
          <p className="text-base font-semibold text-white sm:text-lg">
            {t.sectionName}
          </p>
          <p className="mt-0.5 hidden text-xs text-slate-300 sm:block">
            {t.desc}
          </p>
        </div>
      </div>

      {/* Right: section actions */}
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <Link
          href={`/${locale}/${section}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/25 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path
              d="M4 6h6v6H4zM14 6h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          {t.overview}
        </Link>
        <Link
          href={resolvedSwitchHref}
          className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium transition hover:border-white/25 hover:bg-white/[0.08] ${accentText} hover:text-white`}
        >
          {t.switchTo}
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path
              d="M5 12h14m0 0-4-4m4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
