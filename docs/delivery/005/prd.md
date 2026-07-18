# PBI-005 — Choose brand colors

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Blocks** | PBI-010 (home page) |

## Problem

The palette is **entirely greyscale**. Every token in `app/globals.css` is a
zero-chroma `oklch` value — `--primary: oklch(0.205 0 0)`, `--destructive` aside, and
all five chart colors are greys (`oklch(0.87 0 0)` through `oklch(0.269 0 0)`).

That is the stock shadcn neutral base, untouched. The site currently has no visual
identity at all, and anything built before the palette lands will need revisiting.

## Why it matters

A community platform is partly an identity object — people decide whether it looks
like somewhere they belong. More practically, this **blocks the real home page**
(PBI-010): building a landing page against placeholder greys means designing it
twice.

There is also a Shan-specific angle worth considering rather than defaulting to a
generic tech palette: color carries cultural meaning, and this project's whole
argument is that it is *for* a particular community.

## Conditions of Satisfaction

1. A primary brand color is chosen and expressed as `oklch` semantic tokens in the
   `@theme inline` block of `app/globals.css`.
2. Accent and chart tokens are derived from it — no leftover greyscale chart colors.
3. Contrast meets **WCAG AA** for body text and interactive elements, verified rather
   than assumed. Shan script has fine marks and thin strokes; low contrast hurts it
   more than Latin.
4. Nothing hardcodes a hex or a raw Tailwind palette color — all consumption is via
   semantic tokens (`bg-primary`, `text-muted-foreground`).
5. `components/ui/button.tsx` variants render correctly with the new tokens, with no
   component edits required.
6. Light mode only — dark tokens are out of scope per PBI-004.

## Notes

- **This needs a human decision.** An agent can implement tokens and check contrast
  ratios; it should not pick the brand color. Choosing it is a product and cultural
  call.
- Worth checking whether any existing Shan community or Shan-language project has
  established colors that would read as familiar rather than arbitrary.
- Tailwind v4 here is CSS-configured. Tokens go in `@theme inline` in
  `app/globals.css` — there is no `tailwind.config.js`.
- Keep `--radius` and the existing radius scale untouched; this PBI is color only.
