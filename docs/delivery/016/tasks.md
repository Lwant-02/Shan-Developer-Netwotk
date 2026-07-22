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
| 1 | `lib/feed.ts`: add unique `slug` to `Post`; backfill all 6 mock posts | — | — | CoS 1, 3. Slug decision. |
| 2 | `lib/comments.ts` (or extend `lib/feed.ts`): typed `Comment` shape + mock thread for ≥1 post, counts consistent with `post.comments` | — | — | CoS 5, 6. Anticipates real model, not DB schema. |
| 3 | New UI strings (English + hand off Shan): "Comments", "Back to feed", "Sign in to comment", empty-thread label | — | — | CoS 9; i18n:prompt brief. |
| 4 | Pull any missing shadcn primitive via CLI (e.g. `separator`, `textarea` for the disabled composer) — reuse first | — | — | Reuse ladder. Base UI shape. |
| 5 | `PostCard`: make the card link to `/post/[slug]` and the comment control resolve there — kill the dead `<button>` at `post-card.tsx:79` | — | — | CoS 3. Keep card a Server Component. |
| 6 | `CommentItem` / `CommentList` (server): author, relative time, per-comment `lang` tag, body; one-level reply indent if used | — | — | CoS 5, 6, 9, 10. New composite in `components/feed/`. |
| 7 | Disabled composer leaf: sign-in-gated "add a comment" affordance, no write path, no fake identity | — | — | CoS 7. `"use client"` only if a trigger forces it. |
| 8 | `app/[locale]/post/[slug]/page.tsx` (server): await `params`, resolve post by slug or `notFound()`; render meta + **full body** + image + vote slot + back-to-feed + thread + composer | — | — | CoS 1, 2, 4, 8, 10. Sets `setRequestLocale`. |
| 9 | `generateMetadata` for the page: own `alternates` (canonical/hreflang for the slug, not the home URL); wrapped title | — | — | Per AGENTS metadata rule — each real sub-route sets its own alternates. |
| 10 | Responsive pass: single readable column at ~360px, no horizontal scroll; `rounded-lg`, no bold, semantic tokens | — | — | CoS 8, 9. |
| 11 | Test: detail sub-component renders for an anonymous visitor and contains Myanmar-block script (mixed-language thread item) | — | — | CoS 11. Async page can't render in Vitest — test the comment list / body piece. |
| 12 | Verify: `lint`, `build`, `test`; run the app logged out — card → detail, unknown slug → localised 404, thread renders | — | — | CoS 2, 11. Browser-only checks noted below. |
| 13 | `i18n:prompt` brief for new Shan strings + close-out (update PRD status, note verified vs browser-only) | — | — | Close-out. |

## Verified vs browser-only (to fill at close-out)

Async Server Components can't be rendered by Vitest (per the Next testing guide), and no
E2E setup exists. Expect to verify by shape + the prod server logged out, and flag the
genuinely browser-only checks (the ~360px single column / no-horizontal-scroll, and the
card→detail click-through) for the owner's browser — same split as PBI-010.

## Conditions of Satisfaction

Tracked in [prd.md](./prd.md#conditions-of-satisfaction). Each task's Notes column maps
back to the CoS it satisfies; close-out verifies every CoS, not just that tasks are ticked.
