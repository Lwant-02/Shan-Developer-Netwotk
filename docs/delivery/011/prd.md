# PBI-011 — Dark mode

| | |
| --- | --- |
| **Status** | Agreed |
| **Created** | 2026-07-18 |
| **Supersedes** | [PBI-003](../003/prd.md) — "light mode only", reversed by the owner |
| **Depends on** | PBI-010 (home page shell — the toggle lives in the left nav) |

## Problem

[PBI-003](../003/prd.md) decided **light mode only**, and `design.md` records it as
🟢 decided. **The owner has reversed that call.** This PBI supersedes it rather than
reopening it, because 003's own text says a revisit becomes a new PBI, and because the
decision it records is still worth keeping legible — someone reading the repo in six
months should be able to see that light-only was chosen deliberately and then changed,
not that it was never thought about.

The groundwork is already in place and inert:

- `app/globals.css` declares `@custom-variant dark (&:is(.dark *))`.
- Every `components/ui/*` primitive carries `dark:` utility classes.
- `@theme inline` already maps every semantic token to a `--var`, so a `.dark` block
  overriding those vars is all the palette needs.

What is missing is the `.dark` token block, a way to set the class, and a control.

## Why it matters

The stated audience is Shan developers on mid-range Android. Dark mode is not a
cosmetic preference for that user:

- **OLED and battery.** Most budget Android phones sold in the region ship OLED
  panels, where a dark UI measurably reduces draw. This is a reading-heavy feed.
- **Low-light reading is the common case** for a community that is largely
  after-hours, and a full-white feed at night is the most common reason people bounce
  off a text-heavy site.
- **It is the platform default expectation.** A site that ignores the OS setting reads
  as unfinished regardless of how considered the light palette is.

## Conditions of Satisfaction

1. A **`.dark` token block** in `globals.css` overrides every semantic token already
   declared under `:root` — background, foreground, card, popover, primary, secondary,
   muted, accent, destructive, border, input, ring, the five charts, and the eight
   sidebar tokens. No token is left to inherit its light value.
2. The palette stays **greyscale**, consistent with the light theme. Brand colour is
   still open in `design.md`; this PBI does not pick one.
3. **Theme is applied before first paint.** No white flash on load or navigation,
   including for a visitor whose stored preference is dark. Verified on a cold load,
   not just on toggle.
4. **The OS preference is respected by default** (`prefers-color-scheme`), and an
   explicit user choice overrides and persists across reloads.
5. **A theme toggle sits in the left nav's secondary group**, below the rule added by
   PBI-010, and is reachable in the mobile drawer too.
6. **Anonymous visitors get the same behaviour.** No session, no gate — consistent with
   the project's public-read rule.
7. **Pages stay statically prerendered.** Theming must not push `/shn` or `/en` from
   static to dynamic, and must not consult headers. (This is the trap PBI-008 hit with
   `getTranslations()`.)
8. **Shan text stays legible in dark.** No `font-bold` is introduced — the AJ fonts are
   Regular-only — and contrast is checked against Shan glyphs specifically, whose tone
   marks are fine strokes that thin out badly on dark backgrounds.
9. `components/ui/*` are **not edited**. Their `dark:` classes activate as-is; the
   files stay registry-managed.
10. `lint`, `build`, and `test` pass, and a test covers the toggle rendering for an
    anonymous visitor.

## Notes

- **The whole UI changes at once.** Every inert `dark:` class in `components/ui/*` goes
  live the moment `.dark` exists, so this needs a visual pass over the home page, the
  404s, and the nav — not just a palette paste.
- **`next-themes` is the expected mechanism** (it handles the pre-paint script,
  `prefers-color-scheme`, and persistence). It requires a client provider; keep it at
  the root and keep the toggle itself the only client leaf beyond it.
- **`suppressHydrationWarning` on `<html>`** is required, since the pre-paint script
  mutates the class before React hydrates.
- **New Shan strings** (the toggle's label) follow the usual rule: English +
  `TODO(shn):`, handed off via `npm run i18n:prompt`. Never invented.
- Update `design.md` (the 🟢 "not building it" entry and the resolved-questions table)
  and `AGENTS.md` (the "Known gaps" bullet that forbids exactly this work) **in the
  same commit** — three documents currently assert light-only.
