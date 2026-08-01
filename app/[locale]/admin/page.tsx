import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AdminOverview } from "@/components/admin/admin-overview";
import { ReportQueue } from "@/components/admin/report-queue";
import { AppShell } from "@/components/shell/app-shell";
import { listReports } from "@/lib/reports";
import { getViewer } from "@/lib/viewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // `getViewer()` is `null` in production, so this route renders the localised 404 on the
  // live site and the page never reaches the HTML. It is a **preview gate, not
  // authorization** — the real check arrives with Better Auth.
  const viewer = getViewer();
  if (!viewer?.moderator) notFound();

  const t = await getTranslations("Admin");
  const now = new Date();

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-2">
        <header className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        <AdminOverview />
        {/* Reports are read here, not inside the queue, so swapping the mock for a real
            query stays a server-side change. */}
        <ReportQueue reports={listReports()} now={now} />
      </div>
    </AppShell>
  );
}
