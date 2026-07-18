# PBI-004 — Dark mode palette

| | |
| --- | --- |
| **Status** | Won't Do |
| **Created** | 2026-07-18 |
| **Decided** | 2026-07-18 |

## Decision

**Light mode only. Dark mode will not be built.**

Recorded as a PBI rather than deleted so the decision isn't relitigated every time
someone notices the inert `dark:` classes and assumes they're unfinished work.

## Background

`app/globals.css` declares `@custom-variant dark (&:is(.dark *))`, and the shadcn
components carry `dark:` utility classes throughout. No `.dark { ... }` token block
exists, so none of it has any effect.

This previously read as a gap. It is now a decision.

## What this means in practice

1. **Do not add** a `.dark` token block, a theme toggle, or `next-themes`.
2. **Do not strip** the `dark:` classes from `components/ui/*`. Those files are
   registry-managed — `npx shadcn@latest add` overwrites them, so edits would be lost
   and the components would drift from upstream. They are inert and harmless.
3. **Do not remove** `@custom-variant dark` from `globals.css` for the same reason.
4. New components need no `dark:` variants, but copying them from a shadcn primitive
   is fine and not worth cleaning up.

## If this is ever revisited

Dark mode becomes a **new PBI**, not a reopening of this one. It would need the brand
palette first (PBI-005), since picking light and dark tokens in one pass is the only
way to keep them coherent.
