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
> yet; `app/[locale]/page.tsx` renders a single line. [`design.md`](./design.md) holds the
> thesis, the planned scope, and the decisions still to be made;
> [`docs/delivery/backlog.md`](./docs/delivery/backlog.md) holds the work.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open <http://localhost:3000> — it redirects to `/shn`.

`.env.local` is gitignored; `.env.example` is the tracked template. The only variable
today is `NEXT_PUBLIC_SITE_URL`, the canonical origin used for absolute URLs in
`sitemap.xml` and `robots.txt`. It falls back to `http://localhost:3000` locally and
to Vercel's `VERCEL_PROJECT_PRODUCTION_URL` on a deployment, so it only needs setting
once a real domain exists.

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
| Fonts      | Google Sans (Latin) + AJ 12 / A J Kunheing 00 (Shan), via `next/font` |
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
  [locale]/      # every route lives under a locale segment (/shn, /en)
    layout.tsx   # root layout — fonts, metadata, html/body shell, lang
    page.tsx     # home — a greeting for now
  globals.css    # Tailwind entry, @theme tokens, design system variables
i18n/            # next-intl routing + request config
messages/        # UI strings per locale (shn.json, en.json)
proxy.ts         # locale redirects (NOT middleware.ts — deprecated in Next 16)
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

## Credits

The Shan fonts are the work of **AJ (Jao Kunheing / Nawone Sai)**, built and shared
for the Shan community — [ajfonts](https://ajfonts.netlify.app/) ·
[Shan Font Library](https://shan-font-library.vercel.app/). Shan text on this site
renders because of that work. See [`public/fonts/CREDITS.md`](./public/fonts/CREDITS.md).

## Contributing with AI agents

[`AGENTS.md`](./AGENTS.md) holds the conventions and gotchas for this repo and is
read automatically by most coding agents. `CLAUDE.md` imports it. If you change a
convention, change it there — that's the single source of truth.
