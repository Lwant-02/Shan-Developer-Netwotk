# PBI-010 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Scope: shell + post card + typed mock feed.** No DB, auth, voting mechanic,
  comments, search wiring, infinite scroll, or destination pages.
- **Dead nav links are disabled** ("coming soon"), not live — no nav item 404s.
- **Shan is English + `TODO(shn)` for new chrome**, English mock posts. An
  `npm run i18n:prompt` brief is handed off at the end. Real Shan on `/shn` comes from
  existing translated strings (e.g. the greeting) so the page still shows Shan script.
- **Mixed-language mechanism is built, not demonstrated with content.** The `Post`
  type carries a `lang` tag and cards set `lang`/`dir`; showing real Shan post content
  waits on owner-supplied Shan (won't be fabricated).

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Pull shadcn primitives (card, avatar, input, sheet, separator) via CLI | Done | — | Base UI shape confirmed. |
| 2 | `lib/feed.ts`: typed `Post` + English mock feed | Done | — | CoS 4, 5. |
| 3 | New UI strings: English + `TODO(shn)` | Done | — | CoS 12. 19 keys; i18n:prompt brief generated. |
| 4 | `LeftNav` (server): items, Home active, others disabled "soon" | Done | — | CoS 1. |
| 5 | `LocaleSwitcher` (client): shn/en via `i18n/navigation` | Done | — | CoS 8, 10. Live switch = browser check. |
| 6 | `MobileNav` (client): Sheet drawer holding the server nav as children | Done | — | CoS 3, 10. |
| 7 | `TopNav` (server): logo, disabled search, switcher, Sign in, mobile trigger | Done | — | CoS 1, 7, 11. |
| 8 | `PostCard` (server): author, time, lang tag, title, body, vote slot, comment/share | Done | — | CoS 4, 5, 6, 9. |
| 9 | `PostFeed` (server): sort tabs + map mock posts | Done | — | CoS 4. |
| 10 | `RightRail` (server): welcome (real Shan greeting) + recent (mock) | Done | — | CoS 1; keeps Shan script on the page. |
| 11 | `page.tsx`: responsive 3-region grid, replace placeholder | Done | — | CoS 1, 2, 3, 10. |
| 12 | Tests: anon feed render, Myanmar script, en-not-shn | Done | — | CoS 12. 15/15 pass. |
| 13 | Verify: lint, build, test, prod server, logged out | Done | — | CoS 2, 12. See browser-only note below. |
| 14 | `i18n:prompt` brief + docs (AGENTS home-gap, lucide, navigation) | Done | — | Close-out. |
| 15 | **Translate the home Shan strings** | Done | owner | All 27 keys translated and verified (19, then 8 more from the design pass). |
| 16 | Design pass: full-bleed shell, collapsible nav, hairline feed, post menu, post image | Done | — | CoS 1, 7, 9, 10. |

## Verified vs browser-only

Verified here (prod build, logged out): `/shn` and `/en` return 200 with server-rendered
content — feed titles, the Shan greeting (Myanmar script), sort tabs, cards, "Sign in".
Lint, build, and 15 tests pass. No `font-bold`, `rounded-lg` only, two client leaves.

**Needs the owner's browser** (can't run a viewport/interaction here): CoS 3 at ~360px
(single column, no horizontal scroll) and CoS 8 (the locale switch actually swapping
/shn↔/en on click). The responsive classes and the next-intl switcher API are the
standard, correct shapes; the runtime behaviour is what's unconfirmed.

## Shan copy — landed, not deferred

The build started on the agreed "English + `TODO(shn)`" path, but the owner translated
all 27 chrome strings before merge, so **no placeholder ships**. `npm run i18n:prompt`
reports `messages/shn.json is complete against en`. `/shn` renders entirely in Shan.

Mock post *bodies* remain English and tagged `lang: "en"` — the per-post language
mechanism is built and rendered, but a genuinely mixed-language feed still waits on
real Shan post content, which won't be fabricated.

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. Top nav, left nav, centre feed, right rail — replacing the placeholder.
2. Renders fully logged out.
3. Mobile-first: single column at ~360px, left nav collapses, right rail hidden, no
   horizontal scroll.
4. Feed from a typed mock source, not per-post JSX.
5. Per-post content-language tag; mixed Shan/English renders correctly.
6. Vote slot + comment/share row, visually present, non-functional.
7. Signed-out chrome: a "Sign in" affordance, no fake logged-in UI.
8. Locale switcher (shn/en) preserving the path.
9. Monochrome, `rounded-lg`, no `font-bold` on Shan; reuse over new.
10. Server-Component-first; `"use client"` only on interactive leaves.
11. No search wiring, no infinite scroll, no ads/AI.
12. `lint` + `build` + `test` pass; a test covers anon render + Myanmar script + feed.

## Out of scope (later PBIs / decisions)

Real posts + DB, auth, the voting mechanic, comments, search, infinite scroll,
notifications, create-post, and the Projects/Posts/Events/Profiles pages.
