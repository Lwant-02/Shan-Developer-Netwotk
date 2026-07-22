# PBI-017 — Developers directory + profile pages (shell + mock data)

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-22 |
| **Completed** | 2026-07-22 |
| **Depends on** | PBI-010 (mock feed + authors, Done), PBI-016 (mock comments + `PostMeta`, Done) |
| **Relates to** | PBI-005 (moderation, Deferred); the 🟡 "unlisted in directory" recommendation in `design.md` |

> **Closed.** `/developers` (a responsive grid of member cards with role + activity counts)
> and `/developers/[handle]` profiles ship, prerendered as SSG for all 8 members × 2 locales.
> Author handles across the app link to profiles via `HandleLink`. Profiles show the member's
> Posts / Projects / Events in **tabs** (`ProfileTabs`, a small `"use client"` leaf; content
> stays server-rendered), each with an empty state. Identity safety holds: no email, coarse +
> optional location, initials-only avatar. Social links use brand icons from `public/icons`.
> `lint`/`build`/`test` (36) pass; verified logged out (directory, both profile shapes, author
> links, unknown handle → 404, no email). Owner translated all new strings — `i18n:prompt`
> reports clean, so no `TODO(shn)` ships. As with PBI-010/016, "Done" = merged + verified
> (Vercel unlinked); the ~360px layout and click-throughs are browser-only checks for the owner.
>
> **Scope grew during implementation** (owner-directed): the directory grid, brand social
> icons, and **Projects + Events on profiles** — the last introducing **provisional** mock
> models (`lib/projects.ts`, `lib/events.ts`) ahead of the Projects/Events *surfaces*, which
> remain their own future PBIs (nav still disabled for both). Deferred to their own PBIs: the
> **share dialog** (card + link + QR) and the **Project/Event card visual redesign**.

## Problem

The **Developers** nav item is disabled with a "soon" cue — `components/shell/left-nav.tsx:21`
(`{ key: "developers", icon: CodeXml }`, no `href`). Meanwhile pseudonymous author handles
(`tai_builds`, `namkham_codes`, `nam_oo`, …) appear all over the shipped UI — every post
card (`PostMeta`), the post detail header, every comment (`CommentCard`), the right-rail
recent list — and **none of them link anywhere**. A visitor who sees an interesting post
has no way to find out who the person is or what else they've written.

`design.md` names **Profiles — "who you are, what you build"** as core 🟢 product, and the
permission model makes profiles **read-only for anonymous visitors** (browsable without a
session). None of that exists yet: there is no `/developers` route and no profile route.

There is no database, auth, or profile feature, so a *working* profile is impossible now —
the same starting point as PBI-010 and PBI-016.

## Why it matters

Profiles are half the recruiting surface. The feed shows that *activity* is happening; the
directory and profiles show that a **community of real (pseudonymous) people** is here, and
lets a visiting Shan developer follow a handle from a good post to the person behind it.
This must render **logged out** and stay indexable — public reach is the recruiting
mechanism.

This is also the surface where the **identity-safety requirements are load-bearing**, not
decorative (`AGENTS.md`; `design.md` *Safety and pseudonymity*): pseudonymity is a
first-class supported case, location is coarse and optional, and the OAuth email is **never**
shown. Getting the profile's information architecture right now — before real data — is what
keeps those rules from being retrofitted later.

## Scope

The Developers surface as a **directory + individual profile pages, rendered from typed mock
data derived from the existing feed/comment authors**.

**In scope:**

- A **`/developers` directory**: a listing of members, each showing handle, an optional
  coarse location, a one-line bio, and external links. Built from the distinct authors in
  `lib/feed.ts` + `lib/comments.ts`.
- An **individual profile page** at **`/developers/[handle]`**: handle / display name,
  optional coarse location, bio, external links (e.g. GitHub, website), and **their posts** —
  `mockPosts` filtered by author, reusing the existing post-card/list.
- **Author handles become links** to the profile everywhere they appear: `PostMeta` (card +
  detail), `CommentCard`, and the right-rail recent list.
- A typed **`lib/developers.ts`** mock: a `Developer` shape (handle, displayName?, bio,
  location?, links) + resolver helpers, anticipating the real model without a DB schema.
- **Identity safety, enforced in the UI:** pseudonymous handles only; **no email anywhere**;
  location is coarse (region/town, not precise) and **optional** — at least one member has
  none and renders cleanly; the avatar is initials only and never asserts presence or a
  verified/real identity.
- **Anonymous-readable**, Server-Component-first, SSG; own metadata/`alternates` per page;
  directory + profiles added to the sitemap.

### Scope additions (owner, during implementation)

Directed by the owner while reviewing the build, folded into this PBI:

- **Directory is a responsive grid** (`grid-cols-1 sm:grid-cols-2`), not a single-column list.
- **Brand social icons on links** — GitHub, Facebook, Instagram, LINE, LinkedIn, Telegram
  (assets under `public/icons`), via a `SocialPlatform` + `SOCIAL` map; `website` falls back
  to a generic globe. Replaces the earlier plain `{label, href}` link shape.
