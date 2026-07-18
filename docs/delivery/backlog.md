# Product Backlog

The ordered list of Product Backlog Items (PBIs) for Shan Developer Network.
One row per PBI. Detail lives in `docs/delivery/<id>/prd.md` and `tasks.md`.

**This file is the index, not the spec.** Keep rows short; put reasoning in the PRD.

## Status values

| Status | Means |
| --- | --- |
| `Proposed` | Written down, not agreed. Do not build. |
| `Agreed` | Scope settled, ready to pick up. |
| `InProgress` | Being worked on now. |
| `Done` | Shipped and verified in production. |
| `Reserved` | ID claimed for planned work, not yet drafted. |
| `Deferred` | Real, deliberately postponed. Not dropped. |
| `Won't Do` | Decided against. Kept so the decision isn't relitigated. |

A PBI must reach `Agreed` before code is written for it. This mirrors the
🟢/🟡/🔴 markers in `design.md` — don't build against a 🟡 or 🔴.

## Backlog

| ID | Title | Status | Notes |
| --- | --- | --- | --- |
| [001](./001/prd.md) | Resolve font licensing before publishing the repo | Agreed | **Blocks open-sourcing.** Owner states the font is open source and a public source exists — **link still needed**; both binaries embed All Rights Reserved. |
| 002 | Apply the Shan font to Shan text | Done | Fallback stack `Montserrat → aj12 → aj00` in `--font-sans`. Verified in built CSS. |
| 003 | Subset fonts and convert to woff2 | Proposed | Highest-leverage perf win; audience on mobile data. Consider dropping aj00 — aj12 supersedes its coverage. |
| 004 | Define the dark mode palette | Won't Do | **Decided: light mode only.** Keep the inert `dark:` classes; see `design.md`. |
| 005 | Choose brand colors | Proposed | Palette is entirely greyscale. Light palette only now. |
| 006 | Decide locale routing | Done | **Locale-prefixed URLs, Shan (`shn`) default.** Implementing `next-intl` is a separate PBI. |
| 007 | Better Auth with Google + GitHub OAuth | Proposed | Sign-in is the only gate. Not NextAuth. Database is Neon. |
| 008 | Rate limiting for write endpoints | Proposed | Required before any write path ships. Depends on 007. **Load-bearing** — governance is deferred, so technical controls carry the whole spam defense. |
| 009 | Moderation policy and code of conduct | Deferred | Owner deferred. Revisit before public launch. |
| 010 | Build the real home page | Proposed | `app/page.tsx` is one line of text. Depends on 005. |
| 011 | Contributor onboarding (CONTRIBUTING.md, issue templates) | Proposed | Needed before inviting collaborators. Depends on 001. |
| 012 | Implement `next-intl` locale routing | Proposed | Routing decision is made (006); the implementation isn't. Prefixed URLs, `shn` default. |
| 013 | Choose image/file storage | Proposed | Neon is Postgres only — unlike Supabase it bundles no storage. Needed before avatars or post images. |

## Open questions not yet turned into PBIs

From `design.md`. These need a human answer before they can be scoped:

1. **The public source for the font license** — needed to close PBI-001.
2. Is there a bold weight of A J Kunheing available? Both fonts are Regular only.
3. Search on Myanmar script — Shan and Burmese have no spaces between words, so
   Postgres's default tokenizer won't segment them. Needs investigation before search
   is scoped.
4. Does a Shan technical-vocabulary effort already exist to align the glossary with?
5. Is there an existing community to seed from, or is this cold-start from zero?

*(The missing-glyph question is resolved — `aj12.ttf` carries SHAN THA, the Council
tones, and SHAN RR. See `design.md`.)*
