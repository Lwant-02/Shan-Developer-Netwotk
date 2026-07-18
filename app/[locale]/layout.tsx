import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { siteConfig, siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { fontVariables } from "../fonts";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const home = `/${locale}`;

  return {
    metadataBase: new URL(siteUrl()),
    applicationName: siteConfig.name,
    title: {
      default: siteConfig.title,
      template: `%s · ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    alternates: {
      // Canonical and hreflang here describe the locale root. When real sub-routes
      // land, each page must set its own `alternates` — a blanket layout canonical
      // would otherwise make every page claim the home URL.
      canonical: home,
      // Next types these keys against a BCP-47 union that omits `shn`, a valid
      // ISO 639-3 code. The cast widens that limitation, not a real error.
      languages: {
        shn: "/shn",
        en: "/en",
        "x-default": "/shn",
      } as NonNullable<NonNullable<Metadata["alternates"]>["languages"]>,
    },
    openGraph: {
      type: "website",
      url: home,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      locale,
      // No image: the only logo is 96×96, too small for a link-preview card.
      // Add a ~1200×630 og image before enabling image previews.
    },
    twitter: {
      card: "summary",
      title: siteConfig.title,
      description: siteConfig.description,
    },
    robots: { index: true, follow: true },
    icons: {
      icon: siteConfig.logo,
      shortcut: siteConfig.logo,
      apple: siteConfig.logo,
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "default",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(fontVariables, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
