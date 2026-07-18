# PBI-010 — Home page: Reddit-style feed (shell + mock data)

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-18 |
| **Completed** | 2026-07-18 |
| **Depends on** | PBI-006 (locale routing, Done) |
| **Reference** | A Reddit desktop screenshot supplied by the owner |

> **Closed.** The owner translated all 19 chrome strings before merge, so no
> `TODO(shn)` placeholder ships — `/shn` renders entirely in Shan and
> `npm run i18n:prompt` reports clean. Two CoS are verified by shape but not runtime
> here: the ~360px layout (CoS 3) and the live locale switch (CoS 8) need a browser.
> Mock post bodies stay English (`lang: "en"`); the per-post language mechanism is
> built, but a truly mixed feed waits on real Shan post content. "Done" = merged +
> verified, not deployed (Vercel unlinked).

## Problem

`app/[locale]/page.tsx` renders one line — a greeting and the product name from the
message files. It proves the locale plumbing works; it is not a home page. There is no
navigation, no feed, no sense that this is a community platform.

The owner wants the home page modelled on **Reddit's feed layout**: a top nav, a left
navigation column, a centre feed of posts, and a right rail. `design.md` already names
the content this feed is made of — **Profiles, Projects, Posts, Events** — and sets the
access rule: **not signed in = read only**, signed in = interact.

"Like Reddit" has to be **translated, not copied**, because this product differs from
Reddit in ways that matter:

- **One community, not many.** There are no subreddits — the whole site *is* the Shan
  developer community. The left column is app navigation, not a community list.
- **Voting is undecided.** `design.md` never mentions upvotes, downvotes, or karma.
  The card gets a vote *slot*; the mechanic is a separate decision (see Scope).
- **No ads and no "Ask" AI.** Those Reddit surfaces have no place here.
- **The reference is a desktop screenshot, but the primary user is mid-range Android
  on mobile data.** The build is **mobile-first**; the three-column layout is the wide
  case, not the default.

There is also **no database, no auth, and no posts feature yet**, so a *working* feed
is impossible now. This PBI therefore builds the **layout and the post card against a
typed mock feed**, so the whole experience is real and reviewable and real data can
drop in later without reworking the UI.

## Why it matters

The home page is the front door and the recruiting surface: it must render **logged
out** and stay indexable, because public reach is how this project finds people. A live
feed — even mock — is what tells a visiting Shan developer that a community exists here,
which is the entire point. Getting the shell right now also sets the layout, the
navigation, and the post card that every later feature (real posts, projects, events)
plugs into.

## Scope

The home page as a **Reddit-style responsive shell with a post feed rendered from typed
mock data**.

**In scope:**

- A responsive app frame: **top nav**, **left navigation**, **centre feed**, **right
  rail** — collapsing to a single column on mobile.
- A **post card** component driven by a typed `Post` shape, rendered from a mock feed.
- The card carries a **vote-control slot** and a **comment / share row**, visually
  present but non-functional (mock counts, no mechanic).
- **Mixed-language feed:** posts carry their own content-language tag and render Shan
  and English correctly in the same list.
- **Signed-out chrome:** a "Sign in" affordance where Reddit shows Create / notifications
  / avatar. No fake logged-in UI.
- A **locale switcher** (shn/en) in the nav.

**Out of scope — deliberately (each a later PBI or decision):**

- Real posts, a database, or any data model beyond the mock's TypeScript shape.
- Auth / sign-in (the button is a placeholder that routes nowhere yet).
- The **voting mechanic** — up/down vs like vs none is an open product decision; only
  the slot is built.
- Comments, a create-post flow, notifications, search wiring (search is a 🔴 in
  `design.md` — Myanmar-script tokenisation), infinite scroll / pagination.
- The Projects / Posts / Events / Profiles destination pages — nav links may point at
  not-yet-built routes (see Notes).
- Ads and the "Ask" AI surface.

## Conditions of Satisfaction

1. `/shn` and `/en` render a home page with **top nav, left navigation, a centre feed,
   and a right rail**, replacing the placeholder greeting.
2. It renders **fully logged out** — no session required, nothing gated. (Verified by
   loading it with no auth.)
3. **Mobile-first:** at ~360px it is a **single column** (the feed), the left nav
   collapses to a toggle/drawer, the right rail is hidden, and the page body does **not
   scroll horizontally**.
4. The feed renders **post cards from a typed mock data source** (e.g. `lib/…`), not
   per-post hand-written JSX — so real data can replace the mock without touching the
   card.
5. Posts carry a **per-post content-language tag**, and a feed mixing Shan and English
   posts renders each correctly via the existing font stack (content language ≠ UI
   locale).
6. The post card shows a **vote slot** and a **comment / share row**, visually complete
   but non-functional (mock counts) — no voting mechanic is implemented.
7. **Signed-out chrome:** a "Sign in" affordance is the only live action in the nav.
   Create, notifications, and the account avatar are present but **disabled**, so the
   shape of the signed-in nav is designed without fabricating a logged-in state — the
   avatar is a generic icon, never a user identity or presence indicator. Auth gates
   them for real in a later PBI.
8. A **locale switcher** (shn/en) is present and preserves the current path.
9. **Monochrome, `rounded-lg`, no `font-bold` on Shan**; semantic tokens only; reuses
   `buttonVariants`, `Reveal`, and shadcn primitives (pulled via the CLI) rather than
   new one-offs wherever one exists.
10. **Server-Component-first:** the page and post cards are Server Components;
    `"use client"` appears only on interactive leaves (mobile-nav toggle, locale
    switcher, any hover-stateful control), each justifiable by one of the four triggers.
11. **No search wiring, no infinite scroll, no ads/AI.** A search input, if shown, is a
    non-functional placeholder; the feed is a finite mock list.
12. `lint`, `build`, and `test` pass, and a test asserts the home renders **for an
    anonymous visitor** and still contains Myanmar-block script (extending
    `__tests__/page.test.tsx`), including a mixed-language feed item.

## Notes

- **Bilingual copy.** New chrome strings (nav labels, "Sign in", "Sign in to post",
  sort labels) need Shan + English. Shan is a human task — wire English and
  `TODO(shn):` placeholders and hand off via `npm run i18n:prompt`; do not invent Shan.
  **Mock post bodies in Shan must be real Shan** (owner-supplied) or the sample stays
  English — the feed must show *genuine* mixed language, not fabricated Shan.
- **Dead nav links.** Projects / Posts / Events / Profiles pages don't exist. Decide at
  agreement time whether their nav links are disabled ("coming soon") or allowed to
  resolve to the designed 404. Prefer disabled to avoid shipping links that 404.
- **The mock `Post` shape should anticipate the real model** (id, author handle, created
  time, language tag, title, body, media?, counts) **without defining the DB schema** —
  that's a later PBI. Keep it a plain TypeScript type + array.
- **Reuse ladder applies.** Cards, avatars, dropdowns, inputs → `npx shadcn@latest add`.
  The post card is the one genuinely new composite; it lives in `components/`, not
  `components/ui/`.
- This is a large UI PBI. If it grows past the shell + card + mock feed during
  breakdown, split the destination pages and any real-data work into follow-up PBIs
  rather than expanding this one.
