# PBI-016 — Post detail page (shell + mock data)

| | |
| --- | --- |
| **Status** | Agreed |
| **Created** | 2026-07-22 |
| **Depends on** | PBI-010 (home feed + mock `Post` shape, Done) |
| **Relates to** | PBI-005 (moderation/report, Deferred), PBI-014 (sign-in dialog, Done) |

## Problem

The home feed built in PBI-010 renders post cards, but a card is a dead end. In
`components/feed/post-card.tsx` the whole `<article>` carries `cursor-pointer`
(line 18) yet is not a link, and the comment control is a bare `<button>` that goes
nowhere:

```
components/feed/post-card.tsx:79
<button type="button" aria-label={t("comments")} className={action}>
  <MessageSquare className="size-4" />
  <span className="tabular-nums">{post.comments}</span>
</button>
```

Every card shows a comment count (`post.comments`, 12–48 across the mock feed) with no
way to read those comments. There is no `/post/...` route — `app/[locale]/` has only
`page.tsx`, `about`, `terms`, `privacy`, and the 404 catch-all. Clicking a post, or its
comment count, is the single most obvious interaction the shipped UI invites and does
not honour.

The mock shape also can't express a detail view yet: `lib/feed.ts` `Post` has no stable
URL key (`id` only, no `slug`), the `body` is a single truncated line the card
`line-clamp-2`s, and there is no comment data type at all.

## Why it matters

