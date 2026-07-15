# Shan Developer Network

A community platform for Shan-speaking developers — connect with other developers,
share projects, write posts, and host events. Built so that Shan-script content is
first-class and Shan developers are findable as a group. **Language and locality**
are the entire reason it exists; global platforms do everything else better and will
never do this.

Anyone can read, without an account. Signing in with Google or GitHub is what lets
you post and interact.

> **Status: pre-alpha scaffold.** The foundations — build tooling, theming, and
> component conventions — are in place. No product features are built yet;
> `app/page.tsx` is still a placeholder. [`design.md`](./design.md) holds the
> thesis, the planned scope, and the decisions still to be made.

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 16.2, App Router, React Server Components by default |
| UI         | React 19.2                                                |
| Language   | TypeScript, `strict` mode                                 |
| Styling    | Tailwind CSS v4 (CSS-first config — no `tailwind.config.js`) |
| Components | shadcn, `base-nova` style, built on [Base UI](https://base-ui.com) |
| Icons      | lucide-react                                              |
| Animation  | motion                                                    |
| Font       | Montserrat, via `next/font/google`                        |

Two choices here differ from the common defaults and are worth knowing before you
write code: this shadcn setup sits on **Base UI rather than Radix**, so components
import from `@base-ui/react/*` and don't use the `asChild`/`forwardRef` patterns
you may expect; and Tailwind v4 is **configured entirely in CSS**, so theme tokens
live in the `@theme inline` block of `app/globals.css` rather than a JS config file.

## Layout

```
app/
  layout.tsx     # root layout — fonts, metadata, html/body shell
  page.tsx       # placeholder
  globals.css    # Tailwind entry, @theme tokens, design system variables
components/
  ui/            # shadcn components (generated — prefer the CLI over hand-editing)
lib/
  utils.ts       # cn() — the clsx + tailwind-merge helper
public/icons/    # logo / favicon
```

`@/*` resolves to the repo root, so imports read as `@/lib/utils`,
`@/components/ui/button`.

## Working on the design system

Theme tokens are defined once in `app/globals.css` and consumed as semantic
Tailwind classes (`bg-background`, `text-muted-foreground`, `border-border`).
Always reach for a token rather than a literal color — hardcoded values won't
respond to theming.

Add components with the CLI rather than by hand, so they land in the project's
configured style:

```bash
npx shadcn@latest add dialog
```

## Known gaps

These are unfinished, not oversights to route around:

- **The Shan font isn't wired up yet.** `public/fonts/aj06.ttf` is in the repo, but
  `layout.tsx` still loads only Montserrat (`subsets: ["latin"]`), which has no
  Myanmar-block coverage — so Shan text doesn't render correctly today. Given the
  project's premise, this is the most important open item. See
  [`design.md`](./design.md).
- **Dark mode is wired but non-functional.** The `dark` variant is declared and
  components carry `dark:` classes, but no `.dark` token palette has been defined.
- **The palette is entirely greyscale.** Brand colors haven't been chosen.
- **No tests.** No test runner is configured yet.
- **`motion` and `lucide-react` are installed but unused.**

## Commands

| Command         | Does                          |
| --------------- | ----------------------------- |
| `npm run dev`   | Dev server on port 3000       |
| `npm run build` | Production build              |
| `npm start`     | Serve a production build      |
| `npm run lint`  | ESLint                        |

## Contributing with AI agents

[`AGENTS.md`](./AGENTS.md) holds the conventions and gotchas for this repo and is
read automatically by most coding agents. `CLAUDE.md` imports it. If you change a
convention, change it there — that's the single source of truth.
