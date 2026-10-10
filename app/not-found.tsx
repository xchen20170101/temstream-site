import Link from 'next/link';
import { routing } from '@/i18n/routing';

/**
 * Root-level 404 fallback. Only renders for URLs that don't match any
 * locale prefix at all (e.g. `/foo-bar`). The actual locale-aware
 * 404 lives in `app/[locale]/not-found.tsx` and is preferred whenever
 * the route resolves a locale.
 *
 * The link points at the default locale's home (`/zh`) since we can't
 * read the user's locale from this file — next-intl only exposes
 * locale context under `app/[locale]/`.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-6xl font-bold text-transparent">
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href={`/${routing.defaultLocale}`} className="btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </main>
  );
}
