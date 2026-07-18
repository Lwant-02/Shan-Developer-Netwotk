# PBI-006 — Locale-prefixed routing with next-intl

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-07-18 |
| **Agreed** | 2026-07-18 |
| **Implements** | PBI-004 (locale routing decision) |
| **Should land before** | any auth or home-page work — both add routes |

## Problem

PBI-004 decided the routing — **locale-prefixed URLs, Shan (`shn`) default** — but
nothing implements it. The app has no locale segment:

```
app/
  layout.tsx     # <html lang="en">, hardcoded
  page.tsx       # renders Shan script
  globals.css
```

Three concrete defects follow, all verified in the repo:

1. **The site declares Shan content as English.** `app/layout.tsx:40` hardcodes
   `lang="en"` while `app/page.tsx` renders `မႂ်ႇသုင်ၶႃႈ`. Screen readers apply English
   pronunciation rules to Shan text, and search engines index Shan content as English.
   For a project whose thesis is Shan content being findable, that is close to the
   worst metadata it could emit — and it is emitted on every page.
2. **Language cannot be expressed in a URL.** No `/shn`, no `/en`. A Shan speaker
   cannot send a link that opens in Shan, which is the basic sharing case for this
   community.
3. **No translation layer exists.** Every string is hardcoded in JSX, mixing Shan and
   English in one literal.

## Why it matters

This is the thesis expressed as URLs. The project exists because Shan-speaking
developers have nowhere treating their language as first-class; serving Shan content
under `lang="en"` at an unlabelled URL is the afterthought treatment it was built to
avoid.

It is also a reach requirement. Anonymous read access and indexability are the
recruiting mechanism, and both depend on search engines correctly identifying the
language of a page.

Finally, **sequencing**: `design.md` flagged deciding this as blocking because
retrofitting locale routing touches every route. The same applies to implementing it.
Doing this after auth or the home page means reworking their routes.

## Scope

**In scope** — UI locale routing and the translation layer.

- Locales: **`shn` (default) and `en`**. Burmese (`my`) deferred.
- **Both locales prefixed** — `/shn/...` and `/en/...`; `/` redirects to `/shn`.
  This is `next-intl`'s `localePrefix: 'always'`. The `'as-needed'` alternative
  (default locale unprefixed, Shan at `/`) was rejected in PBI-004: an explicit prefix
  makes the language visible in every shared link.

**Out of scope — do not conflate.** The **content** language tag carried by posts,
projects, and events is a separate field on the data model, independent of UI locale.
A user reading the UI in English must still see Shan-language content. See
`design.md` and `AGENTS.md`.

Also out of scope: the home page's real copy and localizing auth routes. This PBI
establishes the mechanism; those consume it.

## Conditions of Satisfaction

1. `/shn` and `/en` both serve the home page, each rendering its own locale's strings.
2. `/` redirects to `/shn`.
3. `<html lang>` matches the active locale on every page — `shn` under `/shn`, `en`
   under `/en`. No hardcoded value remains anywhere.
4. An unknown locale (`/fr`, `/xx`) returns a **404**, not a crash or an empty shell.
5. **Anonymous access is unaffected.** Every locale route renders with no session and
   stays indexable. Routing introduces no auth, cookie, or session dependency.
6. Locale alternates are discoverable to crawlers — `hreflang` alternates via the
   Next metadata API's `alternates.languages`.
7. UI strings come from message files, not hardcoded JSX. At minimum the existing home
   page string exists in both `shn` and `en`.
8. **Shan still renders in the Shan font under both locales** — the `--font-sans`
   stack from PBI-002 is unchanged, and Shan text appearing inside an `/en` page
   (a real case, since content is multilingual) still gets the AJ font.
9. The app stays **Server-Component-first.** Locale resolution must not push
   `"use client"` up the tree; any client component is a leaf. Check the client JS
   delta rather than assuming it — the target user is on mobile data.
10. Tests updated and passing. `__tests__/page.test.tsx` imports `@/app/page`, which
    moves under `[locale]` — the anonymous-render and Myanmar-script assertions must
    **survive the move, not be deleted**.
11. `npm run lint`, `npm run build`, and `npm test` pass, and the app is verified
    running — not just building.

## Notes

- **Library:** `next-intl@^4.13.2`. Verified compatible — peers are `next: ^16.0.0`
  and `react: ^19.0.0`. Not currently installed.
- **Read the Next docs first.** This repo runs a Next version whose App Router
  conventions may differ from training data. Check `node_modules/next/dist/docs/01-app/`
  for routing and middleware guidance before writing code, per `AGENTS.md`.
- **Structural change:** `app/layout.tsx` and `app/page.tsx` move into
  `app/[locale]/`. A root layout is still required. The test import path changes
  (CoS 10).
- **Middleware interacts with caching.** `next-intl` uses middleware for locale
  negotiation and redirects. Every page is currently prerendered as static content —
  middleware that varies on cookies can undermine that, which matters because
  anonymous reads are the common case. Verify pages are still static after wiring.
- **Locale detection — decided:** `Accept-Language` does **not** override. Every
  visitor with no explicit locale lands on `/shn`, regardless of browser language.
  Simpler, matches PBI-004 as written, and keeps pages static since nothing varies
  per request.
- **Translation content is a human task.** Nothing needed translating for this PBI —
  the home page is a greeting and the product name. When real copy lands it must be
  written by a Shan speaker; agent-written Shan must not merge.
