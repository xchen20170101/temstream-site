'use client';

import { useTranslations } from 'next-intl';
import { Logo } from './Logo';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');

  return (
    <footer className="mt-24 border-t border-white/5 bg-bg-surface/40">
      <div className="container-x py-12">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-xs text-slate-500">{t('disclaimer')}</p>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} temstream · {locale.toUpperCase()}</span>
        </div>
      </div>
    </footer>
  );
}