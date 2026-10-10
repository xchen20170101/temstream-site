import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/lib/jsonld';
import { buildOrganizationSchema, buildWebSiteSchema, type Locale } from '@/lib/jsonld-schemas';

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
        {/* Site-wide JSON-LD payloads. Both the `Organization` (global
            site identity) and the per-locale `WebSite` schema are
            mounted here inside `<body>` because the root layout does
            not render `<html>` or `<body>` (next-intl + static-export
            pattern), and the document tree only allows a single
            root. Co-locating the two payloads in the body keeps the
            rendered HTML valid; Google accepts JSON-LD in either
            `<head>` or `<body>`. The `Organization` payload is
            deduplicated by Google's knowledge-graph builder, so the
            same canonical schema is published exactly once per
            page. */}
        <JsonLd
          data={buildOrganizationSchema()}
          id="organization-schema"
        />
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