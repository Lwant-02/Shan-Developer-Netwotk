import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CreateForm, type CreateType } from "@/components/create/create-form";
import { AppShell } from "@/components/shell/app-shell";
import { Link } from "@/i18n/navigation";

const TYPES = ["post", "project", "event"] as const;

function isCreateType(value: string): value is CreateType {
  return (TYPES as readonly string[]).includes(value);
}

// Prerender the three composer shells per locale. An unknown type falls through to
// notFound() → the localised 404.
export function generateStaticParams() {
  return TYPES.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  if (!isCreateType(type)) return {};
  const t = await getTranslations({ locale, namespace: "Create" });

  return {
    title: t(`heading_${type}`),
    // A compose form is not a content surface — keep it out of the index.
    robots: { index: false, follow: false },
  };
}

export default async function CreatePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  if (!isCreateType(type)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Create");

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>

        <header className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl">{t(`heading_${type}`)}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(`subtitle_${type}`)}
          </p>
        </header>

        <CreateForm type={type} />
      </div>
    </AppShell>
  );
}
