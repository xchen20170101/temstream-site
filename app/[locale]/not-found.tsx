import Link from 'next/link';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

/**
 * Locale-aware 404. Lives under `app/[locale]/not-found.tsx` so next-intl
 * can resolve the surrounding locale and serve Chinese on `/zh/...`
 * mismatches and English on `/en/...` mismatches.
 *
 * Important: Next.js renders `not-found.tsx` with **empty props**
 * (no `params`), so the URL's locale is not available here. We read
 * it from next-intl's request context (set by the surrounding layout's
 * `setRequestLocale`) and fall back to the default locale if the
 * context hasn't been populated yet — e.g. when a page deeper in the
 * tree throws `notFound()` before the layout's effect runs.
 *
 * The non-localised root `app/not-found.tsx` still exists as a
 * fallback for paths that don't match any locale at all (e.g. `/foo-bar`).
 */
export default async function LocaleNotFound() {
  // `getLocale()` returns whatever the surrounding server context has.
  // Wrap in try/catch so an unset context doesn't take the whole
  // 404 page down — the worst case is we show Chinese on `/en/...`,
  // which is still better than a runtime error.
  let locale: string = routing.defaultLocale;
  try {
    const fromCtx = await getLocale();
    if (fromCtx) locale = fromCtx;
  } catch {
    // getLocale threw (e.g. outside a request context) — keep default
  }

  // `setRequestLocale` is a no-op in dev but required for static
  // rendering in next-intl 3.x. Calling it here also makes
  // `getTranslations` happy in case the context was empty.
  setRequestLocale(locale);
  const t = await getTranslations('notFound');

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-6xl font-bold text-transparent sm:text-7xl">
          {t('code')}
        </p>
        <h1 className="mt-4 text-xl font-semibold text-white sm:text-2xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-slate-400">{t('desc')}</p>
        <Link href={`/${locale}`} className="btn-primary mt-8">
          {t('back')}
        </Link>
      </div>
    </main>
  );
}
