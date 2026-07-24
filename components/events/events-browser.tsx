"use client";

import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";

import type { EventItem } from "@/lib/events";
import { cn } from "@/lib/utils";
import { EventCard, type EventStatus } from "./event-card";

// The /events directory browser (PBI-021). Events arrive already split into upcoming vs
// past (partitionEventsByTime); this is the one interactive leaf — a filter between the two
// — so it holds the selected tab in state. Each card carries an upcoming/past badge.
export function EventsBrowser({
  upcoming,
  past,
}: {
  upcoming: EventItem[];
  past: EventItem[];
}) {
  const t = useTranslations("Events");
  const [tab, setTab] = useState<EventStatus>(
    upcoming.length > 0 ? "upcoming" : "past",
  );

  const events = tab === "upcoming" ? upcoming : past;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted flex w-fit items-center gap-1 rounded-lg p-1 text-sm">
        <Tab
          active={tab === "upcoming"}
          onClick={() => setTab("upcoming")}
          label={t("upcoming")}
          count={upcoming.length}
        />
        <Tab
          active={tab === "past"}
          onClick={() => setTab("past")}
          label={t("past")}
          count={past.length}
        />
      </div>

      {events.length > 0 ? (
        <div className="flex flex-col gap-1">
          {events.map((event, index) => (
            <Fragment key={event.id}>
              {index > 0 && <hr className="border-border mx-2 my-1" />}
              <EventCard event={event} status={tab} />
            </Fragment>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground px-2 text-sm">
          {tab === "upcoming" ? t("emptyUpcoming") : t("emptyPast")}
        </p>
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg px-3 py-1.5 transition-colors",
        active
          ? "bg-background text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label} ({count})
    </button>
  );
}
