import { Calendar, MapPin } from "lucide-react";
import { useFormatter } from "next-intl";

import type { EventItem } from "@/lib/events";

// An event tile — reused by the developer profile now (PBI-017) and the Events surface
// when it lands. Content carries its own language (`lang`). Date is formatted per the UI
// locale; location is "Online" or a coarse place, never a precise address.
export function EventCard({ event }: { event: EventItem }) {
  const format = useFormatter();

  return (
    <article className="border-border flex flex-col gap-2 rounded-lg border p-4">
      <div lang={event.lang} className="flex flex-col gap-1">
        <h3 className="text-foreground text-base leading-snug">{event.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-1">
          <Calendar className="size-3.5" />
          <time dateTime={event.startsAtISO}>
            {format.dateTime(new Date(event.startsAtISO), {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {event.location}
        </span>
      </div>
    </article>
  );
}
