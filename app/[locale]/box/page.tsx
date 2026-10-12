import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionContext } from '@/components/SectionContext';
import { makeAlternates, ogLocale, homeCrumbLabel, sectionCrumbLabel } from '@/lib/seo';
import { JsonLd } from '@/lib/jsonld';
import { buildBreadcrumbListSchema, type Locale } from '@/lib/jsonld-schemas';

/**
 * 预装盒子高级特性说明页 (zh-only)。
 *
 * 关键行为：英文站点 (`/en/box`) 在 `generateMetadata` 之前直接重定向到
 * `/zh` 首页，让英文访客看到的是"这个特性不在英文站提供"，而不是
 * 渲染一个没有任何翻译的回退。SEO 上只发布 `/zh/box` 一条 URL —— 见
 * `app/sitemap.ts` 的 `ZH_ONLY_PAGES` 处理。
 *
 * `redirect()` 抛出 `NEXT_REDIRECT` 信号，会被 Next.js 路由层拦截
 * 处理为 HTTP 30x；下面的渲染代码在 /en 路径下永远不会被执行。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'en') {
    // 在 en 路径下不输出 metadata —— 页面会被 redirect 拦截，metadata
    // 仅作为兜底 SEO 信号，避免被爬虫误判。
    return {
      title: 'temstream',
      robots: { index: false, follow: false },
    };
  }
  setRequestLocale(locale);
  const t = await getTranslations('boxOverview');
  const title = t.has('seoTitle') ? t('seoTitle') : t('title');
  const description = t.has('seoDescription') ? t('seoDescription') : t('subtitle');
  return {
    title,
    description,
    // 自指 canonical 到 /zh/box —— 不输出 en 替代，避免将不可达
    // 英文 URL 暴露给搜索引擎。
    alternates: makeAlternates(locale, '/box'),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale(locale),
      url: `/${locale}/box`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/* ─── 特性卡片组件 ─────────────────────────────────────────────────────────── */

interface FeatureCardProps {
  /** 序号：USBIP = 1，Samba = 2。 */
  num: 1 | 2;
  title: string;
  tagline: string;
  desc: string;
  scenesTitle: string;
  scenes: string[];
}

