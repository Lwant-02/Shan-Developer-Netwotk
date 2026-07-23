# PBI-020 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Directory + detail**, and **enable the "Projects" nav item** (drop the "soon" cue).
- **Directory is a single-column list** of feed-shaped cards (title / body / image) —
  matching the home feed's column, not a grid.
- **Star is a display-only button** (`StarButton`, mirroring the feed's `LikeButton`) — the
  mechanic is not wired; starring is a write that needs auth + a rate limit.
- **A ⋯ menu** (`ProjectMenu`, mirroring `PostMenu`) with **edit / delete**, display-only —
  owner-only when auth lands. On the card and the detail page.
- **Detail outbound links: GitHub (source), website/live URL, App Store, Play Store** — each
  shown only when present, as **labelled buttons** with owner-supplied brand marks in
  `public/icons` (`github.svg` inverted, `app-store.png`, `playstore.png`); live falls back
  to a lucide globe.
- **Mock only** — no DB/auth/create/edit/upload/star-mechanic/search. Image reuses an
  in-repo asset like `lib/feed.ts` does.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Redesign mock `Project` in `lib/projects.ts`: split `url` into optional `repo` / `website` / `appStore` / `playStore`, add optional `image`; keep slug/author/stars/tags/lang. Add `getProjectBySlug` + `listProjects` | Done | — | CoS 6. Typed mock, not schema. |
| 2 | New `Projects` namespace strings (English + `TODO(shn)`): title, subtitle, backToProjects, links heading + Source/Live/App Store/Play Store labels, by-author, empty | Done | — | CoS 8. **Shan pending.** |
| 3 | Redesign `components/projects/project-card.tsx` to the feed-card shape — title / body / image / tags, a ⋯ `ProjectMenu` (edit/delete) in the title row and a display-only `StarButton` footer — and link the **whole card to `/projects/[slug]`** (no longer the repo) | Done | — | CoS 4, 10, 11. Reuse feed image block; menu/star mirror `PostMenu`/`LikeButton`. |
| 4 | `components/projects/project-list.tsx` — sync Server Component, single-column list of cards (testable) | Done | — | CoS 1, 11. |
| 5 | `components/projects/project-links.tsx` — outbound link buttons (GitHub/Live/App Store/Play Store), each rendered only when present, `target=_blank` + `rel=noopener noreferrer` | Done | — | CoS 5, 10. |
| 6 | `/projects` directory route `app/[locale]/projects/page.tsx`: `AppShell` + `ProjectList`, `generateMetadata` alternates, `setRequestLocale`, static | Done | — | CoS 1, 3. |
| 7 | `/projects/[slug]` detail route: `generateStaticParams`, `notFound()` on unknown slug, full description + image + tags + author (`HandleLink`) + `ProjectLinks`, back-to-projects | Done | — | CoS 2, 3, 5. |
| 8 | Enable the "Projects" nav item — add `href: "/projects"` in `components/shell/left-nav.tsx` | Done | — | CoS 7. |
| 9 | Sitemap: index `/projects` + every `/projects/[slug]` from the mock | Done | — | CoS 3. Recruiting reach. |
| 10 | `__tests__/projects.test.tsx`: the projects list renders **for an anonymous visitor**; the card links to the detail slug (following `page.test.tsx`) | Done | — | CoS 11. Sync sub-component. |
| 11 | Verify: `lint`, `build`, `test`; logged-out render of `/projects` + a slug + unknown-slug 404; profile projects tab still reads; close-out | Done | — | CoS 1–12. See below. |

## Verified vs browser-only

Verified here:

- `npm run lint`, `npm run build`, `npm test` all pass; build prerenders `/projects` and
  every `/projects/[slug]` (× both locales) as static.
- Anonymous render test: the project list renders logged out with Myanmar-block script and
  the card links to `/projects/<slug>`.
- `curl` logged out: `/en/projects` → 200, a known slug → 200, an unknown slug → 404
  (localised), and the profile projects tab still renders the redesigned card.

**Browser-only:** the card at ~360px and in the profile's 2-col grid, the detail link-button
row wrapping, and the enabled nav item.

## Shan copy

The 14 `Projects` strings were translated and owner-reviewed before merge — no `TODO(shn)`
ships. The `by` value keeps the `<handle></handle>` tag verbatim (it wraps the profile link).

## Conditions of Satisfaction

Tracked in [prd.md](./prd.md#conditions-of-satisfaction). Load-bearing: **CoS 3** (renders
logged out) and **CoS 4** (card is feed-shaped and links to the detail page, not the repo).
