import type { Metadata } from "next";
import { getNow, getTranslations, setRequestLocale } from "next-intl/server";

import { NotificationList } from "@/components/notifications/notification-list";
import { AppShell } from "@/components/shell/app-shell";
import { listNotifications } from "@/lib/notifications";
import { localeAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Notifications" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/notifications"),
  };
}

// Frontend-only notifications surface (PBI-023): renders a typed mock list and asserts no
// session — a real per-user query replaces `listNotifications()` when Better Auth lands.
// Anonymous-readable and statically prerenderable, like /projects and /events.
export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Notifications");
  const now = await getNow();
  const notifications = listNotifications();

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        <header className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {notifications.length > 0 ? (
          <NotificationList notifications={notifications} now={now} />
        ) : (
          <p className="text-muted-foreground text-sm">{t("empty")}</p>
        )}
      </div>
    </AppShell>
  );
}
