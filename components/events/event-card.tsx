import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useLocale, useNow, useTranslations } from "next-intl";

import { CommentButton } from "@/components/content/comment-button";
import { ShareButton } from "@/components/content/share-button";
import { StarButton } from "@/components/projects/star-button";
import { Link } from "@/i18n/navigation";
import { formatDateEn, relativeTimeEn } from "@/lib/datetime";
import type { EventItem } from "@/lib/events";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EventMenu } from "./event-menu";

export type EventStatus = "upcoming" | "past";

// An event tile — reused by the /events directory (PBI-021) and the developer profile
// (PBI-017). The whole card links to the detail page (the join link lives there, not on the
// card). Content carries its own language (`lang`). Times are stored UTC and formatted per
// the UI locale; location is "Online" or a coarse place, never a precise address. `status`,
// when given, shows an upcoming/past badge — the profile omits it.
export function EventCard({
  event,
  status,
  className,
}: {
  event: EventItem;
  status?: EventStatus;
  className?: string;
}) {
  const now = useNow();
  const t = useTranslations("Events");
  const locale = useLocale();
  const href = `/events/${event.slug}`;

  return (
    // `relative` anchors the title's stretched link so the whole card routes to the detail
    // page; nothing else in the card is interactive.
    <article
      className={cn(
        "group/event hover:bg-muted/60 relative flex cursor-pointer flex-col gap-2 rounded-lg p-4 transition-colors",
        className,
      )}
    >
      <div lang={event.lang} className="flex flex-col gap-1">
        {status && (
          <span
            className={cn(
              "w-fit rounded-lg px-2 py-0.5 text-xs",
              status === "upcoming"
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {t(status)}
          </span>
        )}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-foreground text-base leading-snug">
            <Link href={href} className="after:absolute after:inset-0">
              {event.title}
            </Link>
          </h2>
          {/* z-10 keeps the menu clickable above the card's stretched title link. */}
          <div className="relative z-10 shrink-0">
            <EventMenu />
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {event.description}
        </p>
      </div>

      {event.image && (
        <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={event.image}
            alt=""
            fill
            sizes="(min-width: 768px) 42rem, 100vw"
            className="object-contain"
          />
        </div>
      )}

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-1">
          <Calendar className="size-3.5" />
          <time dateTime={event.startsAtISO}>
            {formatDateEn(event.startsAtISO, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {event.location}
        </span>
        <span aria-hidden className="opacity-50">
          ·
        </span>
        <time dateTime={event.createdAtISO}>
          {t("posted", { time: relativeTimeEn(event.createdAtISO, now) })}
        </time>
      </div>

      <footer className="flex flex-wrap items-center gap-1 text-xs">
        <StarButton
          stars={event.stars}
          className="group-hover/event:bg-background relative z-10"
        />
        <CommentButton
          href={href}
          count={event.comments}
          label={t("comments")}
          className="group-hover/event:bg-background"
        />
        <ShareButton
          url={`${siteUrl()}/${locale}${href}`}
          title={event.title}
          label={t("share")}
          className="group-hover/event:bg-background relative z-10"
        />
      </footer>
    </article>
  );
}
