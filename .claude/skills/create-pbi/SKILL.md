---
name: create-pbi
description: Create a new Product Backlog Item in docs/delivery/ — assign the next ID, add the backlog row, and write the PRD. Use when asked to add something to the backlog, file a PBI, write a PRD for a feature, or reserve a PBI ID.
---

# Creating a PBI

PBI = Product Backlog Item. IDs are zero-padded three digits (`001`, `002`).
The index is `docs/delivery/backlog.md`; detail goes in `docs/delivery/<id>/prd.md`.

## Ask before writing, if the ask is thin

A one-line request ("add a PBI for search") is not enough to write a PRD from. Before
creating anything, make sure you can answer:

- **What problem does this solve?** Not the feature — the problem behind it.
- **Why does it belong in *this* product?** See the scope gate below.
- **What would "done" mean?** You need checkable conditions of satisfaction.

If any of these is genuinely unclear and you can't settle it from `design.md` or the
code, **use AskUserQuestion** rather than inventing an answer. A PRD full of guesses
is worse than no PRD — someone will build from it.

Don't ask about things you can determine yourself: the next free ID, whether a
duplicate exists, what the current conventions are. Go look.

## Scope gate — apply this before filing anything

This project exists for **language and locality**. Anything that can't be argued from
that thesis is out of scope, and `design.md` is explicit that features must be
justified against it.

If the request can't be argued that way, **say so instead of filing it**. "Global
platforms do everything else better and will never do this" is the standard. Filing
out-of-scope work as `Proposed` doesn't defer the problem, it launders it.

## Steps

**1. Check it doesn't already exist.**

```bash
npm run pbi:list
cat docs/delivery/backlog.md
```

Note that a backlog **row** can exist without a `docs/delivery/<id>/` directory —
several rows were seeded ahead of their PRDs. A row with no directory is still a
real, claimed PBI: write its PRD rather than filing a new ID for the same work.

Read the rows *and* the "Open questions" section at the bottom — the thing may already
be tracked as an unanswered question rather than a PBI. If it overlaps an existing
PBI, extend that one instead of filing a near-duplicate.

**2. Take the next free ID — don't read it off the table by eye.**

```bash
npm run pbi:next        # fetches, then scans every ref
```

This matters because **the working tree is not the whole picture.** A PBI filed on
someone else's branch, or on a branch you haven't merged, still claims its ID. The
helper fetches and scans the working tree, every local branch, and every
remote-tracking branch — backlog rows *and* `docs/delivery/NNN/` directories, since
either can exist without the other.

Use its output verbatim. **Never reuse or renumber an ID** — commit messages
reference them permanently.

**What it cannot see:** a PBI created on another machine and never pushed. That's
unavoidable. If more than one person files PBIs, claim the ID early by pushing the
backlog row as its own commit, before writing the PRD. `npm run pbi:check` reports
any ID that ended up claimed for two different things.

**3. Add the backlog row**, status `Proposed`.

| ID | Title | Status | Notes |
| --- | --- | --- | --- |

Link the ID to `./<id>/prd.md`. Note dependencies in Notes if it blocks or is blocked
by another PBI.

**4. Write `docs/delivery/<id>/prd.md`.**

Follow `docs/delivery/001/prd.md`. Required sections:

- **Header table** — Status, Created (absolute date), Blocks/Depends-on.
- **Problem** — what's wrong, *with evidence*. Verify claims against the repo rather
  than restating assumptions. PBI-001's license table came from reading the font
  binaries, not from repeating what a doc said.
- **Why it matters** — the product argument, tied to the thesis.
- **Conditions of Satisfaction** — numbered and checkable. "Works well" is not a CoS.
  "Renders with no session" is. These are what `implement-pbi` verifies against, so
  vague ones make the PBI unfinishable.
- **Notes** — constraints, related PBIs, anything a human must do.

**5. Stop there.** Do not write `tasks.md`, and do not write code.

A new PBI is `Proposed`, which means *written down, not decided*. Breaking down or
building an unagreed item is wasted work — and the owner may reject the scope. Tasks
get written when it reaches `Agreed`.

## Reserving an ID

"Reserve PBI-XXX" means: add a backlog row with status `Reserved` and **no
directory**. It claims the number for planned work so a later PBI doesn't take it.
Don't write a PRD for a reserved item.

## Commit

Docs-only, so:

```
docs(<id>): create PBI-<id> — <title>
```

Body explains the problem and what was deliberately left out. Include the
`Deploy-Risk` / `Deploy-Note` / `Deploy-Verify` trailers — for a PBI creation these
are normally `none — documentation only`. See the commit convention in `AGENTS.md`.
