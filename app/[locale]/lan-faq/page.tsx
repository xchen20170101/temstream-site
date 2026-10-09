import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SectionContext } from '@/components/SectionContext';

type Locale = (typeof routing.locales)[number];

export default async function LanFaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lanFaq');
  const items = t.raw('items') as { q: string; a: string }[];
  const quickRef = t.raw('quickRef') as {
    title: string;
    phenomenon: string;
    action: string;
    rows: { phenomenon: string; action: string }[];
  };

  return (
    <>
      <section className="container-x pt-12 pb-10 sm:pt-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
        <SectionContext locale={locale as Locale} section="lan" />
      </section>

      <section className="container-x pb-16">
        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition open:border-neon-cyan/40 open:bg-white/[0.05]"
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

      <section className="container-x pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {quickRef.title}
            </h2>
          </div>
          <div className="glass-card mt-8 overflow-hidden p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04] text-slate-200">
                <tr>
                  <th className="w-2/5 px-4 py-3 font-medium">{quickRef.phenomenon}</th>
                  <th className="px-4 py-3 font-medium">{quickRef.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {quickRef.rows.map((r, i) => (
                  <tr key={i} className="align-top transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-white">{r.phenomenon}</td>
                    <td className="px-4 py-3">{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
