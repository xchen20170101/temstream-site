import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { downloadsLan, mirrorUrl, primaryUrl, releasesUrlFor } from '@/lib/downloads';
import type { DownloadItem } from '@/lib/downloads';
import { makeAlternates, ogLocale } from '@/lib/seo';
import { SectionContext } from '@/components/SectionContext';
import { JsonLd } from '@/lib/jsonld';
import { buildSoftwareApplicationSchema, type Locale } from '@/lib/jsonld-schemas';

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

function DownloadCard({
  item,
  locale,
  labels,
}: {
  item: DownloadItem;
  locale: Locale;
  labels: {
    platform: string;
    arch: string;
    version: string;
    size: string;
    downloadBtn: string;
    mirrorBtn: string;
    mirrorHintZh: string;
    mirrorHintEn: string;
    viewAll: string;
  };
}) {
  const size = locale === 'zh' ? item.sizeLabel.zh : item.sizeLabel.en;
  const label = item.label[locale];
  const primary = primaryUrl(item, locale);
  const mirror = mirrorUrl(item, locale);
  const releases = releasesUrlFor(item, locale);
  const mirrorHost = (() => {
    try {
      return new URL(mirror).hostname;
    } catch {
      return mirror;
    }
  })();

  return (
    <article className="glass-card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{label}</h3>
          <p className="mt-1 text-xs text-slate-400">
            {item.platform} · {item.arch} · {item.version}
          </p>
        </div>
        <span className="chip">{size}</span>
      </div>

      <dl className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <dt className="text-slate-500">{labels.platform}</dt>
          <dd className="mt-1 font-medium text-slate-200">{item.platform}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.arch}</dt>
          <dd className="mt-1 font-medium text-slate-200">{item.arch}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.version}</dt>
          <dd className="mt-1 font-medium text-slate-200">{item.version}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        <a
          href={primary}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {labels.downloadBtn}
        </a>
        <a
          href={mirror}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          title={locale === 'zh' ? labels.mirrorHintZh : labels.mirrorHintEn}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M20 4v4h-4M4 20v-4h4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {labels.mirrorBtn}
          <span className="ml-1 text-[10px] text-slate-500">({mirrorHost})</span>
        </a>
        {releases && (
          <a
            href={releases}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            {labels.viewAll}
          </a>
        )}
      </div>
    </article>
  );
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
    platform: t('platform'),
    arch: t('arch'),
    version: t('version'),
    size: t('size'),
    downloadBtn: t('downloadBtn'),
    mirrorBtn: t('mirrorBtn'),
    mirrorHintZh: t('mirrorHintZh'),
    mirrorHintEn: t('mirrorHintEn'),
    viewAll: t('viewAll'),
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
      <section className="container-x pt-12 pb-10 sm:pt-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-slate-300">{t('subtitle')}</p>
        </div>
        <SectionContext locale={locale as Locale} section="lan" />
      </section>

      <section className="container-x pb-12">
        <div className="glass-card border-neon-cyan/30 bg-neon-cyan/[0.04]">
          <p className="text-sm leading-relaxed text-slate-200">{t('lanOnlyNote')}</p>
        </div>
      </section>

      <section className="container-x pb-12">
        <header className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-violet/30 text-neon-cyan">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M17 9h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-semibold">{t('clientTitle')}</h2>
            <p className="text-sm text-slate-400">{t('clientSubtitle')}</p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((item) => (
            <DownloadCard key={item.id} item={item} locale={locale as Locale} labels={labels} />
          ))}
        </div>
      </section>

      <section className="container-x pb-20">
        <header className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-violet/30 to-neon-pink/30 text-neon-violet">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-semibold">{t('serverTitle')}</h2>
            <p className="text-sm text-slate-400">{t('serverSubtitle')}</p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((item) => (
            <DownloadCard key={item.id} item={item} locale={locale as Locale} labels={labels} />
          ))}
        </div>
      </section>
    </>
  );
}
