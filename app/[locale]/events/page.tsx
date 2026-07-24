import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventsBrowser } from "@/components/events/events-browser";
import { AppShell } from "@/components/shell/app-shell";
import { listEvents, partitionEventsByTime } from "@/lib/events";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Events" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/events"),
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Events");
  const { upcoming, past } = partitionEventsByTime(listEvents());
  const hasEvents = upcoming.length > 0 || past.length > 0;

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        <header className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {hasEvents ? (
          <EventsBrowser upcoming={upcoming} past={past} />
        ) : (
          <p className="text-muted-foreground text-sm">{t("empty")}</p>
        )}
      </div>
    </AppShell>
  );
}
