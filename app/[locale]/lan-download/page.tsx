import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { downloadsLan, primaryUrl } from '@/lib/downloads';
import type { DownloadItem } from '@/lib/downloads';
import { DownloadCard } from '@/components/DownloadCard';
import { makeAlternates, ogLocale, homeCrumbLabel, sectionCrumbLabel, pageCrumbLabel } from '@/lib/seo';
import { SectionContext } from '@/components/SectionContext';
import { JsonLd } from '@/lib/jsonld';
import { buildSoftwareApplicationSchema, buildBreadcrumbListSchema, type Locale } from '@/lib/jsonld-schemas';

/**
 * Same mapping as the WAN download page: the binaries are identical,
 * only the deployed release tag differs. Keep these two tables in
 * sync if upstream ever ships a new architecture.
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
  const t = await getTranslations('lanDownload');
  const title = t.has('seoTitle') ? t('seoTitle') : t('title');
  const description = t.has('seoDescription') ? t('seoDescription') : t('subtitle');
  return {
    title,
    description,
    alternates: makeAlternates(locale, '/lan-download'),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: ogLocale(locale),
      url: `/${locale}/lan-download`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LanDownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lanDownload');
  const labels = {
    downloadBtn: t('downloadBtn'),
    mirrorBtn: t('mirrorBtn'),
    mirrorHint: locale === 'zh' ? t('mirrorHintZh') : t('mirrorHintEn'),
    viewAll: t('viewAll'),
    primaryFrom: t('primaryFrom'),
  };

  const clients = downloadsLan.filter((d) => d.kind === 'client');
  const servers = downloadsLan.filter((d) => d.kind === 'server');

  return (
    <>
      {/* SoftwareApplication JSON-LD for the LAN download page.
          Same `OS_BY_DOWNLOAD_ID` mapping as the WAN page; the only
          difference is the release tag (`lan_v0.4`) embedded inside
          `downloadUrl` via `primaryUrl()`. */}
      <JsonLd
        data={buildAppSchemas(
          [...clients, ...servers],
          locale as Locale,
          '/lan-download',
        )}
        id="lan-download-schema"
      />
      {/* BreadcrumbList JSON-LD. LAN download: "Home / LAN /
          Download". */}
      <JsonLd
        data={buildBreadcrumbListSchema(
          [
            { path: '', name: homeCrumbLabel(locale) },
            { path: '/lan', name: sectionCrumbLabel(locale, 'lan') },
            { path: '/lan-download', name: pageCrumbLabel(locale, 'download') },
          ],
          locale as Locale,
        )}
        id="lan-download-breadcrumb"
      />
      <section className="container-x pt-12 pb-10 sm:pt-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
        <SectionContext locale={locale as Locale} section="lan" />

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

      <section className="container-x pb-8">
        <div className="glass-card border-neon-cyan/30 bg-neon-cyan/[0.04]">
          <p className="text-sm leading-relaxed text-slate-200">{t('lanOnlyNote')}</p>
        </div>
      </section>

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