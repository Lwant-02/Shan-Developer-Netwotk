---
name: ui-conventions
description: Use when building, designing, styling, or refactoring any UI in this repo — pages, layouts, components, forms, or styling changes. Enforces reuse-before-create, shadcn (Base UI) primitives, Tailwind v4 semantic tokens, and Server-Component-first structure.
---

# Building UI in this repo

Goal: **clean and maintainable**, which here means the codebase gains as few new
moving parts as possible. Most UI work should add zero new primitives.

## Before writing a component, in this order

**1. Look for what already exists.**

```bash
ls components/ components/ui/
```

If an existing component almost fits, extend it — add a `cva` variant. Do not fork a
near-identical copy. Two components differing by a radius or a padding is the debt
this repo is trying to avoid.

**2. If it's a standard pattern, pull it from shadcn.**

```bash
npx shadcn@latest add dialog card input   # etc.
```

Don't hand-write dialogs, cards, dropdowns, inputs, tooltips, sheets — the registry
has them. Critically: **do not paste a shadcn component from memory.** Training-data
shadcn is Radix-shaped (`@radix-ui/react-*`, `asChild`, `React.forwardRef`). This
repo is **Base UI**-shaped (`@base-ui/react/*`). They are not interchangeable.

**3. Only then write something new.**

App-specific composites go in `components/`. **Not** `components/ui/` — that
directory is registry-managed and `shadcn add` will overwrite it.

## The component shape

Copy `components/ui/button.tsx`. It is the reference:

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva("base classes", {
  variants: { variant: { ... }, size: { ... } },
  defaultVariants: { variant: "default", size: "default" },
})

function Button({ className, variant, size, ...props }:
  ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button"
    className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
```

Non-negotiable in that shape: plain named `function` (no `forwardRef` — React 19),
a `data-slot`, `cn()` wrapping everything, `cva` for variants, variants exported
alongside the component, props typed off the Base UI primitive.

## Styling rules

- **Tailwind utilities only.** No CSS modules, no styled-components, no inline
  `style={{}}` for anything a utility expresses. Genuine one-off CSS goes in the
  `@layer base` block of `app/globals.css`.
- **Semantic tokens only:** `bg-background`, `bg-card`, `text-muted-foreground`,
  `border-border`. A raw `bg-neutral-900` or a hex opts that element out of theming
  and out of dark mode when the palette lands.
- **Always `cn()`** from `@/lib/utils`, never template-string concatenation — `cn()`
  resolves conflicting utilities, template strings don't, and the bug only surfaces
  when a caller passes `className`.
- **Accept and merge `className`** last on anything composable.
- **Radii: `rounded-lg` only.** One radius everywhere — cards, inputs, dialogs,
  images, buttons. Not `rounded-md`, not `rounded-xl`, not a pixel value. If a design
  seems to want a different corner, it doesn't; use spacing or a border instead.
  `components/ui/` is the exception — it's registry-managed, so leave the radii
  `shadcn add` ships rather than forking those files.
- **New design tokens** go in the `@theme inline` block in `app/globals.css`. There
  is no `tailwind.config.js` — Tailwind v4 is configured in CSS, deliberately.

## Structure

- **Server Component by default — a hard rule.** A file earns `"use client"` **only**
  when it directly uses state (`useState`/`useReducer`), effects (`useEffect`), a
  browser-only API, or a DOM event handler (`onClick`, `onChange`, …). Nothing else:
  not `useTranslations`, not `async` data fetching, not taking a `className`. When you
  do need the client, **extract the interactive control into its own leaf component**
  and keep its parents on the server — never convert a whole page or layout for one
  `onClick`. Be able to name which of the four triggers forced the directive. The
  target user is on a mid-range Android phone on mobile data; every client component
  is JS they download and run.
- **Icons** are `lucide-react` (installed, currently unused).
- **Animation** is `motion` (installed, currently unused). Prefer CSS/Tailwind
  transitions first; reach for `motion` only when a transition genuinely can't.

## Repo-specific traps

- **Shan text has no bold.** Both fonts in `public/fonts/` are Regular only
  (`usWeightClass 400`). `font-bold` on Shan script triggers synthesized faux-bold,
  which distorts Myanmar-block marks. Express emphasis with size, color, or spacing.
- **Dark mode has no palette yet.** `dark:` variants are correct to write, but no
  `.dark { ... }` token block exists, so you cannot visually verify dark mode today.
- **`* { cursor: pointer }`** in `globals.css` applies a pointer cursor to every
  element including text. If it obstructs you, raise it — don't silently delete it.
- **Text is multilingual**, and content language is independent of UI locale. Don't
  hardcode text direction or assume one language per page.

## Before you call it done

```bash
npm run lint
npm run build
npm test
```

Vitest can't render async Server Components, so tests are a floor, not a substitute —
verify UI by actually running `npm run dev` and looking at it.
