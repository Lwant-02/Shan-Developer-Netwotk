# PBI-001 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Read license metadata out of both font binaries | Done | — | Both embed All Rights Reserved; recorded in the PRD table. |
| 2 | Establish the fonts' terms | Done | human | Owner's call: AJ built them free for Shan speakers. Sources: ajfonts.netlify.app, shan-font-library.vercel.app. |
| 3 | Record attribution in the repo | Done | — | `public/fonts/CREDITS.md`, plus a Credits section in the README. |
| 4 | Point `LICENSE` at the credits file | Done | — | MIT covers code only; the fonts are third-party works. |
| 5 | Ask whether a bold weight exists | Not doing | human | Left open; tracked in the backlog's Open Questions rather than here. |
| 6 | Ask about missing Shan glyphs | Done | — | Moot — `aj12.ttf` carries SHAN THA, the Council tones, and SHAN RR. Verified from `cmap`. |

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. ✅ The fonts' terms are established and recorded.
2. ✅ Attribution travels with the files (`public/fonts/CREDITS.md`).
3. ✅ `LICENSE` states what MIT does and does not cover.
4. ✅ The residual is recorded once, for anyone redistributing the fonts
   independently, rather than repeated as a blocker.

## Note

Closed on the owner's decision rather than on written permission from the designer.
`CREDITS.md` records what the binaries actually embed, so anyone reusing the fonts
outside this project can make their own call.
