# Shan Developer Network

A community platform for Shan-speaking developers — connect with other developers,
share projects, write posts, and host events. Built so that Shan-script content is
first-class and Shan developers are findable as a group. **Language and locality**
are the entire reason it exists; global platforms do everything else better and will
never do this.

Anyone can read, without an account. Signing in with Google or GitHub is what lets
you post and interact.

> **Status: pre-alpha scaffold.** The foundations — build tooling, theming, fonts,
> component conventions, and tests — are in place. No product features are built
> yet; `app/page.tsx` renders a single line. [`design.md`](./design.md) holds the
> thesis, the planned scope, and the decisions still to be made;
> [`docs/delivery/backlog.md`](./docs/delivery/backlog.md) holds the work.

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
| Fonts      | Montserrat (Latin) + AJ 12 / A J Kunheing 00 (Shan), via `next/font` |
| Database   | Neon (Postgres) — not yet wired                           |
| Hosting    | Vercel                                                    |
| Tests      | Vitest + React Testing Library                            |

Two choices here differ from the common defaults and are worth knowing before you
write code: this shadcn setup sits on **Base UI rather than Radix**, so components
import from `@base-ui/react/*` and don't use the `asChild`/`forwardRef` patterns
you may expect; and Tailwind v4 is **configured entirely in CSS**, so theme tokens
live in the `@theme inline` block of `app/globals.css` rather than a JS config file.

## Layout

```
app/
  layout.tsx     # root layout — fonts, metadata, html/body shell
  page.tsx       # home — one line of Shan + English for now
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

- **Font licensing is unresolved.** Both bundled fonts embed *All Rights Reserved*.
  This **blocks publishing the repository** — see
  [PBI-001](./docs/delivery/001/prd.md).
- **Fonts ship unsubsetted.** ~250 KB of `.ttf`. They should be subsetted `.woff2`;
  the audience is on mobile data. The highest-leverage perf win available.
- **The palette is entirely greyscale.** Brand colors haven't been chosen.
- **`motion` and `lucide-react` are installed but unused.**

Deliberately *not* being built, so they don't read as gaps:

- **Dark mode.** Light mode only. Components keep inert `dark:` classes so they stay
  in sync with the shadcn registry — leave them.
- **Zawgyi detection or conversion.** Unicode only.

## Commands

| Command              | Does                          |
| -------------------- | ----------------------------- |
| `npm run dev`        | Dev server on port 3000       |
| `npm run build`      | Production build              |
| `npm start`          | Serve a production build      |
| `npm run lint`       | ESLint                        |
| `npm test`           | Vitest, single run            |
| `npm run test:watch` | Vitest in watch mode          |

## Contributing with AI agents

[`AGENTS.md`](./AGENTS.md) holds the conventions and gotchas for this repo and is
read automatically by most coding agents. `CLAUDE.md` imports it. If you change a
convention, change it there — that's the single source of truth.
