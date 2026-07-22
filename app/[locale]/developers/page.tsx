import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeveloperDirectory } from "@/components/developers/developer-directory";
import { AppShell } from "@/components/shell/app-shell";
import { listDevelopers } from "@/lib/developers";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav" });

  return {
    title: t("developers"),
    alternates: localeAlternates(locale, "/developers"),
  };
}

export default async function DevelopersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AppShell>
      <DeveloperDirectory developers={listDevelopers()} />
    </AppShell>
  );
}