- **Profiles show Projects and Events, not only Posts.** This required introducing mock data
  models **ahead of** the Projects and Events surfaces. `lib/projects.ts` and `lib/events.ts`
  are **provisional mock shapes** (a plain type + array each), tied to a member by
  `author` / `host`. The **real models and the `/projects` `/events` routes remain their own
  future PBIs** — the nav items for both stay disabled. `ProjectCard` / `EventCard` live in
  `components/projects` / `components/events` so those surfaces can reuse them.

**Out of scope — deliberately (each a later PBI or decision):**

- **Editing your own profile**, settings, or avatar upload — needs auth and storage.
- The **"unlisted in the directory" toggle** — a 🟡 recommendation in `design.md` and it
  needs auth; acknowledged, not built. Every mock member is listed.
- **Following, messaging, or contact** actions.
- The **share dialog — a downloadable profile card, shareable link, and QR code** — filed as
  its own PBI (needs QR generation, image export, and a client dialog under the strict CSP).
- The **Projects and Events *surfaces*** (`/projects`, `/events` directories + detail routes,
  and the real data models) — their own PBIs; this PBI only shows a member's projects/events
  on their profile from provisional mock.
- Real avatars/photos (image storage is a later PBI — initials only, as on the card).
- Directory **search / sort / pagination** beyond a simple list, and any real-data wiring.

## Conditions of Satisfaction

1. **`/developers`** (both `/shn` and `/en`) renders a directory of members from a typed mock
   source, replacing the disabled nav item with a live link.
2. It renders **fully logged out** — no session required, nothing gated. (Verified logged out.)
3. An **individual profile page** renders one member: handle / display name, optional coarse
   location, bio, external links, and **their posts** (`mockPosts` filtered by that author,
   reusing the existing card/list). An **unknown handle → `notFound()`** → the localised 404.
3b. The profile also shows the member's **Projects and Events** (from provisional
   `lib/projects.ts` / `lib/events.ts` mock, filtered by `author` / `host`), each with its own
   empty state; a member with none of a kind renders that section's empty state cleanly.
4. **Author handles link to profiles** in `PostMeta` (card + detail) and `CommentCard` — a
   handle is no longer inert text where it appears. (The right-rail recent list shows no
   author, so there is nothing to link there.)
5. **Identity safety holds in the UI:** no email is rendered anywhere; location is coarse and
   **optional** (a member with no location renders correctly); handles are pseudonymous; the
   avatar is initials only and never implies presence or a verified/real identity.
6. The mock is **derived from the existing authors**, so a member's posts shown on their
   profile are exactly their posts in the feed (consistency between feed and profile).
7. **Mobile-first:** at ~360px both the directory and the profile are a single readable
   column and the page body does **not** scroll horizontally.
8. **Monochrome, `rounded-lg` only, no `font-bold`** (bios/handles can contain Shan);
   semantic tokens only; reuses existing pieces (the `PostMeta`/card avatar treatment, `Card`,
   `buttonVariants`, the post list) before adding a new primitive.
9. **Server-Component-first:** pages and lists are Server Components; `"use client"` only on a
   justified interactive leaf (one of the four triggers in `AGENTS.md`).
10. **Indexable:** each page sets its own canonical/hreflang `alternates`, and the directory +
    profile routes are added to the sitemap for every locale.
11. `lint`, `build`, and `test` pass, and a test asserts the directory (or a profile) renders
    **for an anonymous visitor** and still contains Myanmar-block script. New chrome strings
    are wired in English and handed off for Shan via `npm run i18n:prompt` (owner-reviewed).

## Notes

- **Profile route — decided: `/developers/[handle]`.** The owner chose nesting the profile under
  the directory over a top-level `/u/[handle]`. Route is `app/[locale]/developers/[handle]/page.tsx`;
  author links across the app point at `/developers/<handle>`; an unknown handle calls `notFound()`
  and lands on the localised 404.
- **Deriving the mock.** Distinct authors span `lib/feed.ts` (6 post authors) and
  `lib/comments.ts` (adds `nam_oo`, `sengfah`), ~8 handles — enough for a real-looking
  directory. `lib/developers.ts` should own the handle→profile data (bio, coarse location,
  links) and a helper to resolve a handle; "their posts" comes from filtering `mockPosts`.
  Keep it a plain TypeScript type + array, **not** a DB schema.
- **Mock copy is English.** Bios and location labels are fabricated English mock (like PBI-010
  post bodies) — not a Shan-content claim. Never fabricate Shan; the `lang` mechanism for any
  future Shan bio can wait for real content. New **UI chrome** strings still get Shan via the
  hand-off.
- **Reuse ladder.** The directory row and the profile header are the likely new composites
  (in `components/`, not `components/ui/`); the avatar/meta treatment, `Card`, and the post
  list already exist — reuse, don't fork. Turning a handle into a link touches `PostMeta` and
  `CommentCard` — extract a small handle-link if it helps, rather than duplicating.
- **Identity safety is the binding constraint here** — if any part of the design would surface
  an email, a precise location, or a presence indicator, it's wrong. See `AGENTS.md` and
  `design.md` *Safety and pseudonymity*.
- If this grows past directory + profile + mock during breakdown (e.g. a projects section, or
  directory search), split that into a follow-up PBI rather than expanding this one.
