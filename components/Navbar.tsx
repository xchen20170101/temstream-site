'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';

type NavLink = { href: string; key: 'home' | 'download' | 'tutorial' | 'faq' };

const links: NavLink[] = [
  { href: '/', key: 'home' },
  { href: '/download', key: 'download' },
  { href: '/tutorial', key: 'tutorial' },
  { href: '/faq', key: 'faq' },
];

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname() ?? '/';
  const normalized = pathname.replace(`/${locale}`, '') || '/';

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-base/70 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center" aria-label="temstream home">
          <Logo>temstream</Logo>
          <span className="ml-3 hidden text-xs text-slate-400 md:inline">{t('tagline')}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = normalized === link.href;
            return (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`relative rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {active && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-white/10" />
                )}
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}