function FeatureCard({
  num,
  title,
  tagline,
  desc,
  scenesTitle,
  scenes,
}: FeatureCardProps) {
  return (
    <article className="glass-card relative overflow-hidden">
      {/* 序号角标 */}
      <span className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-neon-amber/40 to-neon-amber-soft/30 text-sm font-bold text-white shadow-neon-amber">
        0{num}
      </span>
      {/* 标题 + 副标 */}
      <h3 className="pr-12 text-xl font-semibold text-white sm:text-2xl">
        {title}
      </h3>
      <p className="mt-1 text-sm font-medium text-neon-amber">{tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{desc}</p>

      {/* 场景列表 */}
      <div className="mt-5 rounded-xl border border-neon-amber/15 bg-neon-amber/[0.04] p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neon-amber">
          {scenesTitle}
        </p>
        <ul className="space-y-2.5">
          {scenes.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-200">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-amber" />
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ─── 页内主组件 ──────────────────────────────────────────────────────────── */

export default async function BoxOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  // 英文模式：直接重定向到 /zh 首页。这条 redirect 会在 /en/box 路径
  // 下立即生效，页面渲染代码不会执行 —— 所以下面的 `setRequestLocale`
  // 和 `getTranslations` 都不会被调用，也就不依赖 en.json 中的
  // `boxOverview` 命名空间。
  if (rawLocale === 'en') {
    redirect('/zh');
  }

  setRequestLocale(rawLocale);
  const t = await getTranslations('boxOverview');
  const usbipScenes = t.raw('usbipScenes') as string[];
  const sambaScenes = t.raw('sambaScenes') as string[];
  const whatYouNeed = t.raw('whatYouNeed') as string[];
  const purchaseSteps = t.raw('purchaseSteps') as string[];
  const purchaseTip = t('purchaseTip');

  return (
    <>
      {/* BreadcrumbList JSON-LD. 仅在 /zh 路径下渲染：英文模式已被
          上面的 `redirect()` 拦截，JSON-LD 不会污染 /en 输出。 */}
      <JsonLd
        data={buildBreadcrumbListSchema(
          [
            { path: '', name: homeCrumbLabel(rawLocale) },
            { path: '/box', name: sectionCrumbLabel(rawLocale, 'box') },
          ],
          rawLocale as Locale,
        )}
        id="box-breadcrumb"
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0 bg-hero-radial" aria-hidden />
        <div className="container-x relative pt-12 sm:pt-16">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <span className="chip mb-5 border-neon-amber/30 bg-neon-amber/10 text-neon-amber">
              <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-neon-amber" />
              {t('eyebrow')}
            </span>
            <h1 className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-4xl md:text-5xl">
              {t('title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              {t('subtitle')}
            </p>
          </div>

          {/* 「仅在预装盒子提供」横条 —— 这是用户访问这个页面时
              第一眼要看到的关键信息，确保不会误以为自装 Sunshine
              也能用。 */}
          <div
            role="note"
            className="mx-auto mb-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-neon-amber/35 bg-gradient-to-r from-neon-amber/20 via-neon-amber/5 to-transparent p-4 backdrop-blur"
          >
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neon-amber to-neon-amber-deep text-white shadow-neon-amber">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path
                  d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-sm font-medium leading-relaxed text-neon-amber-soft">
              {t('exclusiveBanner')}
            </p>
          </div>

          <SectionContext locale={rawLocale} section="box" />
        </div>
      </section>

      {/* 两个特性卡片 */}
      <section className="container-x pb-12">
        <div className="grid gap-5 lg:grid-cols-2">
          <FeatureCard
            num={1}
            title={t('usbiptitle')}
            tagline={t('usbipTagline')}
            desc={t('usbipDesc')}
            scenesTitle={t('usbipScenesTitle')}
            scenes={usbipScenes}
          />
          <FeatureCard
            num={2}
            title={t('sambaTitle')}
            tagline={t('sambaTagline')}
            desc={t('sambaDesc')}
            scenesTitle={t('sambaScenesTitle')}
            scenes={sambaScenes}
          />
        </div>
      </section>

      {/* 对照表：开源版 vs 预装盒子 */}
      <section className="container-x pb-12">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('compareTitle')}
          </h2>
          <p className="mt-3 text-slate-300">{t('compareSubtitle')}</p>
        </div>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-4 py-3 font-medium text-slate-200">
                  {t('compareColFeat')}
                </th>
                <th className="px-4 py-3 font-medium text-slate-300">
                  {t('compareColOpensource')}
                </th>
                <th className="px-4 py-3 font-medium text-neon-amber">
                  {t('compareColBox')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <CompareRow
                feat={t('compareUsbip')}
                opensource="❌"
                box="✅"
              />
              <CompareRow
                feat={t('compareSamba')}
                opensource="❌"
                box="✅"
              />
              <CompareRow
                feat={t('compareTunnel')}
                opensource={t('compareTunnelDesc')}
                box={t('compareTunnelDesc')}
                both
              />
              <CompareRow
                feat={t('compareLan')}
                opensource={t('compareLanDesc')}
                box={t('compareLanDesc')}
                both
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* 购买指南 + 你需要准备什么 */}
      <section className="container-x pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          {/* 左侧：购买指南 CTA 卡 */}
          <div
            id="box-cta"
            className="relative overflow-hidden rounded-2xl border border-neon-amber/30 bg-gradient-to-br from-neon-amber/15 via-neon-amber/5 to-transparent p-6 backdrop-blur"
          >
            <span className="chip mb-3 border-neon-amber/30 bg-neon-amber/10 text-neon-amber-soft">
              <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-neon-amber" />
              {t('ctaChip')}
            </span>
            <h3 className="text-lg font-semibold text-white">
              {t('ctaTitle')}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {t('ctaSubtitle')}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="#box-purchase"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-amber to-neon-amber-soft px-5 py-2.5 text-sm font-semibold text-bg-base shadow-neon-amber transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-neon-amber/60"
              >
                {t('ctaBtn')}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M5 12h14m0 0-4-4m4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href={`/${rawLocale}/box-faq`}
                className="text-sm text-slate-400 underline-offset-4 transition hover:text-white hover:underline"
              >
                {t('faqLink')}
              </Link>
            </div>
          </div>

          {/* 右侧：你需要准备什么 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed text-slate-300">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-300">
              {t('whatYouNeedTitle')}
            </p>
            <ul className="space-y-2.5">
              {whatYouNeed.map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-amber" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 购买步骤区 */}
        <section
          id="box-purchase"
          className="mt-8 rounded-2xl border border-neon-amber/20 bg-gradient-to-r from-neon-amber/8 via-neon-amber/3 to-transparent p-6"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neon-amber">
            {t('purchaseStepsTitle')}
          </p>
          <ol className="space-y-3">
            {purchaseSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-amber/20 text-xs font-semibold text-neon-amber">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-neon-amber/15 pt-4 text-xs text-slate-400">
            {purchaseTip}
          </p>
        </section>
      </section>
    </>
  );
}

function CompareRow({
  feat,
  opensource,
  box,
  both,
}: {
  feat: string;
  opensource: string;
  box: string;
  both?: boolean;
}) {
  return (
    <tr>
      <td className="px-4 py-3 align-top text-white">{feat}</td>
      <td className="px-4 py-3 align-top text-slate-300">{opensource}</td>
      <td
        className={`px-4 py-3 align-top ${both ? 'text-slate-200' : 'font-semibold text-neon-amber-soft'} bg-neon-amber/[0.04]`}
      >
        {box}
      </td>
    </tr>
  );
}
