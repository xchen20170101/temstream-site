import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { makeAlternates, ogLocale } from '@/lib/seo';
import { SectionContext } from '@/components/SectionContext';

type Locale = (typeof routing.locales)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('lanTutorial');
  const title = t.has('seoTitle') ? t('seoTitle') : t('title');
  const description = t.has('seoDescription') ? t('seoDescription') : t('subtitle');
  return {
    title,
    description,
    alternates: makeAlternates(locale, '/lan-tutorial'),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale(locale),
      url: `/${locale}/lan-tutorial`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LanTutorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lanTutorial');
  const steps = t.raw('steps') as { title: string; desc: string }[];

  return (
    <>
      <section className="container-x pt-12 pb-10 sm:pt-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
        <SectionContext locale={locale as Locale} section="lan" />
      </section>

      <section className="container-x pb-20">
        <ol className="grid gap-4 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={i} className="glass-card relative">
              <span className="absolute -top-4 left-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet text-sm font-bold text-white shadow-neon">
                {i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
