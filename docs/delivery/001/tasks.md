# PBI-001 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Read license metadata out of both font binaries | Done | — | Confirmed All Rights Reserved; recorded in the PRD table. |
| 2 | Contact Jao Kunheing via the URL in `aj12.ttf` | Proposed | human | Agent cannot do this. |
| 3 | Ask for redistribution permission, ideally under SIL OFL | Proposed | human | Cover both `aj00` and `aj12` in one ask. |
| 4 | Ask whether a bold weight exists | Proposed | human | Backlog OQ#2. Both fonts are `usWeightClass 400`. |
| 5 | Ask about missing Shan glyphs (U+1080, U+108B–U+108D, U+108F) | Proposed | human | `design.md` OQ#1 — blocks committing to this font. |
| 6 | Record the outcome in `public/fonts/LICENSE` | Proposed | — | Only if permission is granted. |
| 7 | Update the bundled-fonts note in `LICENSE` | Proposed | — | Remove the blocker wording once resolved. |
| 8 | Close `design.md` OQ#2 with the outcome | Proposed | — | Flip the 🔴 marker. |
| 9 | If refused: choose a licensed alternative and purge from git history | Proposed | — | `git filter-repo`. Do not just delete the file. |
| 10 | Confirm the repo can be published cleanly | Proposed | — | Final CoS check. |

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. Written permission to redistribute, or a licensed replacement chosen.
2. License recorded in the repo if granted.
3. Fonts purged from history if refused.
4. `design.md` OQ#2 closed.
5. Nothing All Rights Reserved is redistributed on publish.
