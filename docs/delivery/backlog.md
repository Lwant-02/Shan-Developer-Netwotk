# Product Backlog

The ordered list of Product Backlog Items (PBIs) for Shan Developer Network.
One row per PBI. Detail lives in `docs/delivery/<id>/prd.md` and `tasks.md`.

**This file is the index, not the spec.** Keep rows short; put reasoning in the PRD.

**PBIs are filed one at a time, by the owner, using the `create-pbi` skill** — when
the work is actually wanted, not speculatively. A backlog pre-stuffed with everything
that might one day be built is a wish list: it goes stale faster than it gets read,
and it invites building against items nobody decided on. Known-open work that hasn't
been scoped yet lives in `design.md` and in Open Questions below — not as `Proposed`
rows here.

## Status values

| Status | Means |
| --- | --- |
| `Proposed` | Written down, not agreed. Do not build. |
| `Agreed` | Scope settled, ready to pick up. |
| `InProgress` | Being worked on now. |
| `Done` | Shipped and verified. |
| `Reserved` | ID claimed for planned work, not yet drafted. |
| `Deferred` | Real, deliberately postponed. Not dropped. |
| `Won't Do` | Decided against. Kept so the decision isn't relitigated. |

A PBI must reach `Agreed` before code is written for it. This mirrors the
🟢/🟡/🔴 markers in `design.md` — don't build against a 🟡 or 🔴.

Resolve IDs with `npm run pbi:next` rather than reading this table by eye — it scans
every branch, so a PBI filed on an unmerged branch still holds its number.

## Backlog

