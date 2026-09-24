import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

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
          ? '通过 ZeroTier、Tailscale、NordVPN Meshnet 等软件定义网络即可穿透，无需暴露 Sunshine 端口。'
          : 'Reach your PC from anywhere using ZeroTier, Tailscale or NordVPN Meshnet — no need to expose Sunshine ports.',
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
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href={`/${locale}/download/`} className="btn-primary">
                {t('ctaPrimary')}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Link>
              <Link href={`/${locale}/tutorial/`} className="btn-ghost">
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>

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
          <Link href={`/${locale}/download/`} className="btn-primary">
            {t('ctaPrimary')}
          </Link>
          <Link href={`/${locale}/tutorial/`} className="btn-ghost">
            {t('ctaSecondary')}
          </Link>
        </div>
      </section>
    </>
  );
}