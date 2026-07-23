import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProjectList } from "@/components/projects/project-list";
import { AppShell } from "@/components/shell/app-shell";
import { listProjects } from "@/lib/projects";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/projects"),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const projects = listProjects();

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        <header className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {projects.length > 0 ? (
          <ProjectList projects={projects} />
        ) : (
          <p className="text-muted-foreground text-sm">{t("empty")}</p>
        )}
      </div>
    </AppShell>
  );
}
