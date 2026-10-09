import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SectionContext } from '@/components/SectionContext';

type Locale = (typeof routing.locales)[number];

export default async function LanUsagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lanUsage');
  const tips = t.raw('section3Tips') as string[];

  const sections = [
    {
      title: t('section1Title'),
      body: t('section1Body'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
    },
    {
      title: t('section2Title'),
      body: t('section2Body'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: t('section3Title'),
      body: t('section3Body'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 8h18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
      asideTitle: t('section3TipsTitle'),
      asideItems: tips,
    },
    {
      title: t('section4Title'),
      body: t('section4Body'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M8 5v14l11-7L8 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: t('section5Title'),
      body: t('section5Body'),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="container-x pt-12 pb-10 sm:pt-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
        <SectionContext locale={locale as Locale} section="lan" />
      </section>

      <section className="container-x pb-24">
        <div className="space-y-6">
          {sections.map((s, i) => (
            <article key={i} className="glass-card">
              <header className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-violet/30 text-neon-cyan">
                  {s.icon}
                </span>
                <h2 className="text-lg font-semibold text-white sm:text-xl">{s.title}</h2>
              </header>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {s.body}
              </p>
              {s.asideItems && s.asideTitle && (
                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-neon-cyan">
                    {s.asideTitle}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-200">
                    {s.asideItems.map((tip, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
                        <span className="whitespace-pre-line">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
