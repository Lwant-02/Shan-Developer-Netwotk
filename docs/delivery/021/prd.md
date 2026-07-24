# PBI-021 — Events surface — directory + detail (shell + mock data)

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-07-24 |
| **Depends on** | PBI-017 (mock `lib/events.ts` + provisional `event-card.tsx`, Done) |
| **Relates to** | PBI-010 (home feed pattern, Done), PBI-016 (detail-page precedent, Done), PBI-020 (Projects surface — the direct sibling, Done) |

## Problem

Events is one of the four 🟢-decided content types — "members can host their own,
including online sessions … online-first, not conference-first" (`design.md`) — but it
has no surface. The "Events" item in the left nav is disabled with a "soon" cue:

```
components/shell/left-nav.tsx:24
{ key: "events", icon: Calendar },   // no href → rendered disabled
```

PBI-017 introduced `lib/events.ts` (4 mock events, an `EventItem` type) and
`components/events/event-card.tsx` **only so a developer profile could list the events a
member hosts** — the file says so in its own header ("NOT the Events surface itself,
which is its own future PBI owning the real model and the /events routes"). As a result:

- There is **no `/events` route** — `app/[locale]/` has `page.tsx`, `about`, `terms`,
  `privacy`, `developers`, `post`, `projects`, and the 404 catch-all, but nothing for
  events.
- The existing `EventCard` renders a title, a clamped description, a formatted start
  time, and a location, but **links nowhere** — there is no page to open an event on,
  even though `EventItem` already carries a `slug` reserved "for a future /events/[slug]
  route".
- The mock `EventItem` shape has `online` and `location` but **no join link**, so an
  online event — the format `design.md` calls the primary case — has no way to express
  the one action a reader needs ("where do I join?"). `design.md`'s Event model sketch
  lists a **join link** as a field.

A member who wants to host a session has no page to point people at, and the nav
advertises a section that goes nowhere.

## Why it matters

Reading is the whole anonymous-visitor experience and the recruiting mechanism: posts,
projects, profiles, and **events** must render **without a session** and stay indexable
(`AGENTS.md`). Member-hosted online sessions are a first-class reason this platform
exists — a Shan-language React session, a Git workshop taught in Shan, a local meetup in
Kengtung — and no global platform gathers **Shan** developers' events in one Shan-first,
locality-aware place.

As with PBI-010, PBI-016, and PBI-020, no database or auth exists, so a *real* Events
feature is impossible now. This PBI builds the **directory + detail layout against the
existing typed mock**, so the read experience is real and reviewable and real data drops
in later without reworking the UI. It also gives the provisional card a destination and
gives the disabled nav item somewhere to go — finishing the fourth and last content
surface in the PBI-010 → 016 → 017 → 020 series.

## Scope

A browseable Events section — a list of events and a per-event read view — rendered from
the existing typed mock data.

**In scope:**

- An **`/events` directory route** under `app/[locale]/` — a **single-column list** of
  event cards, matching the home feed's column and the Projects surface (PBI-020).
  Because time is an event's primary axis, the list is **ordered by start time** and
  **separates upcoming from past** events (past events stay readable — they may have a
  recording — but are visually secondary and sorted after upcoming ones).
- The **existing `EventCard`, reused** (redesigned only as far as giving it a link to its
  detail page and any meta the list needs). It already shows title, clamped description,
  formatted start time, and location; the card links to the event's **detail page**.
- An **`/events/[slug]` detail route** rendering one event: title, host (linking to the
  existing profile via `HandleLink`), per-event content-language tag, full description,
  the **start time rendered in the reader's locale** (with the timezone shown), an
  **online / physical** indicator, the coarse location for physical events, and a
  **Join** action for online events when a join link is present. A **back to events**
  affordance returns the reader.
- **Enable the "Events" nav item** — give it an `href` so it stops rendering as "soon".
- **Signed-out reading:** every page renders with no session and stays indexable.

**Out of scope — deliberately (each a later PBI or decision):**

- Real events, a database, or any data model beyond the mock's TypeScript shape.
- **Creating / editing / deleting / RSVPing to an event** — needs auth + a write endpoint
  + a rate limit (`AGENTS.md` requires one on every write path). No attendee list, no
  "going" count.
- **Calendar export (`.ics`), reminders, or notifications** — a later enhancement, not
  the read view.
- **Filtering / search / sort controls / pagination** beyond the built-in upcoming/past
  ordering — a flat ordered list is enough for the mock; Myanmar-script search is its own
  open question.
- **A map or precise address** for physical events — location stays **coarse**, never a
  precise address (`design.md` identity-safety rule); no map embed.
- **Timezone selection UI.** Times are stored UTC and rendered in the reader's locale via
  `Intl`; there is no per-user timezone picker in this PBI.
- Projects/profile surfaces (their own PBIs); an event's host handle links to the
  existing profile.

## Conditions of Satisfaction

1. An **`/events` directory route** exists under `app/[locale]/` and renders the events
   from the typed mock source (`lib/events.ts`) as a **single-column list**, reusing that
   data — not a hand-duplicated copy. `/shn` and `/en` both resolve it.
2. The list is **ordered by start time and separates upcoming from past** events relative
   to now; upcoming events come first. Past events remain readable but are secondary.
3. An **`/events/[slug]` detail route** exists and renders a single event from the same
   mock, keyed on **`slug`**; an unknown slug calls `notFound()` and reaches the localised
   404 (via the `app/[locale]/[...rest]` catch-all). Both locales resolve valid slugs.
4. Both routes render **fully logged out** — no session required, nothing gated behind
   auth. (Verified by loading them with no auth.)
5. The **event card links to its detail page** (not to a host or an external link), and is
   the **same `EventCard` reused** by the directory and the profile — not a fork. The
   profile's existing use still reads correctly after any change.
6. The detail view shows the **full description** (not the card's clamped excerpt), the
   **host** (linking to the profile), the start time **rendered in the reader's locale
   with its timezone**, an **online / physical** indicator, the coarse location for
   physical events, and a **Join link for online events only when present** — rendered
   `target="_blank"` with `rel="noopener noreferrer"`.
7. **Timezone is handled correctly:** times are stored as **UTC ISO** in the mock and
   rendered in the reader's locale via `Intl` (`next-intl`'s `useFormatter`), so Myanmar's
   **UTC+06:30** half-hour offset renders correctly and is not hard-coded or mangled
   (`design.md`: store UTC, render local). The `<time dateTime>` attribute carries the UTC
   ISO value.
8. The mock **`EventItem` shape expresses the join link** — an **optional `joinUrl`** for
   online events — added as a plain TypeScript field (not a DB schema), keeping the
   existing `slug`, `host`, `title`, `description`, `lang`, `startsAtISO`, `location`, and
   `online` fields so real events replace it without touching the card.
9. The **"Events" nav item is enabled** (has an `href`) and no longer shows the "soon"
   cue; it routes to `/events`.
10. **Per-event content-language tag:** each event carries its own `lang`, independent of
    UI locale, rendered via the existing font stack. Any Shan sample content is **real
    Shan** (owner-supplied) or the sample stays English — no fabricated Shan (same rule as
    PBI-010).
11. **Mobile-first:** at ~360px both pages are a single readable column and the body does
    **not** scroll horizontally; the meta and any action buttons wrap rather than overflow.
12. **Monochrome, `rounded-lg` only, no `font-bold` on any text** (content can contain
    Shan); semantic tokens only; reuses existing components (`EventCard`, `buttonVariants`,
    `Reveal`, `HandleLink`, shadcn primitives via the CLI) before adding any new primitive.
13. **Server-Component-first:** the pages, the directory list, and the card are Server
    Components; `"use client"` appears only on an interactive leaf justified by one of the
    four `AGENTS.md` triggers.
14. `lint`, `build`, and `test` pass, and a test asserts the events surface renders **for
    an anonymous visitor** (following `__tests__/page.test.tsx`). Note Vitest cannot render
    async Server Components — if a page is async, cover a synchronous sub-component and
    verify the rest by running the app.

## Notes

- **Join link — the one new field.** The mock `EventItem` grows an optional `joinUrl`
  (online events only). Keep it optional; physical events have a location instead. This is
  the events analogue of PBI-020 splitting `Project.url` into typed links — the model
  sketch in `design.md` already lists a join link.
- **Upcoming vs past is derived, not stored.** Compute it from `startsAtISO` against the
  current time at render; don't add a status field. The mock dates were seeded around
  late-July / August 2026 — some are already past relative to a 2026-07-24 "now", which is
  useful for exercising both branches. Whoever implements should not assume all mock
  events are upcoming.
- **Timezone is the trap.** `design.md` calls out Myanmar's UTC+06:30 as an offset "naive
  timezone code routinely mangles". Store UTC, render local via `Intl` — the existing
  `EventCard` already uses `useFormatter().dateTime`, which does this correctly; the detail
  page must do the same and additionally **show which timezone** the reader is seeing (e.g.
  a `timeZoneName` part), so a reader in Yangon and one elsewhere both understand the time.
- **Location stays coarse.** "Online" or a coarse place ("Kengtung, Shan State") — never a
  precise address, and no map. This is an identity-safety requirement (`design.md`), not a
  nicety.
- **Bilingual chrome.** New strings (e.g. "Events", "Upcoming", "Past", "Back to events",
  "Join online", "Online", "Hosted by {handle}", "No events yet") need Shan + English. Per
  the current i18n rule, wire English and hand off Shan for owner review before merge — do
  not invent Shan; do not leave copy untranslated.
- **Reuse ladder applies.** The likely new composites are the `/events` list and the detail
  layout; they live in `components/events/`, not `components/ui/`. The `EventCard`, the
  profile's `HandleLink`, `Reveal`, and `buttonVariants` already exist — factor/reuse rather
  than fork. This mirrors PBI-020's structure closely; follow it.
- **Async Server Components + tests.** If a page reads `params` (a Promise) it is async and
  Vitest can't render it directly; keep a testable synchronous piece (the card or the list)
  or add coverage as a plain render of a sub-component, per PBI-016 and PBI-020.
- Keep this to the **read view**. If create/edit, RSVP, attendee counts, or `.ics` export
  starts creeping in during breakdown, that is a separate PBI (auth/write-path), not this
  one.
