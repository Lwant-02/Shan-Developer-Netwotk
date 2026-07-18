# PBI-011 — Contributor onboarding

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |

## Problem

The repository is private and has no contributor-facing scaffolding. There is no
`CONTRIBUTING.md`, no issue or PR templates, and no statement of how work is chosen or
reviewed.

The conventions themselves are unusually well documented — `AGENTS.md` covers stack
gotchas, styling rules, the branch model, and the commit format; `design.md` holds the
thesis and decisions; `docs/delivery/` holds the backlog. But all of it is written for
someone (or something) already inside the project. A newcomer has no entry point that
says *start here*.

## Why it matters

The stated intent is to open this up so Shan developers can collaborate. That
audience is the whole point of the project, and it is also the audience most likely to
bounce off an unexplained repo — many will be contributing to something like this for
the first time, and possibly reading the docs in a second language.

## Conditions of Satisfaction

1. `CONTRIBUTING.md` exists and covers: local setup, the commands, the branch model
   (`feature/* → dev → main`), the commit convention including the `Deploy-*`
   trailers, and how the PBI backlog works.
2. It states **how to pick something to work on** — that a PBI must be `Agreed` before
   code is written, and what to do if you want to propose something new.
3. It explains that this repo uses AI agents and that `AGENTS.md` is the shared source
   of truth for conventions.
4. Issue and PR templates exist, and the PR template prompts for the PBI ID.
5. A `good first issue` path exists — at least a few genuinely small, well-specified
   items.
6. Contributions in Shan are explicitly welcome, and it is clear that the Shan copy in
   the product needs native speakers rather than translation tooling.
7. The README's first screen tells a newcomer what the project is and where to go
   next.

## Notes

- **A code of conduct is conventionally part of this**, and PBI-009 (moderation and
  CoC) is currently `Deferred`. Either write a minimal CoC here or state plainly that
  it's pending — an open project with no conduct statement is a gap contributors
  notice.
- Consider whether `CONTRIBUTING.md` should exist in Shan as well as English. Given
  the thesis, English-only onboarding for a Shan-language project is worth a
  deliberate decision rather than a default.
- Font redistribution: `public/fonts/CREDITS.md` asks anyone reusing the fonts to
  confirm terms with the designer. Make sure contributors see that before forking.
- Practical prerequisite: the repo is currently **private**. This PBI only pays off
  once it's public.
