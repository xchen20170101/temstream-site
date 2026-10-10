import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { downloads, primaryUrl } from '@/lib/downloads';
import type { DownloadItem } from '@/lib/downloads';
import { DownloadCard } from '@/components/DownloadCard';
import { makeAlternates, ogLocale, homeCrumbLabel, sectionCrumbLabel, pageCrumbLabel } from '@/lib/seo';
import { SectionContext } from '@/components/SectionContext';
import { JsonLd } from '@/lib/jsonld';
import { buildSoftwareApplicationSchema, buildBreadcrumbListSchema, type Locale } from '@/lib/jsonld-schemas';

/**
 * Map each `DownloadItem.id` to a Schema.org `operatingSystem`
 * value. We hand-roll this (rather than reading it from a config
 * file) because the upstream Sunshine / Moonlight version strings
 * don't change often and a wrong value here is a soft quality
 * signal in Google's eye. Keep the list short and human-readable.
 */
const OS_BY_DOWNLOAD_ID: Record<string, string> = {
  'moonlight-windows-x64': 'Windows 10, Windows 11',
  'moonlight-android-apk': 'Android 8.0',
  'sunshine-windows-installer': 'Windows 10, Windows 11',
};

function buildAppSchemas(items: DownloadItem[], locale: Locale, path: string) {
  return items.map((item) =>
    buildSoftwareApplicationSchema({
      id: item.id,
      name: item.label[locale],
      platform: item.platform,
      version: item.version,
      downloadUrl: primaryUrl(item, locale),
      operatingSystem: OS_BY_DOWNLOAD_ID[item.id] ?? item.platform,
      pagePath: path,
      locale,
    }),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('download');
  const title = t.has('seoTitle') ? t('seoTitle') : t('title');
  const description = t.has('seoDescription') ? t('seoDescription') : t('subtitle');
  return {
    title,
    description,
    alternates: makeAlternates(locale, '/download'),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale(locale),
      url: `/${locale}/download`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('download');
  const labels = {
    downloadBtn: t('downloadBtn'),
    mirrorBtn: t('mirrorBtn'),
    mirrorHint: locale === 'zh' ? t('mirrorHintZh') : t('mirrorHintEn'),
    viewAll: t('viewAll'),
    primaryFrom: t('primaryFrom'),
  };

  const clients = downloads.filter((d) => d.kind === 'client');
  const servers = downloads.filter((d) => d.kind === 'server');

  return (
    <>
      {/* SoftwareApplication JSON-LD. One entry per downloadable
          binary (Moonlight Windows, Moonlight Android, Sunshine
          Windows) so each becomes eligible for the software-app
          rich result. We deliberately do NOT emit
          `aggregateRating`: we have no real user rating source and
          inventing one would be a manual action. */}
      <JsonLd
        data={buildAppSchemas(
          [...clients, ...servers],
          locale as Locale,
          '/download',
        )}
        id="download-schema"
      />
      {/* BreadcrumbList JSON-LD. WAN download sits two levels
          below the home page: "Home / WAN / Download". */}
      <JsonLd
        data={buildBreadcrumbListSchema(
          [
            { path: '', name: homeCrumbLabel(locale) },
            { path: '/wan', name: sectionCrumbLabel(locale, 'wan') },
            { path: '/download', name: pageCrumbLabel(locale, 'download') },
          ],
          locale as Locale,
        )}
        id="download-breadcrumb"
      />
      <section className="container-x pt-12 pb-10 sm:pt-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
        <SectionContext locale={locale} section="wan" />

        {/* In-page anchor navigation so visitors don't have to
            scroll. The order (server first) matches the install
            order called out in the subtitle. */}
        <nav
          aria-label={t('jumpNavAria')}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <a href="#server" className="btn-ghost text-xs">
            <span className="text-slate-500">①</span>
            {t('serverTitle')}
          </a>
          <a href="#client" className="btn-ghost text-xs">
            <span className="text-slate-500">②</span>
            {t('clientTitle')}
          </a>
        </nav>
      </section>

      {/* Server first: visitors who only see the first row learn
          the install order matches what the subtitle promises. */}
      <section className="container-x pb-12" id="server">
        <header className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-violet/30 to-neon-pink/30 text-neon-violet">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <span className="text-neon-cyan">①</span>
              {t('serverTitle')}
            </h2>
            <p className="text-sm text-slate-400">{t('serverSubtitle')}</p>
          </div>
        </header>

        {/* Single server card: 2-col grid with the card spanning
            the left column and a hint card on the right. */}
        <div className="grid gap-4 md:grid-cols-2 lg:max-w-3xl">
          {servers.map((item) => (
            <DownloadCard
              key={item.id}
              item={item}
              locale={locale as Locale}
              labels={labels}
              stepNumber={1}
            />
          ))}
          <aside className="glass-card flex flex-col justify-center gap-2 text-sm text-slate-300">
            <p className="font-medium text-white">{t('installOrderTitle')}</p>
            <p className="leading-relaxed text-slate-400">{t('installOrderBody')}</p>
          </aside>
        </div>
      </section>

      <section className="container-x pb-20" id="client">
        <header className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-violet/30 text-neon-cyan">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M17 9h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <span className="text-neon-cyan">②</span>
              {t('clientTitle')}
            </h2>
            <p className="text-sm text-slate-400">{t('clientSubtitle')}</p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((item) => (
            <DownloadCard
              key={item.id}
              item={item}
              locale={locale as Locale}
              labels={labels}
              stepNumber={2}
            />
          ))}
        </div>
      </section>
    </>
  );
}