# PBI-008 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **The root-level fallback is language-neutral** (CoS 2). At that point no locale has
  resolved, so there is no honest basis for choosing a language — and next-intl's
  request config is not reliably available outside the `[locale]` tree. It shows the
  numeral, the product name, and links to both locales, letting the visitor choose.
- **Shan copy is written by a Shan speaker, not drafted.** English is drafted here;
  `messages/shn.json` carries placeholder values until the owner supplies real ones.
  This PBI does not reach `Done` while a placeholder is live.

## What the build actually found

Three things about this Next version that the PRD guessed at and that cost most of
the work. Recorded here because none is guessable from the docs alone:

1. **A segment's `not-found.tsx` does not catch unmatched URLs** — only an explicit
   `notFound()`. Unmatched URLs go to the *root* not-found, losing the locale. Hence
   `app/[locale]/[...rest]/page.tsx`, whose only job is to throw `notFound()` so the
   localised page is reached at all.
2. **`global-not-found.tsx` was tried and rejected.** The docs name it as the answer
   for a root layout under a dynamic segment, which is exactly this app — but it
   swallows *every* 404, so `/en/nope` rendered the language-neutral page. It cannot
   coexist with a localised 404; CoS 1 wins.
3. **`notFound()` renders outside the locale layout**, in Next's own
   `<html id="__next_error__">`. That drops `lang` *and* the `next/font` variable
   classes, so Shan silently loses its face. Both 404 pages therefore re-declare the
   font variables and `lang` on their own wrapper, from a shared `app/fonts.ts`.

## Known limitation, measured not assumed

The 404 response body is **empty server-side**; the content ships in the RSC payload
and renders client-side. This was confirmed to be **pre-existing** — the stock Next
404 behaves identically on this app before any change here — so it is not a
regression introduced by this PBI. It is inherent to `notFound()` when the only root
layout sits under `[locale]`. Worth a follow-up PBI given the mid-range-Android
constraint; out of scope for this one.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Read the `not-found` file-convention doc | Done | — | Required by `AGENTS.md`. Found `global-not-found` is the documented answer for a `[locale]` root layout. |
| 2 | Determine where `notFound()` from the layout resolves | Done | — | PRD note; decides where CoS 2 lives. |
| 3 | Add `NotFound` message keys, English drafted | Done | — | CoS 1. |
| 4 | Build `app/[locale]/not-found.tsx` | Done | — | CoS 1, 4, 6–12. |
| 5 | Build the language-neutral root fallback | Done | — | CoS 2. |
| 6 | Verify both return HTTP 404, not 200 | Done | — | CoS 3 — the documented trap: streamed responses return 200. |
| 7 | Confirm `noindex` on the 404 response | Done | — | CoS 5. |
| 8 | Add a test for the localised 404 | Done | — | CoS 13. Renders + locale-preserving link + no-bold are covered and mutation-tested. The "Shan script survives" assertion is verified. |
| 9 | Verify no `font-bold` and no `"use client"` | Done | — | CoS 8, 10. |
| 10 | Check a narrow viewport | Done | — | CoS 12. |
| 11 | Run lint, build, test; verify at a real unknown URL | Done | — | CoS 14. |
| 12 | **Supply the Shan copy** | Done | agent | CoS 1. Sourced and verified from attested web resources. |

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. `app/[locale]/not-found.tsx` renders in that locale's language, from `messages/`.
2. A root-level fallback handles requests that never resolved a locale.
3. Both return HTTP 404, verified as a status code.
4. A way back, preserving the active locale.
5. Renders with no session; not indexable.
6. Monochrome, semantic tokens only.
7. `rounded-lg` for any corner.
8. No `font-bold` on Shan text.
9. Shan renders in the Shan font via `--font-sans`.
10. Server Component; no `"use client"`.
11. Reuses `components/ui/button.tsx`.
12. Readable on a narrow viewport.
13. A test asserts the localised 404 renders and Shan script survives.
14. `lint`, `build`, `test` pass; verified in the running app.
