import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionContext } from '@/components/SectionContext';
import { makeAlternates, ogLocale, homeCrumbLabel, sectionCrumbLabel, pageCrumbLabel } from '@/lib/seo';
import { JsonLd } from '@/lib/jsonld';
import {
  buildFaqPageSchema,
  buildBreadcrumbListSchema,
  type Locale,
} from '@/lib/jsonld-schemas';

/**
 * 预装盒子 FAQ 页 (zh-only)。
 *
 * 与 `/box` 概览页一样：英文模式下 redirect 到 `/zh` 首页。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'en') {
    return {
      title: 'temstream',
      robots: { index: false, follow: false },
    };
  }
  setRequestLocale(locale);
  const t = await getTranslations('boxFaq');
  const title = t.has('seoTitle') ? t('seoTitle') : t('title');
  const description = t.has('seoDescription') ? t('seoDescription') : t('subtitle');
  return {
    title,
    description,
    alternates: makeAlternates(locale, '/box-faq'),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale(locale),
      url: `/${locale}/box-faq`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BoxFaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (rawLocale === 'en') {
    redirect('/zh');
  }

  setRequestLocale(rawLocale);
  const t = await getTranslations('boxFaq');
  const items = t.raw('items') as { q: string; a: string }[];

  return (
    <>
      {/* FAQPage JSON-LD：让搜索引擎在搜索结果中直接展示问答。 */}
      <JsonLd
        data={buildFaqPageSchema(items, rawLocale as Locale, '/box-faq', t('title'), t('subtitle'))}
        id="box-faq-schema"
      />
      {/* BreadcrumbList JSON-LD. */}
      <JsonLd
        data={buildBreadcrumbListSchema(
          [
            { path: '', name: homeCrumbLabel(rawLocale) },
            { path: '/box', name: sectionCrumbLabel(rawLocale, 'box') },
            { path: '/box-faq', name: '常见问题' },
          ],
          rawLocale as Locale,
        )}
        id="box-faq-breadcrumb"
      />
      <section className="container-x pt-12 pb-10 sm:pt-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
        <SectionContext locale={rawLocale} section="box" />
      </section>

      <section className="container-x pb-24">
        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition open:border-neon-amber/40 open:bg-white/[0.05]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-white">
                <span>{item.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-45"
                  fill="none"
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