| ID | Title | Status | Notes |
| --- | --- | --- | --- |
| [001](./001/prd.md) | Font attribution and licensing | Done | AJ (Jao Kunheing) built the fonts free for Shan speakers. Attribution in `public/fonts/CREDITS.md`. |
| [002](./002/prd.md) | Apply the Shan font to Shan text | Done | Fallback stack `Google Sans → aj12 → aj00` in `--font-sans`. Verified in built CSS. |
| [003](./003/prd.md) | Dark mode palette | Won't Do | **Superseded by [011](./011/prd.md)** — the owner reversed the light-only call. Kept so the original decision stays legible. |
| [004](./004/prd.md) | Decide locale routing | Done | **Locale-prefixed URLs, Shan (`shn`) default.** Implemented by 006. |
| [005](./005/prd.md) | Moderation policy and code of conduct | Deferred | Revisit before public launch. |
| [006](./006/prd.md) | Locale-prefixed routing with next-intl | Done | `/shn` and `/en`, `/` → `/shn`. Implements 004. Should land before any auth or home-page routes. |
| [007](./007/prd.md) | Sitemap and robots.txt | Done | Neither file exists; nothing tells a crawler the routes exist. Indexability is the recruiting mechanism. |
| [008](./008/prd.md) | Design the 404 page | Done | Next's unstyled English default is replaced by a localized page. Verified and completed with verified Shan script. |
| [009](./009/prd.md) | Installable PWA (web manifest + icons) | Done | `app/manifest.ts` + install icons; **no service worker** (offline deferred). Icons are placeholder upscales of the 96px logo — real ≥512 art is an Open Question below. |
| [010](./010/prd.md) | Home page — Reddit-style feed (shell + mock data) | Done | Replaces the placeholder home with a **mobile-first** 3-region feed layout + post cards from **typed mock data**. Anonymous-readable. No DB/auth/voting — those are later PBIs; the card carries a vote *slot* only. |
| [011](./011/prd.md) | Dark mode | Done | Built light + dark (`.dark` block + `next-themes` + toggle), superseding [003](./003/prd.md). **Now superseded by [013](./013/prd.md)** — the owner reversed to dark-only and its toggle/`next-themes` were removed. Kept so the light+dark decision stays legible. |
| [012](./012/prd.md) | Command palette search (kbar) | Done | Makes the dead nav search live. **Navigation + mock feed only** — real full-text search needs the DB and the Myanmar-tokenisation decision. |
| [013](./013/prd.md) | Dark-only theme | Done | Supersedes [011](./011/prd.md) — the owner reversed light+dark to **dark only** for the developer aesthetic. Removes `next-themes`, the toggle, and the `DevConsoleFilter` workaround; the greyscale palette moves into `:root`. |
| [014](./014/prd.md) | Sign-in dialog (frontend only) | Done | The nav's "Sign in" now opens a dialog with Google + GitHub OAuth options. **UI only** — no Better Auth, no session, no DB; the two provider buttons are where wiring attaches. |
| [015](./015/prd.md) | Static informational pages — About, Terms, Privacy | Done | About/Terms/Privacy shipped on a shared static-page shell (merged `f5d69a2`). Footer/nav links now resolve; PBI-014's consent line links out. About is translated; Terms/Privacy are English-only by design (`ENGLISH_ONLY`). Relates to [014](./014/prd.md), [005](./005/prd.md), [007](./007/prd.md). |
| [018](./018/prd.md) | Shareable developer profile card (dialog + QR + download) | Done | A **Share** button on a profile opens a dialog with a profile card carrying a **QR of the profile URL**, downloadable as a PNG. **No copy-link** (owner's call — the QR carries the URL). QR via `qrcode.react`. Follows [017](./017/prd.md). |
| [017](./017/prd.md) | Developers directory + profile pages (shell + mock data) | Done | The disabled "Developers" nav gets real routes: a `/developers` directory + `/u/[handle]` profiles, derived from the mock feed/comment authors so profiles show a member's real posts and author names everywhere become links. UI shell + mock only; identity-safety rules are load-bearing (pseudonymous, coarse/optional location, **never** email). No auth/edit/unlisted. Per the [010](./010/prd.md)/[016](./016/prd.md) precedent. |
| [016](./016/prd.md) | Post detail page (shell + mock data) | Done | Gives the feed's dead comment button (`post-card.tsx`) a destination — a single-post view with the full body + a mock comment thread. UI shell + typed mock data only, per the [010](./010/prd.md) precedent. Anonymous-readable. No DB/auth/voting/comment-submission. URL keys on a **slug**. |

## Open questions — not yet PBIs

Known-open work. **File these with `create-pbi` when you actually want them built**,
not before. The reasoning behind each lives in `design.md`.

- **Replace the placeholder PWA icons.** PBI-009 ships `icon-192/512/maskable` upscaled
  from the 96×96 logo, so the home-screen icon is soft. Swap in real ≥512 (ideally
  vector) art — the same missing asset blocks a proper OG image and a 180 apple-touch
  icon. One good source resolves all three.
- **Subset the fonts to `.woff2`.** ~250 KB of unsubsetted `.ttf` ships today and the
  audience is on mobile data; `design.md` calls it the highest-leverage perf win.
  Consider dropping `aj00` — `aj12` supersedes its coverage.
- **Better Auth with Google + GitHub OAuth.** Sign-in is the only gate. Not NextAuth.
  Database is Neon.
- **Rate limiting on write endpoints.** Required by `AGENTS.md` before any write path
  ships — and with moderation deferred (005), it is currently the whole spam defense.
- **Real posts feed** (replaces PBI-010's mock `lib/feed.ts`). The interaction model is
  **decided — a single like, not voting** (`design.md`, PBI-016); making it *function*
  (and any ranking by likes) still needs the DB + auth + a rate limit.
- **Contributor onboarding** — `CONTRIBUTING.md`, issue templates, a `good first
  issue` path. Needed before inviting collaborators.
- **Image and file storage.** Neon is Postgres only; unlike Supabase it bundles none.
  Needed before avatars or post images. Watch EXIF GPS stripping — location is coarse
  and optional by design, and photo metadata defeats that silently.
- **Search on Myanmar script.** Shan and Burmese are written without spaces between
  words, so Postgres's default tokenizer will segment them badly or not at all. Still
  open — [012](./012/prd.md) builds the palette surface but deliberately does **not**
  decide tokenisation.
- **A bold weight of A J Kunheing**, if one exists. Both fonts are Regular only, so
  all bold on Shan is faux-bold today.
- **Shan technical vocabulary** — does an existing effort exist to align a glossary
  with?
- **Community seeding** — an existing community to draw from, or cold-start from zero?

*(Resolved: the missing-glyph question — `aj12.ttf` carries SHAN THA, the Council
tones, and SHAN RR. See `design.md`.)*
