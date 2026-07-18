---
name: implement-pbi
description: Implement an agreed Product Backlog Item from docs/delivery/ — work its tasks, verify against its conditions of satisfaction, and update its status. Use when asked to build, work on, start, or finish a PBI. Asks which PBI if no ID is given.
---

# Implementing a PBI

## Step 0 — establish which PBI, before anything else

**If the user did not give a PBI ID, ask. Do not guess and do not pick one yourself.**

First check whether the branch already answers it:

```bash
npm run pbi:current     # feature/012-... -> 012; exits non-zero if none
```

If that returns an ID you're resuming that PBI — confirm rather than asking from
scratch. Otherwise read the backlog so the question is useful:

```bash
npm run pbi:list agreed   # startable items
npm run pbi:list          # everything, with statuses
```

Then **use AskUserQuestion**, offering the items that are actually startable —
status `Agreed`, with dependencies satisfied. Include each one's title and why it's
ready. Never present a `Proposed` item as a normal option.

"Work on the backlog", "start the next thing", or "implement a PBI" all mean ask.
Picking the top row and starting is the wrong move — ordering in that file is not a
priority ranking, and the owner may have a reason to want a different one.

If the user names something ambiguous ("the font one"), match it against the backlog
and **confirm the specific ID** before writing code.

## Step 1 — check it's actually startable

Once you have an ID:

```bash
cat docs/delivery/<id>/prd.md
cat docs/delivery/<id>/tasks.md   # may not exist yet
```

**Stop and ask if any of these hold:**

- **Status is `Proposed`.** Not decided yet. Building it is the same error as building
  against a 🟡 or 🔴 in `design.md`. Say it's unagreed and ask before proceeding.
- **Status is `Reserved`.** The ID is a placeholder; there's no PRD to build from.
- **Status is `Done`.** Confirm what's actually wanted — a fix, or a new PBI?
- **A dependency isn't `Done`.** The backlog Notes record these (005 blocks 004; 007
  blocks 008; 001 blocks publishing). Building on an unfinished dependency means
  reworking it.
- **`tasks.md` doesn't exist.** The PBI is `Agreed` but not broken down. Write
  `tasks.md` first, from the PRD's conditions of satisfaction, and confirm it before
  starting.
- **Tasks are marked `Owner: human`.** An agent can't obtain permission, make a
  product call, or use an account it doesn't have. Report those rather than
  attempting or silently skipping them.

## Step 2 — set up

Branch off `dev` — never work directly on `dev` or `main`:

```bash
git rev-parse --abbrev-ref HEAD
git switch dev && git pull
git switch -c feature/<id>-<short-slug>
```

Mark the PBI `InProgress` in **both** `docs/delivery/backlog.md` and the PRD header.

## Step 3 — build

Work the tasks in order. The conventions are not optional here:

- **UI work** → follow the `ui-conventions` skill. Reuse before creating; shadcn via
  the CLI; Tailwind semantic tokens; `cn()`; Server Components by default.
- **Something breaks** → follow the `debug` skill rather than guess-patching.
- **Write a test** for anything a product rule depends on — anonymous read access,
  rate limits, Shan text surviving a refactor. Verify it can fail.
- Update task status in `tasks.md` as you go, not in one batch at the end.

Stay inside the PBI's scope. If you find something else worth doing, **file it** with
`create-pbi` instead of expanding this one — scope creep inside a PBI is how a
backlog stops describing reality.

## Step 4 — verify against the conditions of satisfaction

The CoS in the PRD are the definition of done. Go through them **one by one** and
confirm each, concretely.

```bash
npm test
npm run lint
npm run build
npm run dev     # and actually look at it
```

A passing build is not a met CoS. "Renders with no session" means loading it logged
out. Report what you actually ran; if you couldn't verify something, say which one and
why — don't imply a check you skipped.

## Step 5 — close it out

1. Mark every finished task `Done` in `tasks.md`.
2. Set the PBI status in **both** `backlog.md` and the PRD header. Two copies drift.
3. Flip any `design.md` 🟡/🔴 markers this resolved.
4. Update `AGENTS.md` if a convention, a command, or a "known gap" changed. **Do this
   in the same commit** — this repo has had documentation drift repeatedly, and a doc
   describing something that no longer exists actively misleads the next session.
5. Commit as `type(<id>): summary`, with the `Deploy-Risk` / `Deploy-Note` /
   `Deploy-Verify` trailers. See the commit convention in `AGENTS.md`.

Mark `Done` only when it's shipped and verified — not when the code is written. If it
merged but isn't deployed, it isn't `Done` yet; say so plainly.
