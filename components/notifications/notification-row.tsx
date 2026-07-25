import { CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";

import { HandleLink } from "@/components/feed/handle-link";
import { Link } from "@/i18n/navigation";
import { relativeTimeEn } from "@/lib/datetime";
import type { Notification } from "@/lib/notifications";
import { cn } from "@/lib/utils";

// One notification: an actor's initials (or a calendar mark for an event reminder), the
// action, the thing it points to, and a relative time. The whole row links to the target
// (PBI-023); the actor handle sits above that stretched link so it can route to the
// profile separately, the same z-10 trick the feed/event cards use. Display-only — the
// unread dot asserts no session and nothing here is mutable (no "mark as read" without
// auth + a rate limit). Times use the `en` helper so the row renders identically on
// server and client.
const ACTION_KEY: Record<Notification["kind"], string> = {
  comment: "actionComment",
  like: "actionLike",
  star: "actionStar",
  follow: "actionFollow",
  "event-reminder": "actionEvent",
};

export function NotificationRow({
  notification,
  now,
}: {
  notification: Notification;
  now: Date;
}) {
  const t = useTranslations("Notifications");
  const action = t(ACTION_KEY[notification.kind]);

  return (
    <article
      className={cn(
        "hover:bg-muted/60 relative flex items-start gap-3 rounded-lg p-4 transition-colors",
        notification.unread && "bg-muted/30",
      )}
    >
      {notification.actor ? (
        <span
          aria-hidden
          className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] uppercase"
        >
          {notification.actor.slice(0, 2)}
        </span>
      ) : (
        <span
          aria-hidden
          className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full"
        >
          <CalendarClock className="size-4" />
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-foreground text-sm">
          {notification.actor && (
            <>
              <HandleLink
                handle={notification.actor}
                className="text-foreground hover:text-muted-foreground relative z-10"
              />{" "}
            </>
          )}
          {action}
        </p>
        {notification.targetTitle && (
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {notification.targetTitle}
          </p>
        )}
        <time
          dateTime={notification.createdAtISO}
          className="text-muted-foreground text-xs"
        >
          {relativeTimeEn(notification.createdAtISO, now)}
        </time>
      </div>

      {notification.unread && (
        <span
          aria-label={t("unread")}
          className="bg-primary mt-1.5 size-2 shrink-0 rounded-full"
        />
      )}

      {/* Stretched link over the whole row; the actor handle above (z-10) stays separately
          clickable. */}
      <Link
        href={notification.href}
        aria-label={notification.targetTitle ?? action}
        className="absolute inset-0"
      />
    </article>
  );
}
