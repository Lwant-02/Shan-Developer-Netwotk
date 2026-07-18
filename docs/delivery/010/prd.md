# PBI-010 — Build the real home page

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Depends on** | PBI-005 (brand colors), PBI-012 (locale routing) |

## Problem

`app/page.tsx` is four lines. It renders one centered string —
`မႂ်ႇသုင်ၶႃႈ - Hello This is Shan Developer Netwrok web app` — with no layout, no
navigation, and no explanation of what the site is.

It exists to prove Shan renders, which it does. It is not a home page.

## Why it matters

The home page is the recruiting mechanism. Anonymous visitors get full read access
specifically so the site can be found and shared, and this is the page that has to
explain — in Shan, to Shan developers — what this is and why they'd join.

## Conditions of Satisfaction

1. The page states what the project is and who it's for, in **both** `shn` and `en`,
   through the locale routing from PBI-012.
2. It renders fully **for an anonymous visitor**. No session, no auth prompt blocking
   content, and it stays indexable.
3. There is a clear path to sign in, without gating any readable content behind it.
4. It works on a **narrow viewport on a slow connection** — the target user is on a
   mid-range Android phone on mobile data. Check the client JS delta, don't assume it.
5. It is **Server-Component-first**. Any interactivity is pushed to the smallest leaf
   that needs `"use client"`.
6. Uses existing components and shadcn primitives — no new one-off components where
   `npx shadcn@latest add` or an existing `cva` variant would do.
7. Semantic tokens only. No hardcoded colors.
8. Shan text uses no `font-bold` — the fonts are Regular only.
9. Existing tests still pass, including the anonymous-render and Myanmar-script
   assertions in `__tests__/page.test.tsx`.

## Notes

- **Blocked on brand colors (PBI-005).** Building this against placeholder greys means
  designing it twice. That dependency is the main reason this isn't started.
- **Content is a human task.** The Shan copy needs a Shan speaker. Placeholder Shan
  written by an agent must not ship — mangled Shan on the home page would undercut
  the entire premise more than an empty page would.
- Typography carries the weight here given no bold is available on Shan. Size, color,
  and spacing are the tools.
- Worth deciding whether the home page shows real content (recent posts, projects) or
  is a static landing page. Real content depends on PBI-007 and a data model, so a
  static page first is the likelier scope — record the choice when this is agreed.
