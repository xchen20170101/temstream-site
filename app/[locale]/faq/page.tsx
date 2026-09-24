import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];

  return (
    <>
      <section className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition open:border-white/20 open:bg-white/[0.05]"
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
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}