# PBI-012 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Unbuilt destinations are omitted** from the palette, not shown as unavailable.
  A palette full of dead ends is worse than a short one; they return as their pages
  land.
- **kbar confirmed viable**: `0.1.0-beta.48`, published 2025-07-29, declares
  `react: ^19.0.0` in peer deps. It is still a **beta** — recorded, not hidden.
- **Lazy-mounted, not app-wide.** The provider is dynamically imported on first
  activation, so a visitor who never opens search pays nothing. This is CoS 9 and it
  drives the whole component shape.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Install `kbar`; confirm React 19 peer support | Done | — | beta.48, React 19 declared. |
| 2 | `SearchTrigger` client leaf: nav field + mobile icon + `⌘K` listener | Done | — | CoS 1, 2. Owns "has the palette been opened yet". |
| 3 | `CommandPalette`: KBarProvider + portal + results, dynamically imported | Done | — | CoS 9. `ssr: false`, loaded on first activation only. |
| 4 | Actions: home, locale switch, theme switch | Done | — | CoS 3. Unbuilt destinations omitted. |
| 5 | Actions: mock posts by title + author | Done | — | CoS 4. |
| 6 | Verify Shan substring matching against kbar's matcher | Done | — | CoS 5. Provisional — **not** a tokenisation decision. |
| 7 | Wire into `TopNav`, replacing the disabled input and icon | Done | — | CoS 1, 8. |
| 8 | Palette strings: English + `TODO(shn)` | Done | — | CoS 10. Reuse `Nav.search`. |
| 9 | Tests: anonymous render, Shan input matches | Done | — | CoS 11. Verify they can fail. |
| 10 | Measure bundle delta, before vs after | Done | — | CoS 9. State the number. |
| 11 | Verify: lint, build, test, keyboard, ~360px, still static | Done | — | CoS 7, 11 verified here; CoS 2, 6, 8 need a browser — see below. |
| 12 | Docs: `AGENTS.md`, close out | Done | — | Same commit. |

## Bundle cost (CoS 9)

Measured on a clean production build, total client JS across `.next/static`:

| | Total client JS |
| --- | --- |
| Before | **1071.7 KB** |
| After | **1137.5 KB** |

kbar lands in its own **68.1 KB** chunk, and that chunk is **not referenced in the
initial HTML** of `/shn` — verified against a running production server. A visitor who
never reaches for search never downloads it, which is the whole point of CoS 9.

The cost of always-on would have been the 68 KB on every page load. Instead the
always-on cost is `SearchTrigger`: two buttons and a keydown listener.

## Verified vs browser-only

Verified here: `lint`, `build`, **21/21 tests** (stable over six consecutive runs).
`/shn` and `/en` return 200 from a production server and stay **statically
prerendered** (CoS 7). The Shan trigger renders server-side in Shan. The Shan-matching
test drives kbar's real matcher and was confirmed to fail when broken.

**Needs the owner's browser:**

- **CoS 2** — `⌘K` opens and `Esc` closes. The listener and kbar's binding are both
  wired; the key events aren't exercised.
- **CoS 6** — arrowing through results and the visible focus indicator.
- **CoS 8** — the palette at ~360px.

## Two jsdom shims were needed

Both are in `vitest.setup.ts`, and both are kbar's requirements, not ours:

- **`Element.prototype.animate`** — `KBarAnimator` calls it on mount; jsdom implements
  no Web Animations API.
- **`ResizeObserver`** — kbar virtualises its result list. Without the shim the list
  rendered intermittently and the matching test was **flaky**, passing roughly three
  runs in four. Found by running the suite repeatedly rather than once.

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. Top-nav search field opens the palette; the mobile icon opens the same one.
2. `⌘K` / `Ctrl+K` opens, `Esc` closes.
3. Navigation actions listed and functional (sections, locale, theme).
4. Typing filters mock posts by title and author; selecting navigates.
5. Shan input matches Shan content, verified with real Shan text.
6. Fully keyboard operable with a visible focus indicator.
7. Works with no session; pages stay statically prerendered.
8. Usable at ~360px.
9. Client JS confined to the palette; bundle delta measured and stated.
10. Chrome translated (English + `TODO(shn)`); no invented Shan.
11. `lint` + `build` + `test` pass; tests cover anonymous render and Shan matching.

## Out of scope

Full-text search over real content, the Myanmar tokenisation decision, ranking,
history, filters, a `/search` page, and any indexing infrastructure.
