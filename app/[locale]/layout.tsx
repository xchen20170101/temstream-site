import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/lib/jsonld';
import { buildWebSiteSchema, type Locale } from '@/lib/jsonld-schemas';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        {/* Per-locale `WebSite` JSON-LD. Mounted in the locale
            layout (not the root layout) because the schema needs
            the active locale for its `inLanguage` and `@id`
            fields. The global `Organization` is mounted in the
            root layout, so every page already inherits a
            `publisher` relationship via the `WebSite.publisher`
            `@id` we set there. */}
        <JsonLd
          data={buildWebSiteSchema(locale as Locale)}
          id="website-schema"
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}