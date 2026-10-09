import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionContext } from '@/components/SectionContext';

type Locale = 'en' | 'zh';

interface OverviewCardData {
  href: string;
  title: string;
  desc: string;
  cta: string;
  icon: React.ReactNode;
}

const LAN_ICONS: Record<string, React.ReactNode> = {
  download: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  tutorial: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 8h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  usage: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M12 18a6 6 0 1 0-6-6c0 1.5.5 2.5 1.5 3.5L7 18h5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 21h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
};

function OverviewCard({ href, title, desc, cta, icon }: OverviewCardData) {
  return (
    <article className="glass-card group flex h-full flex-col">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-cyan/10 text-neon-cyan">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{desc}</p>
      <div className="mt-auto pt-5">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neon-cyan transition group-hover:text-white"
        >
          {cta}
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
      </div>
    </article>
  );
}

export default async function LanOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(rawLocale);
  const t = await getTranslations('lanOverview');
  const isEn = locale === 'en';

  const cards: OverviewCardData[] = [
    {
      href: `/${rawLocale}/lan-download`,
      title: t('cards.download.title'),
      desc: t('cards.download.desc'),
      cta: t('cards.cta'),
      icon: LAN_ICONS.download,
    },
    {
      href: `/${rawLocale}/lan-tutorial`,
      title: t('cards.tutorial.title'),
      desc: t('cards.tutorial.desc'),
      cta: t('cards.cta'),
      icon: LAN_ICONS.tutorial,
    },
    {
      href: `/${rawLocale}/lan-usage`,
      title: t('cards.usage.title'),
      desc: t('cards.usage.desc'),
      cta: t('cards.cta'),
      icon: LAN_ICONS.usage,
    },
    {
      href: `/${rawLocale}/lan-faq`,
      title: t('cards.faq.title'),
      desc: t('cards.faq.desc'),
      cta: t('cards.cta'),
      icon: LAN_ICONS.faq,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0 bg-hero-radial" aria-hidden />
        <div className="container-x relative pt-12 sm:pt-16">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="chip mb-5">
              <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-neon-cyan" />
              {t('eyebrow')}
            </span>
            <h1 className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-4xl md:text-5xl">
              {t('title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              {t('subtitle')}
            </p>
          </div>

          <SectionContext locale={rawLocale} section="lan" switchHref={`/${rawLocale}/wan`} />
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <OverviewCard key={c.href} {...c} />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed text-slate-300">
          <p className="mb-2 font-medium text-white">
            {isEn ? 'What you will need' : '你需要准备什么'}
          </p>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
              <span>
                {isEn
                  ? 'Sunshine (host) on the gaming PC + Moonlight (client) on the device you want to play on.'
                  : 'Sunshine（服务端）装在被串流的游戏 PC 上；Moonlight（客户端）装在你要玩游戏的设备上。'}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
              <span>
                {isEn
                  ? 'Both devices on the same router / same Wi-Fi subnet. No management portal, no VPN, no port forwarding.'
                  : '两端在同一个路由器 / 同一 Wi-Fi 子网下。免管理端、免 VPN、免端口转发。'}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
              <span>
                {isEn
                  ? 'Nothing is exposed to the public internet — the smallest possible attack surface.'
                  : '全程不暴露到公网，攻击面最小，是家用最推荐的方案。'}
              </span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
