'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const [isPending, startTransition] = useTransition();

  const currentLocale = (routing.locales.find((l) => pathname.startsWith(`/${l}`)) ??
    routing.defaultLocale) as string;

  function onChange(next: string) {
    if (next === currentLocale) return;
    const segments = pathname.split('/');
    if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const target = segments.join('/') || `/${next}`;
    startTransition(() => router.replace(target));
  }

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-xs">
      {routing.locales.map((loc) => {
        const active = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => onChange(loc)}
            disabled={isPending}
            className={`min-w-[40px] rounded-full px-2.5 py-1 font-medium uppercase transition ${
              active
                ? 'bg-gradient-to-r from-neon-violet to-neon-cyan text-white shadow-neon'
                : 'text-slate-300 hover:text-white'
            }`}
            aria-pressed={active}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}