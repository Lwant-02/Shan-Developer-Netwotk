# PBI-001 — Font attribution and licensing

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-18 |
| **Blocks** | — (was: open-sourcing the repository) |
| **Completed** | 2026-07-18 |

## Problem

Both Shan fonts bundled in `public/fonts/` are **All Rights Reserved** and grant no
redistribution rights. Verified by reading the `name` table out of each binary:

| Field | `aj00.ttf` | `aj12.ttf` |
| --- | --- | --- |
| Family | A J Kunheing 00 | AJ 12 |
| Copyright | `Typeface © (your company). 2022. All Rights Reserved` (unfilled FontCreator template) | `Copyright (c) 2024 by Jao Kunheing. All rights reserved.` |
| License field | *(empty)* | `All rights reserved.` |
| License URL | *(empty)* | Facebook profile |
| Designer | JAO Kunheing (Nawone Sai) | Jao Kunheing |
| `fsType` | 0 (embedding permitted) | 0 (embedding permitted) |

`fsType = 0` permits *embedding*, which is not the same as permission to
*redistribute the font file*. A public repository redistributes it, and so does every
fork — so the exposure multiplies the moment the project is opened up.

This is `design.md` open question #2, promoted to blocking status by the decision to
open-source.

## Why it matters

The font is not incidental to this project — Shan script rendering correctly is the
entire thesis. Shipping without clear rights means either a takedown risk later, or
scrambling to swap the font after contributors have built against it.

## Conditions of Satisfaction

1. Written permission from the author to redistribute, or a decision to replace the
   font with one that already carries an open license.
2. If permission is granted: the license is recorded in the repo (`public/fonts/LICENSE`
   or equivalent) and the `LICENSE` note updated.
3. If permission cannot be obtained: fonts removed from git history, and a licensed
   alternative selected.
4. `design.md` open question #2 closed with the outcome.
5. The repository can be published without redistributing anything All Rights Reserved.

## Notes

- `aj12.ttf` names a contactable author (Jao Kunheing, via the Facebook profile in its
  `licenseURL`). `aj00.ttf` has no contact but the same designer name, so one
  conversation likely covers both.
- The ask should be for the **SIL Open Font License (OFL)** — the standard for fonts,
  well understood, and it lets the author keep the name reserved.
- Worth asking in the same conversation whether a **bold weight** exists (backlog OQ#2)
  and about the **missing Shan glyphs** (`design.md` OQ#1). Both are open, both are for
  the same person.
- This is a human task. An agent cannot obtain permission.
