import Link from 'next/link';
import { routing } from '@/i18n/routing';

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