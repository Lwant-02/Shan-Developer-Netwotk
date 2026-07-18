# PBI-011 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Supersedes PBI-003 rather than reopening it.** 003's own text prescribes a new
  PBI, and IDs are never reused. 003 stays `Won't Do` so the original reasoning
  remains readable.
- **Greyscale dark palette**, mirroring the light one. Brand colour is still open in
  `design.md` and is not picked here.
- **`next-themes`** for the pre-paint script, OS-preference default, and persistence.
- **Toggle lives in the left nav's secondary group**, below the rule added by PBI-010.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | `.dark` token block in `globals.css` | Done | — | CoS 1, 2. Every `:root` token overridden. |
| 2 | Install `next-themes`; provider at the root layout | Done | — | CoS 3, 4, 7. `suppressHydrationWarning` on `<html>`; the wrapper is **not** `"use client"` — see below. |
| 3 | `ThemeToggle` client leaf | Done | — | CoS 5. CSS swap, **not** a mounted guard — lint rejects `setState` in an effect. |
| 4 | Wire the toggle into `LeftNav`'s secondary group | Done | — | CoS 5. Reachable in the mobile drawer too. |
| 5 | New toggle strings: English + `TODO(shn)` | Done | — | Handed off via `i18n:prompt`. |
| 6 | Visual pass: home, 404s, nav in dark | **Owner** | owner | CoS 8. Needs a browser — see below. |
| 7 | Test: toggle renders anonymously | Done | — | CoS 6, 10. |
| 8 | Verify: lint, build, test, no flash, still static | Done | — | CoS 3, 7, 10. |
| 9 | Docs: `design.md`, `AGENTS.md`, PBI-003 pointer | Done | — | Three documents currently assert light-only. |

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. `.dark` block overrides every semantic token declared under `:root`.
2. Palette stays greyscale; no brand colour picked.
3. Theme applied before first paint — no white flash on a cold load.
4. OS preference by default; explicit choice overrides and persists.
5. Toggle in the left nav's secondary group, reachable on mobile.
6. Anonymous visitors get the same behaviour; nothing gated.
7. Pages stay statically prerendered; no header reads.
8. Shan stays legible in dark; no `font-bold`; tone marks checked.
9. `components/ui/*` untouched.
10. `lint` + `build` + `test` pass; a test covers the toggle rendering anonymously.

## The wrapper must not be a Client Component

`components/theme-provider.tsx` has no `"use client"`. next-themes' own provider
carries it, so the wrapper stays a Server Component and the pre-paint `<script>` is
rendered on the server only.

Marking the wrapper `"use client"` makes React re-render that script on every client
navigation — switching locale, for instance — and React 19 rejects it: *"Encountered
a script tag while rendering React component."* Found by the owner after the warning
survived both a `next/script` `beforeInteractive` rewrite and a hand-rolled
replacement, neither of which addressed the actual cause.

## Verified vs browser-only

Verified here: `lint`, `build`, and **18/18 tests** pass. `/shn` and `/en` stay
**statically prerendered** (CoS 7) and the production HTML carries the inline
pre-paint script that reads `localStorage` and sets `classList` before render, so
there is no flash (CoS 3). The `.dark` tokens compile into the production CSS.

**Needs the owner's browser** (CoS 8, task 6): the actual look of the dark palette
across the home page and nav, and specifically whether **Shan tone marks hold up** —
they are fine strokes, and light-on-dark thins them further. This is the one part of
this PBI that a build cannot confirm.

**The 404s stay light** by construction: they render outside the locale layout, so
they get neither the provider nor the pre-paint script. Recorded in `design.md`
rather than worked around.

## Out of scope

Brand colour selection, a per-theme logo or OG image, and dark-specific illustration
work. Those wait on the ≥512 art already tracked in the backlog's Open Questions.
