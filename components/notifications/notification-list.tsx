"use client";

import { CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { Notification } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { NotificationRow } from "./notification-row";

// The list is the smallest boundary that owns "all read" state, so it's the one
// `"use client"` leaf here (the page and the rows stay server-first). "Mark all as read"
// is frontend-only, matching the mock surface (PBI-023): it clears the unread dots in
// local state and persists nothing — a real mutation needs auth + a rate limit. Reloading
// brings them back, which is the honest behaviour for a mock.
export function NotificationList({
  notifications,
  now,
}: {
  notifications: Notification[];
  now: Date;
}) {
  const t = useTranslations("Notifications");
  const [cleared, setCleared] = useState(false);
  const hasUnread = !cleared && notifications.some((n) => n.unread);

  return (
    <div className="flex flex-col gap-3">
      {hasUnread && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setCleared(true)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "cursor-pointer font-normal",
            )}
          >
            <CheckCheck className="size-4" />
            {t("markAllRead")}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={cleared ? { ...notification, unread: false } : notification}
            now={now}
          />
        ))}
      </div>
    </div>
  );
}
