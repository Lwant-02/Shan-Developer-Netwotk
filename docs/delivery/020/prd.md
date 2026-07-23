# PBI-020 — Projects surface — directory + detail (shell + mock data)

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-23 |
| **Completed** | 2026-07-24 |
| **Depends on** | PBI-017 (mock `lib/projects.ts` + provisional `project-card.tsx`, Done) |
| **Relates to** | PBI-010 (home feed pattern, Done), PBI-016 (detail-page precedent, Done), PBI-018 (profile links/QR, Done) |

## Problem

Projects is one of the three 🟢-decided content types ("share what you've made",
`design.md`), but it has no surface. The "Projects" item in the left nav is disabled with
a "soon" cue:

```
components/shell/left-nav.tsx:24
{ key: "projects", icon: FolderGit2 },   // no href → rendered disabled
```

PBI-017 introduced `lib/projects.ts` (7 mock projects) and `components/projects/project-card.tsx`
**only so a developer profile could list the work a member has built** — the file says so
in its own header ("NOT the Projects surface itself, which is its own future PBI that owns
the real data model and the /projects routes"). As a result:

- There is **no `/projects` route** — `app/[locale]/` has `page.tsx`, `about`, `terms`,
  `privacy`, `developers`, `post`, and the 404 catch-all, but nothing for projects.
- The provisional card is thin and off-pattern: its **title links straight out to the
  repo** (`project-card.tsx` anchors the `<h3>` to `project.url`), so there is nowhere to
  read a project, and it carries **no image** — unlike the feed card, which the owner wants
  this to resemble (title / body / image).
- The mock `Project` shape has a single `url` field, which cannot express the distinct
  outbound links a project page needs — a **source repo** (GitHub) is not the same thing as
  a **live site**, an **App Store** listing, or a **Play Store** listing.

A member who has built something has no page to point people at, and the nav advertises a
section that goes nowhere.

## Why it matters

Reading is the whole anonymous-visitor experience and the recruiting mechanism: posts,
projects, profiles, and events must render **without a session** and stay indexable
(`AGENTS.md`). "Share what you've made" is a first-class reason this platform exists —
GitHub and the rest do everything else, but they don't gather **Shan** developers' work in
one Shan-first place. A project the community can browse, open, and follow out to the repo
or the store is exactly the language-and-locality thesis in action.

As with PBI-010 and PBI-016, no database or auth exists, so a *real* Projects feature is
impossible now. This PBI builds the **directory + detail layout against the existing typed
mock**, so the read experience is real and reviewable and real data drops in later without
reworking the UI. It also redesigns the provisional card into the feed-card shape the owner
asked for and gives the disabled nav item a destination.

## Scope

A browseable Projects section — a list of projects and a per-project read view — rendered
from the existing typed mock data.

**In scope:**

- A **`/projects` directory route** under `app/[locale]/` — a **single-column list** of
  project cards (the owner's layout choice), mirroring the home feed's column.
- A **redesigned project card** shaped like the feed's `post-card.tsx`: **title / body /
  image**, with a **display-only star count** (the owner's choice — same treatment as the
  feed's like count, mechanic unwired). The card links to the project's **detail page**, not
  straight out to the repo.
- A **`/projects/[slug]` detail route** rendering one project: title, per-project
  content-language tag, full description, image when present, tags, and **outbound link
  buttons** — **GitHub (source), a live/website URL, App Store, and Play Store** — each shown
  only when that link exists. A **back to projects** affordance returns the reader.
- **Enable the "Projects" nav item** — give it an `href` so it stops rendering as "soon".
- **Signed-out reading:** every page renders with no session and stays indexable.

**Out of scope — deliberately (each a later PBI or decision):**

- Real projects, a database, or any data model beyond the mock's TypeScript shape.
- **Creating / editing / deleting a project** — needs auth + a write endpoint + a rate
  limit (`AGENTS.md` requires one on every write path).
- The **star mechanic** (starring, ranking by stars) — display-only, same as the feed's
  like slot.
- **Image storage/hosting** — Neon bundles none (`design.md` open question). The mock reuses
  an in-repo asset for the image, exactly as `lib/feed.ts` does; real uploads are a later PBI.
- **Filtering / search / sort / pagination** on the directory — a flat list is enough for
  the mock; Myanmar-script search is its own open question.
- **Tabs or a projects tab redesign on the profile** — PBI-017's profile already lists
  projects; this PBI may reuse the redesigned card there but need not rework the profile.
- Events surface (its own PBI); a project's author handle links to the existing profile.

## Conditions of Satisfaction

1. A **`/projects` directory route** exists under `app/[locale]/` and renders the projects
   from the typed mock source (`lib/projects.ts`) as a **single-column list**, reusing that
   data — not a hand-duplicated copy. `/shn` and `/en` both resolve it.
2. A **`/projects/[slug]` detail route** exists and renders a single project from the same
   mock, keyed on **`slug`**; an unknown slug calls `notFound()` and reaches the localised
   404 (via the `app/[locale]/[...rest]` catch-all). Both locales resolve valid slugs.
3. Both routes render **fully logged out** — no session required, nothing gated behind auth.
   (Verified by loading them with no auth.)
4. The **project card is redesigned to the feed-card shape** — title, body/description,
   optional image, display-only star count — and **links to its detail page** (the title no
   longer links straight out to the repo). The same card is reused by the directory (and may
   be reused on the profile).
5. The detail view shows the **full description** (not the card's clamped excerpt), the image
   when present, tags, and **outbound link buttons for GitHub, website/live URL, App Store,
   and Play Store**, each rendered **only when that link is present**. Every outbound link is
   `target="_blank"` with `rel="noopener noreferrer"`.
6. The mock **`Project` shape expresses the distinct links** (GitHub/repo, website/live,
   App Store, Play Store) and an **optional image** — a plain TypeScript type + array, **not**
   a DB schema — so real projects replace it without touching the cards.
7. The **"Projects" nav item is enabled** (has an `href`) and no longer shows the "soon" cue;
   it routes to `/projects`.
8. **Per-project content-language tag:** each project carries its own `lang`, independent of
   UI locale, rendered via the existing font stack. Any Shan sample content is **real Shan**
   (owner-supplied) or the sample stays English — no fabricated Shan (same rule as PBI-010).
9. **Mobile-first:** at ~360px both pages are a single readable column and the body does
   **not** scroll horizontally; the link buttons wrap rather than overflow.
10. **Monochrome, `rounded-lg` only, no `font-bold` on any text** (content can contain Shan);
    semantic tokens only; reuses existing components (`buttonVariants`, `Reveal`, the feed
    card's meta/image treatment, `HandleLink`, shadcn primitives via the CLI) before adding
    any new primitive.
11. **Server-Component-first:** the pages, the directory list, and the card are Server
    Components; `"use client"` appears only on an interactive leaf justified by one of the
    four `AGENTS.md` triggers.
12. `lint`, `build`, and `test` pass, and a test asserts the projects surface renders **for an
    anonymous visitor** (following `__tests__/page.test.tsx`). Note Vitest cannot render async
    Server Components — if a page is async, cover a synchronous sub-component and verify the
    rest by running the app.

## Notes

- **Link fields — decided at agreement:** the mock `Project` grows from a single `url` into
  distinct optional links — **`repo` (GitHub), `website`/live URL, `appStore`, `playStore`**.
  Keep them optional; not every project has all four. Migrate the existing `url` values (all
  GitHub/website today) onto the right fields when redesigning the mock, and keep the existing
  `slug`, `author`, `stars`, `tags`, `lang` fields.
- **Image is mock-only.** Add an optional `image?` to `Project` and reuse an in-repo asset
  for samples (as `lib/feed.ts` does with `/icons/icon-512.png`) — real image storage is a
  later PBI and an open question in `design.md`. Render via `next/image` like the feed card.
- **Card link direction changes.** Today `project-card.tsx` anchors the title to the repo;
  after this PBI the card links to `/projects/[slug]` and the outbound links live on the
  detail page. Anywhere the card is reused (the PBI-017 profile) inherits that — check the
  profile still reads correctly.
- **Bilingual chrome.** New strings (e.g. "Projects", "Back to projects", the link-button
  labels "Source", "Live", "App Store", "Play Store", "No projects yet") need Shan + English.
  Per the current i18n rule, wire English and hand off Shan for owner review before merge —
  do not invent Shan; do not leave copy untranslated.
- **Reuse ladder applies.** The card and the detail link-button row are the likely new
  composites; they live in `components/projects/`, not `components/ui/`. The feed card's
  image block, meta line, and the profile's `HandleLink` already exist — factor/reuse rather
  than fork. Store-badge artwork is not required; labelled `buttonVariants` links are enough
  (and safer than shipping Apple/Google trademark badges).
- **Async Server Components + tests.** If a page reads `params` (a Promise) it is async and
  Vitest can't render it directly; keep a testable synchronous piece (the card or the list)
  or add coverage as a plain render of a sub-component, per PBI-016.
- Keep this to the **read view**. If create/edit, starring, or upload starts creeping in
  during breakdown, that is a separate PBI (auth/write-path/storage), not this one.