Reading is the whole anonymous-visitor experience, and it is the recruiting mechanism:
posts, projects, profiles, and events must render **without a session** and stay
indexable (`AGENTS.md`). A discussion thread that can't be opened is a feed that shows
a conversation is happening but hides the conversation — the opposite of "public reach
is how this project finds people." A visiting Shan developer should be able to follow a
thread about, say, Shan word segmentation (mock post #2, 41 comments) end to end, logged
out, and see the community actually talking.

Like PBI-010, no database, auth, or posts feature exists, so a *working* thread is
impossible now. This PBI builds the **detail layout and a comment thread against typed
mock data**, so the read experience is real and reviewable and real data drops in later
without reworking the UI. It also fixes the specific dead-end the shipped feed ships.

## Scope

A single-post read view reached from the feed, rendered from typed mock data.

**In scope:**

- A **post detail route** under `app/[locale]/` that renders one post: author, relative
  time, per-post content-language tag, full title and **full body** (not the card's
  clamped two lines), and its optional image.
- A **mock comment thread** for that post — a typed comment shape in `lib/…`, rendered
  as a list under the post. Comments carry their own **content-language tag** (a thread
  may mix Shan and English), a pseudonymous author, and a relative time.
- **Navigation into the page:** the feed post card links to the detail route, and its
  comment control resolves there (closing the `post-card.tsx` dead button). A **back to
  feed** affordance returns the reader.
- **Signed-out reading:** the whole page renders with no session. Any "add a comment"
  affordance is a **disabled, sign-in-gated placeholder** (mirrors PBI-010's vote slot
  and PBI-014's gating) — not a working composer.
- The post's **vote slot and counts** reuse the same display-only treatment as the card.

**Out of scope — deliberately (each a later PBI or decision):**

- Real posts/comments, a database, or any data model beyond the mock's TypeScript shape.
- **Submitting a comment** — needs auth + a write endpoint + a rate limit (`AGENTS.md`
  requires one on every write path). The composer is a disabled placeholder only.
- The **voting mechanic** and any comment voting/sorting — still an open decision; slots
  and counts are display-only.
- **Nested/threaded replies** as a real feature — the mock may be flat, or one level
  deep at most; no collapse/expand interaction is required.
- **Report / moderation** on posts or comments — that is PBI-005 (Deferred). The post
  menu stays as-is.
- Pagination / "load more" comments, real-time updates, edit/delete.
- Profile, Projects, Events destination pages (their own PBIs); an author handle need
  not link anywhere yet.

## Conditions of Satisfaction

1. A **post detail route** exists under `app/[locale]/` and renders a single post from
   the typed mock source — reusing the PBI-010 `Post` data, not a hand-duplicated copy.
   `/shn` and `/en` both resolve it.
2. It renders **fully logged out** — no session required, nothing gated behind auth.
   (Verified by loading it with no auth.)
3. From the home feed, a **post card links to its detail page**, and the card's comment
   control resolves to that page — the `post-card.tsx:79` dead `<button>` no longer dead-
   ends. A **back to feed** affordance returns to `/`.
4. The detail view shows the **full post body**, not the card's `line-clamp-2` excerpt,
   plus author, relative time, and the post image when present.
5. A **comment thread renders from a typed mock data source** (e.g. `lib/…`), not
   hand-written per-comment JSX — so real comments can replace the mock without touching
   the UI. The post's `comments` count and the rendered thread are consistent for at
   least one sample post.
6. **Per-comment content-language tag:** comments carry their own language, independent
   of UI locale, and a thread mixing Shan and English renders each correctly via the
   existing font stack. Any Shan sample content is **real Shan** (owner-supplied) or the
   sample stays English — no fabricated Shan (same rule as PBI-010).
7. An **"add a comment" affordance is present but disabled / sign-in-gated** — no working
   composer, no write path. It never asserts a logged-in identity (PBI-014 rule).
8. **Mobile-first:** at ~360px the page is a single readable column and the body does
   **not** scroll horizontally.
9. **Monochrome, `rounded-lg` only, no `font-bold` on any text** (threads can contain
   Shan); semantic tokens only; reuses existing components (`buttonVariants`, `Reveal`,
   the card's author/meta treatment, shadcn primitives pulled via the CLI) before adding
   any new primitive.
10. **Server-Component-first:** the page and the comment list are Server Components;
    `"use client"` appears only on an interactive leaf, each justifiable by one of the
    four triggers in `AGENTS.md`.
11. `lint`, `build`, and `test` pass, and a test asserts the detail page renders **for an
    anonymous visitor** and still contains Myanmar-block script (following
    `__tests__/page.test.tsx`). Note Vitest cannot render async Server Components — if the
    page is async, cover what is testable and verify the rest by running the app.

## Notes

- **URL key — decided: `slug`.** At agreement the owner chose a slug over the bare `id`,
  so URLs read like `/post/shan-word-segmentation` (better for indexing and the recruiting
  reach the read view exists for). A `slug` field is added to the typed mock `Post` as a
  plain string — **not** a DB concern — and must be unique across the mock feed. The route
  is `app/[locale]/post/[slug]/page.tsx`; an unknown slug calls `notFound()` (which routes
  to the localised 404 per the `app/[locale]/[...rest]` catch-all).
- **Comment shape should anticipate the real model** (id, post id, author handle, created
  time, content-language tag, body, optional parent id for one-level replies) **without
  defining the DB schema** — a plain TypeScript type + array, mirroring how `Post` was
  handled.
- **Bilingual chrome.** New strings (e.g. "Comments", "Back to feed", the disabled
  composer's "Sign in to comment") need Shan + English. Per the current i18n rule, wire
  English and hand off Shan via `npm run i18n:prompt` (the web-searching agent translates,
  the owner reviews) — do not invent Shan; do not leave long copy untranslated.
- **Reuse ladder applies.** The comment row is likely the one genuinely new composite; it
  lives in `components/` (e.g. `components/feed/`), not `components/ui/`. Author avatar,
  meta line, and vote slot already exist on the card — factor/reuse rather than fork.
- **Async Server Components + tests.** If the page reads `params` (a Promise here) it will
  be async and Vitest can't render it directly; keep a testable synchronous piece (the
  comment list or the post body) or add the coverage as a plain render of a sub-component.
- Keep this to the **read view**. If a composer, voting, or reporting starts creeping in
  during breakdown, that is a separate PBI (auth/write-path/moderation), not this one.
