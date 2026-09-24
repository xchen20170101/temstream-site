'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');

  const official = [
    { label: 'Moonlight', href: 'https://moonlight-stream.org/' },
    { label: 'Sunshine', href: 'https://github.com/LizardByte/Sunshine' },
    { label: 'LizardByte', href: 'https://lizardbyte.dev/' },
  ];
  const community = [
    { label: 'Discord', href: 'https://discord.gg/moonlight' },
    { label: 'GitHub', href: 'https://github.com/moonlight-stream' },
    { label: 'Docs', href: 'https://docs.lizardbyte.dev/projects/sunshine' },
  ];

  return (
    <footer className="mt-24 border-t border-white/5 bg-bg-surface/40">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-slate-400">{t('tagline')}</p>
            <p className="max-w-xs text-xs text-slate-500">{t('disclaimer')}</p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t('officialLinks')}
            </h4>
            <ul className="space-y-2 text-sm">
              {official.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-300 transition hover:text-neon-cyan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t('communityLinks')}
            </h4>
            <ul className="space-y-2 text-sm">
              {community.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-300 transition hover:text-neon-cyan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} temstream · {locale.toUpperCase()}</span>
          <span>Built with Next.js · Deployed on Vercel</span>
        </div>
      </div>
    </footer>
  );
}