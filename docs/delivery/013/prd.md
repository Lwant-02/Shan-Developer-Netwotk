# PBI-013 — Dark-only theme

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-20 |
| **Supersedes** | [PBI-011](../011/prd.md) — "light and dark", reversed by the owner |
| **Depends on** | PBI-011 (removes the machinery 011 added) |

## Problem

[PBI-011](../011/prd.md) built **light and dark** with a `next-themes` toggle,
superseding the light-only [PBI-003](../003/prd.md). **The owner has reversed that
call again**: the product should ship **one theme — dark only** — to match the
developer-tool aesthetic the audience expects. This PBI supersedes 011 rather than
reopening it, keeping the light+dark decision legible the same way 011 kept 003's.

Dark-only is not "011 minus the light palette." It removes the entire theme-switching
apparatus — the provider, the toggle, the persisted preference, and the pre-paint
script — and makes the existing greyscale dark palette the only one, declared in
`:root`.

## Why it matters

- **Aesthetic fit.** A single, opinionated dark surface reads as a developer tool; a
  theme switcher on a small community site is chrome that earns nothing here.
- **Less client JS.** `next-themes` ships a client provider and a pre-paint script to
  every page. Removing it is squarely aligned with the mid-range-Android,
  ruthless-about-client-JS constraint.
- **Removes a whole class of bug.** The `next-themes` script re-reconciling on the
  client is exactly what forced the `DevConsoleFilter` workaround (the warning on
  locale switch and on the 404). No `next-themes`, no script, no warning, no filter.
- **Invariant output.** With no OS-preference read and no persisted choice, every URL
  renders identically — friendlier to static prerendering and to anonymous readers.

## Conditions of Satisfaction

1. **Dark is the only theme.** The greyscale palette already in `globals.css` becomes
   the `:root` palette, applying to the whole app and to **both** 404 pages. There is
   **no toggle** and no way to reach a light theme.
2. **`next-themes` is removed** — the dependency, `components/theme-provider.tsx`,
   `components/shell/theme-toggle.tsx`, and the `useTheme`/`setTheme` actions in the
   command palette all go.
3. **`components/shell/dev-console-filter.tsx` is removed**, along with its three call
   sites (`layout.tsx`, both `not-found.tsx`). Its only reason to exist was the
   `next-themes` pre-paint script, which no longer renders.
4. **The palette lives in `:root`, with no theme class and no React state.** The
   shadcn `dark:` variants in `components/ui/*` must keep applying, so the `dark`
   custom-variant becomes unconditional; those files stay **unedited** and
   registry-managed.
5. **No white flash and no theme state.** Nothing consults `prefers-color-scheme` or
   persists a choice; `/shn` and `/en` stay statically prerendered and header-free.
6. **Anonymous parity.** No session, no gate — the theme is the same for everyone.
7. **Shan text stays legible in dark.** No `font-bold` is introduced (AJ fonts are
   Regular-only), and contrast holds against Shan tone marks on the dark background.
8. `lint`, `build`, and `test` pass, and the existing `not-found` tests still pass.
   Any test asserting a theme toggle is removed.
9. `design.md` (the "Dark mode" decision, the stale light-only "Brand color" section,
   and the resolved-questions table) and `AGENTS.md` (the theme-with-CSS rules and the
   `theme-provider` note) are updated **in the same change** — several documents
   currently assert light+dark or light-only.

## Notes

- **Override `:root`; don't pin a theme class.** The dark values move into `:root` and
  the `.dark` block is deleted. This is why the 404 pages need no special handling —
  they render outside the locale layout but still inherit `:root`, so they get the
  palette for free rather than re-declaring a class the way they re-declare fonts.
- **The `dark` variant must become unconditional** — `@custom-variant dark (&)`.
  `components/ui/*` is registry-managed and ships `dark:` utilities; scoping the
  variant to `.dark` (which no longer exists) would silently drop them, and removing
  the override entirely would fall back to `@media (prefers-color-scheme: dark)`,
  tying appearance to the visitor's OS — which contradicts "dark only". Verify in the
  built CSS that `dark:` rules emit without a `.dark` ancestor.
- **`color-scheme: dark`** should be set so native controls, form fields, and the
  scrollbar render dark without JS.
- **`suppressHydrationWarning` on `<html>`** is no longer needed for theming (no
  script mutates the class), but removing it is optional and out of scope.
- **No new Shan strings.** This removes UI (the toggle), so the `Nav.theme*` message
  keys become unused; delete them from both locale files.
