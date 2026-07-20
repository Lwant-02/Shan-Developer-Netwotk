import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProsePage, ProseSection } from "@/components/content/prose-page";
import { localeAlternates } from "@/lib/site";

type Section = { heading: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const sections = t.raw("sections") as Record<string, Section>;

  return (
    <ProsePage title={t("title")} lead={t("intro")}>
      {Object.entries(sections).map(([key, section]) => (
        <ProseSection key={key} heading={section.heading} body={section.body} />
      ))}
    </ProsePage>
  );
}
