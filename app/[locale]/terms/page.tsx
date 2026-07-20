import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProsePage, ProseSection } from "@/components/content/prose-page";
import { localeAlternates } from "@/lib/site";

// English-only by decision: this is legal copy and stays in one authoritative language,
// so the `Terms` strings in messages/shn.json mirror the English on purpose and are
// excluded from the translation brief. See AGENTS.md ("Shan strings are translated").
type Section = { heading: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/terms"),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Terms");
  const sections = t.raw("sections") as Record<string, Section>;

  return (
    <ProsePage title={t("title")} lead={t("intro")}>
      {Object.entries(sections).map(([key, section]) => (
        <ProseSection key={key} heading={section.heading} body={section.body} />
      ))}
    </ProsePage>
  );
}
