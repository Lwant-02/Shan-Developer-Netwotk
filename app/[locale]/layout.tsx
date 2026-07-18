import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import "../globals.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

const aj00 = localFont({
  src: "../../public/fonts/aj00.ttf",
  variable: "--font-aj00",
  weight: "400",
  display: "swap",
});

const aj12 = localFont({
  src: "../../public/fonts/aj12.ttf",
  variable: "--font-aj12",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shan Developer Network",
  description: "Shan Developer Network",
  icons: {
    icon: "/icons/logo.png",
  },
  alternates: {
    // Next types these keys against a BCP-47 union that omits `shn`, a valid
    // ISO 639-3 code. The cast widens that limitation, not a real error.
    languages: {
      shn: "/shn",
      en: "/en",
      "x-default": "/shn",
    } as NonNullable<NonNullable<Metadata["alternates"]>["languages"]>,
  },
};

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
      className={`${googleSans.variable} ${aj00.variable} ${aj12.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
