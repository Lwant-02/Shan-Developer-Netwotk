# PBI-016 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Scope: read view only.** A single-post page + a mock comment thread. No composer,
  no comment submission, no voting mechanic, no reporting/moderation, no pagination, no
  real-time. Each is a later PBI (auth + write path + rate limit, or PBI-005).
- **URL keys on a `slug`.** The owner chose a slug over the bare `id`, for indexing and
  recruiting reach. Add a unique `slug: string` to the typed mock `Post`; route is
  `app/[locale]/post/[slug]/page.tsx`; an unknown slug calls `notFound()` and lands on
  the localised 404 via the existing `[...rest]` catch-all.
- **Comments are a typed mock**, mirroring how `Post` was handled — a plain TS type +
  array in `lib/…`, anticipating the real model (id, post slug/id, author handle, created
  time, content-language tag, body, optional one-level `parentId`) **without** defining a
  DB schema. Flat or one level deep; no collapse/expand interaction.
- **Per-comment content language.** Comments carry their own `lang`, independent of UI
  locale. Any Shan sample content is **real Shan** (owner-supplied) or the sample stays
  English — no fabricated Shan (same rule as PBI-010's post bodies).
- **Composer is a disabled, sign-in-gated placeholder** — mirrors PBI-010's vote slot and
  PBI-014's gating. It never asserts a logged-in identity.
- **Shan chrome via the i18n brief.** New strings wire English first; Shan is handed off
  through `npm run i18n:prompt` (web-searching agent translates, owner reviews). Don't
  invent Shan; don't leave copy untranslated.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | `lib/feed.ts`: add unique `slug` to `Post`; backfill all 6 mock posts + `getPostBySlug` | Done | — | CoS 1, 3. Counts realigned to thread lengths. |
| 2 | `lib/comments.ts`: typed `Comment` shape + mock thread for every post, counts consistent with `post.comments` | Done | — | CoS 5, 6. 24 comments; `getCommentsForPost`. |
| 3 | New UI strings (English + `TODO(shn)`): `PostDetail.backToFeed`, `signInToComment` | Done | — | CoS 9. Count heading reuses translated `Post.comments`, so only 2 new strings. i18n:prompt brief generated. |
| 4 | Reuse existing primitives — no new shadcn pull needed (composer reuses `SignInDialog`; count heading reuses `Post.comments`) | Done | — | Reuse ladder; zero new `components/ui/`. |
| 5 | `PostCard`: stretched title link to `/post/[slug]` + comment control now a `Link` — kills the dead `<button>` | Done | — | CoS 3. Stays a Server Component. |
| 6 | `CommentCard` + `CommentThread` (server): author, relative time, per-comment `lang` tag, body; one-level reply indent | Done | — | CoS 5, 6, 9, 10. New composites in `components/feed/`. |
| 7 | `CommentComposer` (server): sign-in-gated affordance reusing `SignInDialog`, no write path, no fake identity | Done | — | CoS 7. No `"use client"` — the dialog leaf is the only client JS. |
| 8 | `app/[locale]/post/[slug]/page.tsx` (server, async): await `params`, resolve by slug or `notFound()`; meta + **full body** + image + vote slot + back-to-feed + thread + composer | Done | — | CoS 1, 2, 4, 8, 10. `setRequestLocale`; SSG via `generateStaticParams`. |
| 9 | `generateMetadata`: own `alternates` (canonical/hreflang for the slug) + `openGraph`; wrapped title | Done | — | Per AGENTS metadata rule. |
| 10 | Extracted `VoteSlot` + `PostMeta` shared by card and detail; responsive single column; `rounded-lg`, no bold, semantic tokens | Done | — | CoS 8, 9. Reuse over duplication. |
| 11 | `__tests__/post-detail.test.tsx`: thread renders anonymously, Shan script survives, en≠shn, composer is a sign-in gate | Done | — | CoS 11. 4 tests; async page covered via the sync `CommentThread`. |
| 12 | Verify: `lint`, `build`, `test`; prod server logged out — card → detail, unknown slug → 404, thread renders | Done | — | CoS 2, 11. See below. |
| 13 | Sitemap now indexes post pages; `i18n:prompt` brief for the 2 new strings; close-out | Done | — | Indexability rule; Shan hand-off pending owner review. |

## Verified vs browser-only

Verified here (prod build, logged out):

- `npm run lint`, `npm run build`, `npm test` (32 tests) all pass.
- Build prerenders all 12 post pages (6 slugs × 2 locales) as **SSG**.
- `curl` logged out: `/en/post/shan-word-segmentation-search` → 200 with the full title,
  a comment body, the "Sign in to comment" gate, and "Back to feed"; `/shn/post/...` → 200;
  an unknown slug (`/en/post/does-not-exist`) → **404**.
- The home feed links out: `/en` HTML carries a `/en/post/<slug>` link for every card.
- `sitemap.xml` lists all 6 post paths per locale.

**Browser-only (not checkable headlessly here):** the ~360px single-column / no-
horizontal-scroll layout (CoS 8) and the actual card→detail click-through, plus the
localised-Shan 404 render — the 404 body is empty server-side by design (AGENTS.md), so
`curl` can't see it; the boundary is `app/[locale]/not-found.tsx`, covered by
`not-found.test.tsx`. Same split as PBI-010.

## Shan copy — handed off, not shipped

The two new strings (`PostDetail.backToFeed`, `PostDetail.signInToComment`) ship as
`TODO(shn):` placeholders. `npm run i18n:prompt` emits the brief; the web-searching
agent translates and the owner reviews **before merge**, per the current i18n rule — so
no placeholder reaches production. The count heading deliberately reuses the already-
translated `Post.comments`, so `/shn` still renders Shan even before the two land.

Comment bodies stay English and tagged `lang: "en"`: the per-comment language mechanism
is built and rendered (`lang={comment.lang}`), but a genuinely mixed Shan/English thread
waits on real Shan content, which won't be fabricated (same rule as PBI-010's post bodies).

## Conditions of Satisfaction

Tracked in [prd.md](./prd.md#conditions-of-satisfaction). Each task's Notes column maps
back to the CoS it satisfies; close-out verifies every CoS, not just that tasks are ticked.
