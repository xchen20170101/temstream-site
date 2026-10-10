import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { makeAlternates, ogLocale } from '@/lib/seo';

type Locale = (typeof routing.locales)[number];

// Per-page SEO metadata. Pulls `seoTitle` / `seoDescription` from the
// `home` namespace (falling back to `heroTitle` / `heroSubtitle` if a
// future translator drops the SEO fields) and wires up canonical +
// hreflang alternates for the home page.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('home');
  const title = t.has('seoTitle') ? t('seoTitle') : t('heroTitle');
  const description = t.has('seoDescription') ? t('seoDescription') : t('heroSubtitle');
  return {
    title,
    description,
    alternates: makeAlternates(locale, ''),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale(locale),
      url: `/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// ─── Scene card ───────────────────────────────────────────────────────────────

type Bullet = string;

interface SceneCardProps {
  locale: Locale;
  type: 'wan' | 'lan';
  eyebrow: string;
  title: string;
  tagline: string;
  desc: string;
  bullets: Bullet[];
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  links: { key: string; label: string; href: string }[];
}

function SceneCard({
  locale,
  type,
  eyebrow,
  title,
  tagline,
  desc,
  bullets,
  ctaPrimary,
  ctaPrimaryHref,
  ctaSecondary,
  ctaSecondaryHref,
  links,
}: SceneCardProps) {
  const isLan = type === 'lan';
  const accentFrom = isLan ? 'from-neon-cyan/25' : 'from-neon-violet/25';
  const accentTo = isLan ? 'to-neon-cyan/5' : 'to-neon-pink/15';
  const borderColor = isLan ? 'border-neon-cyan/25' : 'border-neon-violet/30';
  const iconBg = isLan ? 'from-neon-cyan/30 to-neon-cyan/10' : 'from-neon-violet/30 to-neon-pink/10';
  const iconText = isLan ? 'text-neon-cyan' : 'text-neon-violet';
  const tagBg = isLan ? 'bg-neon-cyan/15 text-neon-cyan' : 'bg-neon-violet/15 text-neon-violet';
  const accentBtn =
    'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-violet to-neon-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-neon transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-neon-cyan/60';

  return (
    <article
      className={`relative flex flex-col rounded-2xl border ${borderColor} bg-gradient-to-br ${accentFrom} ${accentTo} p-6 backdrop-blur-sm transition hover:border-white/25`}
    >
      {/* Eyebrow chip */}
      <span className={`mb-4 self-start rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium ${tagBg}`}>
        {eyebrow}
      </span>

      {/* Icon */}
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} ${iconText}`}>
        {type === 'lan' ? (
          // WiFi / Router icon
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="M5 13a10 10 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8.5 16.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          // Globe / internet icon
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm font-medium text-slate-300">{tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p>

      {/* Bullet list */}
      <ul className="mt-4 space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-300">
            <span
              className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${isLan ? 'bg-neon-cyan' : 'bg-neon-violet'}`}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/${locale}${ctaPrimaryHref}`} className={accentBtn}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {ctaPrimary}
        </Link>
        <Link
          href={`/${locale}${ctaSecondaryHref}`}
          className="text-sm text-slate-400 underline-offset-4 transition hover:text-white hover:underline"
        >
          {ctaSecondary}
        </Link>
      </div>

      {/* Small links row */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {links.map((l) => (
          <Link
            key={l.key}
            href={`/${locale}${l.href}`}
            className="text-xs text-slate-500 underline-offset-4 transition hover:text-slate-300 hover:underline"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </article>
  );
}

// ─── VS table ────────────────────────────────────────────────────────────────

interface VsTableProps {
  colScenario: string;
  colWan: string;
  colLan: string;
  colNeed: string;
  colPerf: string;
  colSecurity: string;
  wanNeed: string;
  wanPerf: string;
  wanSecurity: string;
  lanNeed: string;
  lanPerf: string;
  lanSecurity: string;
}

function VsTable({
  colScenario,
  colWan,
  colLan,
  colNeed,
  colPerf,
  colSecurity,
  wanNeed,
  wanPerf,
  wanSecurity,
  lanNeed,
  lanPerf,
  lanSecurity,
}: VsTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="px-4 py-3 font-medium text-slate-200">{colScenario}</th>
            <th className="px-4 py-3 font-medium text-neon-violet">{colWan}</th>
            <th className="px-4 py-3 font-medium text-neon-cyan">{colLan}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-300">
          <tr>
            <td className="px-4 py-3 align-top text-white">{colNeed}</td>
            <td className="px-4 py-3 align-top">{wanNeed}</td>
            <td className="px-4 py-3 align-top bg-neon-cyan/[0.04]">{lanNeed}</td>
          </tr>
          <tr>
            <td className="px-4 py-3 align-top text-white">{colPerf}</td>
            <td className="px-4 py-3 align-top">{wanPerf}</td>
            <td className="px-4 py-3 align-top bg-neon-cyan/[0.04]">{lanPerf}</td>
          </tr>
          <tr>
            <td className="px-4 py-3 align-top text-white">{colSecurity}</td>
            <td className="px-4 py-3 align-top">{wanSecurity}</td>
            <td className="px-4 py-3 align-top bg-neon-cyan/[0.04]">{lanSecurity}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const s = t.raw('scenes') as {
    title: string;
    subtitle: string;
    wan: { eyebrow: string; title: string; tagline: string; desc: string; bullets: string[]; ctaPrimary: string; ctaSecondary: string; links: { tutorial: string; faq: string } };
    lan: { eyebrow: string; title: string; tagline: string; desc: string; bullets: string[]; ctaPrimary: string; ctaSecondary: string; links: { tutorial: string; faq: string } };
    vsTitle: string;
    vsSubtitle: string;
    vs: {
      colScenario: string; colWan: string; colLan: string; colNeed: string; colPerf: string; colSecurity: string;
      wan: { need: string; perf: string; security: string };
      lan: { need: string; perf: string; security: string };
    };
  };

  const metrics = [
    { key: 'latency', value: t('metrics.latencyValue') },
    { key: 'resolution', value: t('metrics.resolutionValue') },
    { key: 'codecs', value: t('metrics.codecsValue') },
    { key: 'price', value: t('metrics.priceValue') },
  ] as const;

  const features = [
    {
      title: locale === 'zh' ? '开源协议' : 'Open protocol',
      desc:
        locale === 'zh'
          ? '基于 NVIDIA GameStream 协议的开源再实现，由 Moonlight 与 LizardByte 社区长期维护。'
          : "An open-source reimplementation of NVIDIA's GameStream protocol, maintained by the Moonlight and LizardByte communities.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: locale === 'zh' ? '硬件加速编码' : 'Hardware encoding',
      desc:
        locale === 'zh'
          ? '支持 NVIDIA NVENC、Intel QuickSync、AMD AMF，附带软件编码回退，几乎不占 GPU 算力。'
          : 'NVIDIA NVENC, Intel QuickSync and AMD AMF are all supported, with a software fallback for anything without a hardware encoder.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: locale === 'zh' ? '跨平台客户端' : 'Cross-platform clients',
      desc:
        locale === 'zh'
          ? 'Windows、Android、iOS、macOS、Linux、tvOS、ChromeOS、Steam Link、Raspberry Pi 都能玩。'
          : 'Windows, Android, iOS, macOS, Linux, tvOS, ChromeOS, Steam Link, Raspberry Pi — and more.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M18 8v9a2 2 0 0 1-2 2H8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: locale === 'zh' ? '手柄与键鼠' : 'Gamepad & keyboard',
      desc:
        locale === 'zh'
          ? 'Sunshine 可模拟 Xbox / PlayStation / Switch 手柄；Moonlight 支持 PS、Xbox、Android 手柄与键鼠。'
          : 'Sunshine emulates Xbox, PlayStation and Nintendo Switch pads. Moonlight supports PS, Xbox and Android controllers, plus keyboard and mouse.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path
            d="M6 8h12a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-1l-2-2H9l-2 2H6a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="8" cy="12" r="1.2" fill="currentColor" />
          <circle cx="16" cy="12" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: locale === 'zh' ? '公网串流' : 'Stream anywhere',
      desc:
        locale === 'zh'
          ? '通过 Tailscale 定义网络即可穿透，无需暴露 Sunshine 端口。'
          : 'Reach your PC from anywhere using Tailscale — no need to expose Sunshine ports.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
    },
    {
      title: locale === 'zh' ? '完全免费' : 'Always free',
      desc:
        locale === 'zh'
          ? 'GPLv3 开源，无广告、无内购、无订阅、没有"Pro 版"。社区驱动，由玩家为玩家打造。'
          : 'GPLv3 licensed. No ads, no IAPs, no subscription, no "Pro" tier. Community-driven, built by gamers for gamers.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path d="M12 3v18M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0 bg-hero-radial" aria-hidden />

        <div className="container-x relative pb-20 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mb-6">
              <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-neon-cyan" />
              {t('heroEyebrow')}
            </span>
            <h1 className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* ── Scene selection ─────────────────────────────────────────── */}
          <section className="container-x py-16 sm:py-20" aria-labelledby="scenes-title">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 id="scenes-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
                {s.title}
              </h2>
              <p className="mt-3 text-slate-300">{s.subtitle}</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <SceneCard
                locale={locale as Locale}
                type="wan"
                eyebrow={s.wan.eyebrow}
                title={s.wan.title}
                tagline={s.wan.tagline}
                desc={s.wan.desc}
                bullets={s.wan.bullets}
                ctaPrimary={s.wan.ctaPrimary}
                ctaPrimaryHref="/download"
                ctaSecondary={s.wan.ctaSecondary}
                ctaSecondaryHref="/tutorial"
                links={[
                  { key: 'tutorial', label: s.wan.links.tutorial, href: '/tutorial' },
                  { key: 'faq', label: s.wan.links.faq, href: '/faq' },
                ]}
              />
              <SceneCard
                locale={locale as Locale}
                type="lan"
                eyebrow={s.lan.eyebrow}
                title={s.lan.title}
                tagline={s.lan.tagline}
                desc={s.lan.desc}
                bullets={s.lan.bullets}
                ctaPrimary={s.lan.ctaPrimary}
                ctaPrimaryHref="/lan-download"
                ctaSecondary={s.lan.ctaSecondary}
                ctaSecondaryHref="/lan-tutorial"
                links={[
                  { key: 'tutorial', label: s.lan.links.tutorial, href: '/lan-tutorial' },
                  { key: 'faq', label: s.lan.links.faq, href: '/lan-faq' },
                ]}
              />
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
                {s.vsTitle}
              </p>
              <p className="mb-4 text-center text-xs text-slate-500">{s.vsSubtitle}</p>
              <VsTable
                colScenario={s.vs.colScenario}
                colWan={s.vs.colWan}
                colLan={s.vs.colLan}
                colNeed={s.vs.colNeed}
                colPerf={s.vs.colPerf}
                colSecurity={s.vs.colSecurity}
                wanNeed={s.vs.wan.need}
                wanPerf={s.vs.wan.perf}
                wanSecurity={s.vs.wan.security}
                lanNeed={s.vs.lan.need}
                lanPerf={s.vs.lan.perf}
                lanSecurity={s.vs.lan.security}
              />
            </div>
          </section>

          <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.key} className="glass-card text-center">
                <dt className="text-xs uppercase tracking-widest text-slate-400">
                  {t(`metrics.${m.key}`)}
                </dt>
                <dd className="mt-2 bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('featuresTitle')}</h2>
          <p className="mt-3 text-slate-300">{t('featuresSubtitle')}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="glass-card group">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-violet/30 to-neon-cyan/20 text-neon-cyan transition group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('howTitle')}</h2>
          <p className="mt-3 text-slate-300">{t('howSubtitle')}</p>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {t.raw('howSteps').map((s: { title: string; desc: string }, i: number) => (
            <li key={i} className="glass-card relative">
              <span className="absolute -top-4 left-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet to-neon-cyan text-sm font-bold text-white shadow-neon">
                {i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${locale}/wan`} className="btn-primary">
            {locale === 'zh' ? '进入广域网' : 'Enter WAN mode'}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M5 12h14m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href={`/${locale}/lan`} className="btn-ghost">
            {locale === 'zh' ? '进入局域网' : 'Enter LAN mode'}
          </Link>
        </div>
      </section>
    </>
  );
}