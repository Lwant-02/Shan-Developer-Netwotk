# PBI-017 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Scope: directory + profile pages.** `/developers` listing and a per-member profile.
  UI shell + typed mock only — no auth, no editing, no "unlisted" toggle, no following /
  messaging, no projects section, no directory search/sort/pagination.
- **Profile route: `/developers/[handle]`** (owner's choice — nested under the directory,
  not a top-level `/u/[handle]`). Unknown handle → `notFound()` → localised 404.
- **Mock derived from existing authors.** `lib/developers.ts` owns handle→profile data
  (bio, optional coarse location, links) for the ~8 distinct handles across `lib/feed.ts`
  and `lib/comments.ts`. A profile's posts come from filtering `mockPosts` by author, so
  feed and profile stay consistent.
- **Identity safety is binding:** no email anywhere; location coarse **and** optional (at
  least one member has none); pseudonymous handles; initials-only avatar; no presence /
  verified indicator.
- **Mock copy is English** (bios, location labels) — fabricated English, never Shan. New
  **UI chrome** strings get Shan via `npm run i18n:prompt` (owner-reviewed).

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | `lib/developers.ts`: typed `Developer` (handle, displayName?, bio, location?, links[]) + mock for all 8 authors; `getDeveloperByHandle`, `listDevelopers` | Done | — | CoS 1, 3, 5, 6. No email field by design; 2 members have no location. |
| 2 | `postsByAuthor(handle)` in `lib/feed.ts` so a profile shows exactly that author's `mockPosts` | Done | — | CoS 3, 6. |
| 3 | New chrome (English + `TODO(shn)`): `Developers.subtitle`/`backToDirectory`/`posts`/`noPosts`; H1 reuses translated `Nav.developers` | Done | — | CoS 11. Reuse keeps `/shn` in Shan even before the 4 land; i18n:prompt brief generated. |
| 4 | `HandleLink` (server): wraps a handle in a `Link` to `/developers/[handle]` — one reusable place | Done | — | CoS 4. |
| 5 | Link handles via `HandleLink` in `PostMeta` (card + detail) and `CommentCard` | Done | — | CoS 4. `relative z-10` on the card handle so the stretched title link doesn't swallow it. RightRail recent shows no author, so nothing to link there. |
| 6 | `DeveloperCard` (server): whole-card `Link`, initials avatar, handle/displayName, optional coarse location, one-line bio | Done | — | CoS 1, 5, 8. In `components/developers/`. |
| 7 | `app/[locale]/developers/page.tsx` (server) + `DeveloperDirectory` (sync, testable): list from `listDevelopers`, `setRequestLocale`, `generateMetadata` + `alternates` | Done | — | CoS 1, 2, 9, 10. |
| 8 | `ProfileHeader` (server): avatar, display name/handle, optional coarse location, bio, external links (`target=_blank rel=noopener noreferrer`) | Done | — | CoS 3, 5, 8. No email. |
| 9 | `app/[locale]/developers/[handle]/page.tsx` (server, async): resolve handle or `notFound()`; back link + header + "their posts" (reuse `PostList`) or empty state; `generateStaticParams` (SSG); `generateMetadata` + `alternates` | Done | — | CoS 3, 4, 7, 9, 10. |
| 10 | Enable the nav: `developers` gets `href: "/developers"` in `left-nav.tsx` | Done | — | CoS 1. |
| 11 | Sitemap: `/developers` + every `/developers/[handle]` per locale | Done | — | CoS 10. Per-locale balance preserved. |
| 12 | `__tests__/developers.test.tsx`: directory renders anonymously + Myanmar script; profile renders no email; a no-location member still renders | Done | — | CoS 2, 5, 11. 4 tests; async pages covered via sync `DeveloperDirectory`/`ProfileHeader`. |
| 13 | Verify: `lint`, `build`, `test`; prod server logged out; `i18n:prompt` brief; close-out | Done | — | CoS 2, 11. See below. |
| 14 | Refactor: extract `PostList` from `PostFeed` so the profile reuses the same list | Done | — | Reuse over duplication (CoS 8). |
| 15 | **(owner add)** Directory as a responsive grid (`grid-cols-1 sm:grid-cols-2`); cards get a border to read as tiles | Done | — | Scope addition. |
| 16 | **(owner add)** Brand social icons: `SocialPlatform` + `SOCIAL` map, links render GitHub/Facebook/Instagram/LINE/LinkedIn/Telegram from `public/icons` (GitHub inverted), `website` → globe | Done | — | Scope addition. Replaces `{label, href}`. |
| 17 | **(owner add)** `lib/projects.ts` + `ProjectCard`; profile Projects section (grid) with empty state | Done | — | CoS 3b. **Provisional** mock ahead of the Projects surface PBI. |
| 18 | **(owner add)** `lib/events.ts` (`EventItem`) + `EventCard`; profile Events section with empty state | Done | — | CoS 3b. **Provisional** mock ahead of the Events surface PBI. |
| 19 | Strings for Projects/Events sections (`projects`/`noProjects`/`events`/`noEvents`, English + `TODO(shn)`) | Done | — | i18n hand-off. |
| 20 | Share dialog (card + link + QR) — its own PBI, not built here | Done | — | Out of scope; own PBI (to file). |
| 21 | **(owner add)** `role` field on `Developer` (e.g. "Senior Frontend Developer"); shown on the card and profile header | Done | — | Scope addition. |
| 22 | **(owner add)** Redesign `DeveloperCard`: stacked (`flex-col`), avatar+name+role header, bio, location + posts/projects/events count row | Done | — | Scope addition ("too simple"). |
| 23 | **(owner add)** Profile Posts/Projects/Events as **tabs** (`ProfileTabs`, a `"use client"` leaf; content stays server-rendered) instead of stacked sections | Done | — | Scope addition. useState/onClick is the only client trigger. |
| 24 | Project/Event **card visual redesign** — **deferred to a future PBI** (owner's call); cards stay functional as-is | Done | — | Deferred, not built. |

## Verified vs browser-only

Verified here (prod build, logged out):

- `npm run lint`, `npm run build`, `npm test` (36 tests) all pass.
- Build prerenders `/developers` and all 8 profiles × 2 locales as **SSG** (43 static pages).
- `curl` logged out: `/en/developers` → 200 with handles + bios; `/en/developers/tai_builds`
  → 200 with coarse location, an external link, and their posts; `/en/developers/sengfah`
  (no location, comment-only author) → 200 with **no location line**, the **"No posts yet."**
  empty state, and **no email**; an unknown handle (`/en/developers/nope`) → **404**.
- The home feed's author handles now link out: `/en` HTML carries `/en/developers/<handle>`
  for each post author.
- `sitemap.xml` lists `/developers` + all 8 profiles per locale (9 developer paths).

**Browser-only (not checkable headlessly here):** the ~360px single-column / no-horizontal-
scroll layout (CoS 7) and the actual handle→profile / card→profile click-through. Same split
as PBI-010/016.

## Shan copy — handed off, not shipped

Four new strings (`Developers.subtitle`, `backToDirectory`, `posts`, `noPosts`) ship as
`TODO(shn):` for the translation pass + owner review **before merge**. The directory H1
deliberately reuses the already-translated `Nav.developers`, so `/shn/developers` renders
Shan even before the four land. Bios and locations are English mock (fabricated, not a Shan
content claim) — real Shan bios wait on real members; no Shan is fabricated.

## Conditions of Satisfaction

Tracked in [prd.md](./prd.md#conditions-of-satisfaction); each task's Notes column maps to
the CoS it serves. Close-out verifies every CoS, not just that tasks are ticked — with
extra attention to CoS 5 (identity safety: no email, optional/coarse location).
