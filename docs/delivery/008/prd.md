# PBI-008 — Design the 404 page

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Depends on** | PBI-006 (locale routing, Done) |

## Problem

There is no `not-found` page anywhere in `app/`, so every 404 renders Next's default:
an unstyled black-on-white "404 | This page could not be found." It is in English
regardless of locale, carries no navigation, and looks like a broken deployment
rather than a page of this site.

This is reachable today, and by more paths than it looks:

- `/shn/anything` and `/en/anything` — any unknown route under a valid locale.
- `/fr` → redirects to `/shn/fr` → 404. Verified in PBI-006; the amended CoS 4 there
  accepted the redirect, which makes the destination page more important, not less.
- `/fr.txt` — a malformed segment that bypasses `proxy.ts` and 404s through the
  layout's `hasLocale` guard.

## Why it matters

A 404 is a first impression as often as the home page is — it is what a stale link
from a chat group or a search result lands on. An English-only, unstyled 404 on a
Shan-language site tells a Shan-speaking visitor the site isn't really for them, which
is precisely the impression this project exists to avoid.

The two 404 paths above also differ: one is inside a known locale and can be
localised, the other has no locale at all. Both need an answer.

## Scope

A designed, localised not-found page, plus the root-level fallback for requests that
never resolved a locale.

**Out of scope:** a full design system, an error page for 500s, and search or
suggested-links features. Keep it to a clear message and a way back.

## Conditions of Satisfaction

1. `app/[locale]/not-found.tsx` renders for unknown routes under a valid locale, in
   **that locale's language**, with strings from `messages/<locale>.json`.
2. A **root-level fallback** handles requests that never resolved a locale (e.g.
   `/fr.txt`). It must not crash on a missing locale context — decide and record
   whether it renders in Shan or is language-neutral.
3. Both return HTTP **404**, not 200 with 404-looking content. Verify the status code,
   not just the markup.
4. There is a way back — a link to the locale's home page that preserves the active
   locale.
5. Renders **with no session** and is not indexable as real content.
6. **Monochrome only** — semantic tokens (`bg-background`, `text-muted-foreground`),
   no hardcoded colours. The palette is deliberately black and white, so hierarchy
   comes from size, spacing, and borders.
7. **`rounded-lg` for any corner**, per the single-radius rule in `AGENTS.md`.
8. **No `font-bold` on Shan text.** The AJ fonts are Regular only; bold is synthesized
   and distorts Myanmar marks. This is the constraint most likely to be broken by a
   generic "big bold 404" layout.
9. Shan renders in the Shan font, via the existing `--font-sans` stack. Unchanged from
   PBI-002.
10. **Server Component.** No `"use client"` — a 404 page needs no interactivity.
11. Reuses existing components. The "go home" affordance should be `components/ui/button.tsx`
    (or its `link` variant), not a new one-off. See the reuse ladder in `AGENTS.md`.
12. Readable on a narrow viewport — mid-range Android on mobile data.
13. A test asserts the localised 404 renders and that Shan script survives, in the
    shape of the existing `__tests__/page.test.tsx`.
14. `npm run lint`, `npm run build`, and `npm test` pass, and it is verified in the
    running app at a real unknown URL.

## Notes

- **Copy is a human task where it's Shan.** The English string can be drafted; the
  Shan string must be written by a Shan speaker, per the rule established in PBI-006.
  Do not machine-translate or invent it.
- Next has separate `not-found.tsx` and `global-error.tsx` conventions and they behave
  differently. **Read** `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`
  before writing either — this repo's Next differs from training data.
- Worth checking whether `notFound()` in the layout (added in PBI-006) resolves to the
  `[locale]` not-found or the root one. That determines where CoS 2's fallback lives,
  and it is easy to get wrong silently.
- Keep it small. This should add one page and a couple of message keys, not a layout
  system.
