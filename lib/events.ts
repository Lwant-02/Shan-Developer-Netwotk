// Mock events. Introduced by PBI-017 to list a member's hosted events on a profile, and
// now the data behind the Events surface itself (PBI-021: /events directory + /events/[slug]
// detail). Provisional mock — a plain type + array, NOT a DB schema; real events replace it
// without touching the card.
//
// Named `EventItem` to avoid clashing with the DOM `Event` global. `lang` is the event's
// own content language (design.md per-content-language rule). Events are member-hosted and
// online-first (design.md). Times are stored as UTC ISO and rendered in the reader's locale
// via `Intl` — Myanmar is UTC+06:30, a half-hour offset naive code mangles (design.md).
// Mock copy is English (fabricated) — no Shan is invented; the join URLs are placeholders.

import type { PostLang } from "./feed";

export type EventItem = {
  id: string;
  /** URL key for the /events/[slug] detail route. Unique across the mock. */
  slug: string;
  /** Host handle — ties the event to a developer profile. */
  host: string;
  title: string;
  description: string;
  lang: PostLang;
  /** When the event was posted — distinct from when it starts. UTC ISO. */
  createdAtISO: string;
  /** Start time as a UTC ISO string. Rendered in the reader's locale, never stored local. */
  startsAtISO: string;
  /** "Online", or a coarse place — never a precise address. */
  location: string;
  online: boolean;
  /** Optional event image. Real events need storage (Neon bundles none) — a later PBI. */
  image?: string;
  /** Join link for online events, when known. Physical events have a location instead. */
  joinUrl?: string;
  /** Outbound link to a registration / attendance form, when the host uses one. */
  registerUrl?: string;
  /** Display-only appreciation signal (stars), mirroring projects — not wired. */
  stars: number;
  /** Display-only comment count, mirroring the feed card — not wired. */
  comments: number;
};

export const mockEvents: EventItem[] = [
  {
    id: "e1",
    slug: "intro-to-react-in-shan",
    host: "lasho_online",
    title: "Intro to React, taught in Shan",
    description:
      "A beginner-friendly online session. Bring a laptop and a stable connection; the recording is posted after.",
    lang: "en",
    createdAtISO: "2026-07-10T09:00:00Z",
    startsAtISO: "2026-07-25T13:00:00Z",
    location: "Online",
    online: true,
    image: "/icons/icon-512.png",
    joinUrl: "https://meet.example.com/intro-to-react-in-shan",
    registerUrl: "https://forms.example.com/intro-to-react-in-shan",
    stars: 46,
    comments: 3,
  },
  {
    id: "e2",
    slug: "beginner-git-workshop",
    host: "lasho_online",
    title: "Beginner Git workshop",
    description:
      "Branches, commits, and pull requests from scratch, in Shan. No prior Git needed.",
    lang: "en",
    createdAtISO: "2026-07-15T09:00:00Z",
    startsAtISO: "2026-08-02T13:00:00Z",
    location: "Online",
    online: true,
    joinUrl: "https://meet.example.com/beginner-git-workshop",
    stars: 31,
    comments: 2,
  },
  {
    id: "e3",
    slug: "shan-dev-meetup-kengtung",
    host: "keng_tung_js",
    title: "Shan Dev Meetup — Kengtung",
    description:
      "An in-person evening to meet other Shan developers, share what you're building, and swap ideas.",
    lang: "en",
    createdAtISO: "2026-07-18T09:00:00Z",
    startsAtISO: "2026-08-09T11:00:00Z",
    location: "Kengtung, Shan State",
    online: false,
    image: "/icons/icon-512.png",
    registerUrl: "https://forms.example.com/shan-dev-meetup-kengtung",
    stars: 58,
    comments: 2,
  },
  {
    id: "e4",
    slug: "keyboard-testing-sprint",
    host: "tai_builds",
    title: "Shan keyboard testing sprint",
    description:
      "An online sprint to test the GBoard layout with native typists before it's submitted. Feedback welcome.",
    lang: "en",
    createdAtISO: "2026-07-14T09:00:00Z",
    startsAtISO: "2026-07-28T12:00:00Z",
    location: "Online",
    online: true,
    joinUrl: "https://meet.example.com/keyboard-testing-sprint",
    stars: 27,
    comments: 2,
  },
  {
    id: "e5",
    slug: "shan-unicode-clinic",
    host: "tai_builds",
    title: "Shan Unicode clinic",
    description:
      "A past online clinic on Shan Unicode vs Zawgyi and how to detect and convert legacy text. Recording available.",
    lang: "en",
    createdAtISO: "2026-06-28T09:00:00Z",
    startsAtISO: "2026-07-12T13:00:00Z",
    location: "Online",
    online: true,
    joinUrl: "https://meet.example.com/shan-unicode-clinic",
    stars: 39,
    comments: 2,
  },
];

export function getEventsByHost(host: string): EventItem[] {
  return mockEvents.filter((event) => event.host === host);
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return mockEvents.find((event) => event.slug === slug);
}

export function listEvents(): EventItem[] {
  return mockEvents;
}

// Split events into upcoming vs past relative to `nowMs` (default: now). Upcoming are
// sorted soonest-first, past most-recent-first. Kept out of the component so the impure
// `Date.now()` default isn't evaluated during render.
export function partitionEventsByTime(
  events: EventItem[],
  nowMs: number = Date.now(),
): { upcoming: EventItem[]; past: EventItem[] } {
  const ms = (e: EventItem) => new Date(e.startsAtISO).getTime();
  const upcoming = events
    .filter((e) => ms(e) >= nowMs)
    .sort((a, b) => ms(a) - ms(b));
  const past = events.filter((e) => ms(e) < nowMs).sort((a, b) => ms(b) - ms(a));
  return { upcoming, past };
}
