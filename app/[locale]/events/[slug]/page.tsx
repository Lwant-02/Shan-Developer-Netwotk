import type { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  MapPin,
  MessageSquare,
  Video,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNow, getTranslations, setRequestLocale } from "next-intl/server";

import { ShareButton } from "@/components/content/share-button";
import { EventMenu } from "@/components/events/event-menu";
import { CommentThread } from "@/components/feed/comment-thread";
import { HandleLink } from "@/components/feed/handle-link";
import { StarButton } from "@/components/projects/star-button";
import { AppShell } from "@/components/shell/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCommentsFor } from "@/lib/comments";
import { formatDateEn, relativeTimeEn } from "@/lib/datetime";
import { getEventBySlug, mockEvents } from "@/lib/events";
import { localeAlternates } from "@/lib/site";
import { cn } from "@/lib/utils";

// Prerender every known event at build time (one per slug, per locale from the parent
// layout). An unknown slug falls through to notFound() → the localised 404.
export function generateStaticParams() {
  return mockEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  return {
    title: event.title,
    description: event.description,
    alternates: localeAlternates(locale, `/events/${slug}`),
    openGraph: {
      type: "article",
      url: `/${locale}/events/${slug}`,
      title: event.title,
      description: event.description,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const event = getEventBySlug(slug);
  if (!event) notFound();

  const t = await getTranslations("Events");
  const now = await getNow();
  const comments = getCommentsFor(event.slug);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        <Link
          href="/events"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("backToEvents")}
        </Link>

        <article className="flex flex-col gap-4">
          <div lang={event.lang} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-foreground text-2xl leading-snug">
                {event.title}
              </h1>
              <div className="shrink-0">
                <EventMenu />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              {t.rich("by", {
                handle: () => (
                  <HandleLink
                    handle={event.host}
                    className="text-foreground hover:text-muted-foreground transition-colors"
                  />
                ),
              })}
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

          <dl className="text-muted-foreground flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 shrink-0" />
              {/* Stored UTC, rendered in the reader's locale; timeZoneName makes the
                  offset (Myanmar UTC+06:30) legible rather than ambiguous. */}
              <time dateTime={event.startsAtISO}>
                {formatDateEn(event.startsAtISO, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              {event.online ? (
                <Video className="size-4 shrink-0" />
              ) : (
                <MapPin className="size-4 shrink-0" />
              )}
              <span>{event.online ? t("online") : event.location}</span>
            </div>
            <div className="text-xs opacity-80">
              <time dateTime={event.createdAtISO}>
                {t("posted", {
                  time: relativeTimeEn(event.createdAtISO, now),
                })}
              </time>
            </div>
          </dl>

          <p
            lang={event.lang}
            className="text-muted-foreground text-base leading-relaxed"
          >
            {event.description}
          </p>

          <footer className="flex flex-wrap items-center gap-1 text-sm">
            <StarButton stars={event.stars} />
            <span
              aria-label={t("comments")}
              className="text-muted-foreground bg-muted flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
            >
              <MessageSquare className="size-4" />
              <span className="tabular-nums">{comments.length}</span>
            </span>
            <ShareButton label={t("share")} />
          </footer>

          {(event.registerUrl || (event.online && event.joinUrl)) && (
            <div className="flex flex-wrap gap-2">
              {event.registerUrl && (
                <a
                  href={event.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "cursor-pointer gap-2 font-normal",
                  )}
                >
                  <ClipboardList className="size-4" />
                  {t("register")}
                </a>
              )}
              {event.online && event.joinUrl && (
                <a
                  href={event.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "cursor-pointer gap-2 font-normal",
                  )}
                >
                  <Video className="size-4" />
                  {t("join")}
                </a>
              )}
            </div>
          )}
        </article>

        <hr className="border-border" />

        <CommentThread comments={comments} />
      </div>
    </AppShell>
  );
}
