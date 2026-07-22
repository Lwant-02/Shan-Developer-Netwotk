// Mock events for PBI-017's developer profiles. Like `lib/projects.ts`, introduced here
// so a profile can show the events a member hosts — NOT the Events surface itself, which
// is its own future PBI owning the real model and the /events routes. Provisional mock: a
// plain type + array, not a DB schema.
//
// Named `EventItem` to avoid clashing with the DOM `Event` global. `lang` is the event's
// own content language (design.md per-content-language rule). Events are member-hosted and
// online-first (design.md). Mock copy is English (fabricated) — no Shan is invented.

import type { PostLang } from "./feed";

export type EventItem = {
  id: string;
  /** URL key for a future /events/[slug] route; unused until that PBI. */
  slug: string;
  /** Host handle — ties the event to a developer. */
  host: string;
  title: string;
  description: string;
  lang: PostLang;
  startsAtISO: string;
  /** "Online", or a coarse place — never a precise address. */
  location: string;
  online: boolean;
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
    startsAtISO: "2026-07-25T13:00:00Z",
    location: "Online",
    online: true,
  },
  {
    id: "e2",
    slug: "beginner-git-workshop",
    host: "lasho_online",
    title: "Beginner Git workshop",
    description:
      "Branches, commits, and pull requests from scratch, in Shan. No prior Git needed.",
    lang: "en",
    startsAtISO: "2026-08-02T13:00:00Z",
    location: "Online",
    online: true,
  },
  {
    id: "e3",
    slug: "shan-dev-meetup-kengtung",
    host: "keng_tung_js",
    title: "Shan Dev Meetup — Kengtung",
    description:
      "An in-person evening to meet other Shan developers, share what you're building, and swap ideas.",
    lang: "en",
    startsAtISO: "2026-08-09T11:00:00Z",
    location: "Kengtung, Shan State",
    online: false,
  },
  {
    id: "e4",
    slug: "keyboard-testing-sprint",
    host: "tai_builds",
    title: "Shan keyboard testing sprint",
    description:
      "An online sprint to test the GBoard layout with native typists before it's submitted. Feedback welcome.",
    lang: "en",
    startsAtISO: "2026-07-28T12:00:00Z",
    location: "Online",
    online: true,
  },
];

export function getEventsByHost(host: string): EventItem[] {
  return mockEvents.filter((event) => event.host === host);
}
