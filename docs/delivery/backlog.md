# Product Backlog

The ordered list of Product Backlog Items (PBIs) for Shan Developer Network.
One row per PBI. Detail lives in `docs/delivery/<id>/prd.md` and `tasks.md`.

**This file is the index, not the spec.** Keep rows short; put reasoning in the PRD.

**PBIs are filed one at a time, by the owner, using the `create-pbi` skill** — when
the work is actually wanted, not speculatively. A backlog pre-stuffed with everything
that might one day be built is a wish list: it goes stale faster than it gets read,
and it invites building against items nobody decided on. Known-open work that hasn't
been scoped yet lives in `design.md` and in Open Questions below — not as `Proposed`
rows here.

## Status values

| Status | Means |
| --- | --- |
| `Proposed` | Written down, not agreed. Do not build. |
| `Agreed` | Scope settled, ready to pick up. |
| `InProgress` | Being worked on now. |
| `Done` | Shipped and verified. |
| `Reserved` | ID claimed for planned work, not yet drafted. |
| `Deferred` | Real, deliberately postponed. Not dropped. |
| `Won't Do` | Decided against. Kept so the decision isn't relitigated. |

A PBI must reach `Agreed` before code is written for it. This mirrors the
🟢/🟡/🔴 markers in `design.md` — don't build against a 🟡 or 🔴.

Resolve IDs with `npm run pbi:next` rather than reading this table by eye — it scans
every branch, so a PBI filed on an unmerged branch still holds its number.

## Backlog

| ID | Title | Status | Notes |
| --- | --- | --- | --- |
| [001](./001/prd.md) | Font attribution and licensing | Done | AJ (Jao Kunheing) built the fonts free for Shan speakers. Attribution in `public/fonts/CREDITS.md`. |
| [002](./002/prd.md) | Apply the Shan font to Shan text | Done | Fallback stack `Google Sans → aj12 → aj00` in `--font-sans`. Verified in built CSS. |
| [003](./003/prd.md) | Dark mode palette | Won't Do | **Decided: light mode only.** Keep the inert `dark:` classes; see `design.md`. |
| [004](./004/prd.md) | Decide locale routing | Done | **Locale-prefixed URLs, Shan (`shn`) default.** Implemented by 006. |
| [005](./005/prd.md) | Moderation policy and code of conduct | Deferred | Revisit before public launch. |
| [006](./006/prd.md) | Locale-prefixed routing with next-intl | Proposed | `/shn` and `/en`, `/` → `/shn`. Implements 004. Should land before any auth or home-page routes. |

## Open questions — not yet PBIs

Known-open work. **File these with `create-pbi` when you actually want them built**,
not before. The reasoning behind each lives in `design.md`.

- **Subset the fonts to `.woff2`.** ~250 KB of unsubsetted `.ttf` ships today and the
  audience is on mobile data; `design.md` calls it the highest-leverage perf win.
  Consider dropping `aj00` — `aj12` supersedes its coverage.
- **Brand colors.** The palette is entirely greyscale, chart tokens included. Blocks
  any real page design.
- **Better Auth with Google + GitHub OAuth.** Sign-in is the only gate. Not NextAuth.
  Database is Neon.
- **Rate limiting on write endpoints.** Required by `AGENTS.md` before any write path
  ships — and with moderation deferred (005), it is currently the whole spam defense.
- **The real home page.** `app/page.tsx` is one line of text.
- **Contributor onboarding** — `CONTRIBUTING.md`, issue templates, a `good first
  issue` path. Needed before inviting collaborators.
- **Image and file storage.** Neon is Postgres only; unlike Supabase it bundles none.
  Needed before avatars or post images. Watch EXIF GPS stripping — location is coarse
  and optional by design, and photo metadata defeats that silently.
- **Search on Myanmar script.** Shan and Burmese are written without spaces between
  words, so Postgres's default tokenizer will segment them badly or not at all.
- **A bold weight of A J Kunheing**, if one exists. Both fonts are Regular only, so
  all bold on Shan is faux-bold today.
- **Shan technical vocabulary** — does an existing effort exist to align a glossary
  with?
- **Community seeding** — an existing community to draw from, or cold-start from zero?

*(Resolved: the missing-glyph question — `aj12.ttf` carries SHAN THA, the Council
tones, and SHAN RR. See `design.md`.)*
