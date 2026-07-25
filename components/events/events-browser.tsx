"use client";

import { Fragment, useState } from "react";

import { SortTabs } from "@/components/content/sort-tabs";
import type { EventItem } from "@/lib/events";
import { sortItems, type SortKey } from "@/lib/sort";
import { EventCard, type EventStatus } from "./event-card";

// The /events directory browser (PBI-021). Uses the same sort control as the feed and
// projects — no separate upcoming/past filter. Events still arrive server-partitioned so
// each card keeps its correct upcoming/past badge without reading the clock on the client;
// the browser merges them into one list and sorts across both.
export function EventsBrowser({
  upcoming,
  past,
}: {
  upcoming: EventItem[];
  past: EventItem[];
}) {
  const [sort, setSort] = useState<SortKey>("newest");

  const tagged = [
    ...upcoming.map((event) => ({ event, status: "upcoming" as EventStatus })),
    ...past.map((event) => ({ event, status: "past" as EventStatus })),
  ];
  const events = sortItems(tagged, sort, {
    createdAtISO: (item) => item.event.createdAtISO,
    score: (item) => item.event.stars,
  });

  return (
    <div className="flex flex-col gap-4">
      <SortTabs value={sort} onChange={setSort} />

      <div className="flex flex-col gap-1">
        {events.map(({ event, status }, index) => (
          <Fragment key={event.id}>
            {index > 0 && <hr className="border-border mx-2 my-1" />}
            <EventCard event={event} status={status} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
