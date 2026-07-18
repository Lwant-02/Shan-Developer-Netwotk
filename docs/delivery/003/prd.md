# PBI-003 — Subset the fonts and convert to woff2

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Depends on** | PBI-002 (Done) |

## Problem

Both Shan fonts ship as unsubsetted `.ttf`:

| File | Size | Codepoints |
| --- | --- | --- |
| `aj00.ttf` | ~134 KB | 331 |
| `aj12.ttf` | ~111 KB | 324 |

That is roughly **250 KB of font data** on first paint, in a format with no
compression, for a site whose stated target user is on a **mid-range Android phone on
mobile data**. `design.md` calls this the highest-leverage performance win available.

`next/font/local` preloads by default, so both files are fetched even though aj12
alone covers everything aj00 does.

## Why it matters

Public reach is the recruiting mechanism, and reach depends on the site being usable
on a slow connection. A quarter-megabyte of fonts before first paint is the single
largest avoidable cost currently in the bundle.

## Conditions of Satisfaction

1. Fonts are served as `.woff2`.
2. Fonts are subsetted to the codepoints actually needed — Myanmar block, Myanmar
   Ext-A, Basic Latin, and punctuation. **Verify no Shan glyph is dropped**, in
   particular U+1080, U+108B–U+108D, U+108F, and the Shan digits U+1090–U+1099.
3. Total font payload is measurably smaller; record before and after in the PBI.
4. Shan still renders correctly — the CoS from PBI-002 continue to hold.
5. A decision is recorded on whether `aj00` is kept at all (see Notes).
6. `npm run build` succeeds and the app is verified running.

## Notes

- **Consider dropping `aj00` entirely.** aj12 supersedes its coverage (116 Myanmar
  codepoints vs 59, plus every glyph aj00 lacks). Keeping it as a second preloaded
  file costs bandwidth for no coverage gain. If it stays, consider `preload: false`.
- Subsetting a Myanmar-script font is **not** a naive codepoint filter: the shaping
  tables (GSUB/GPOS) do mark positioning and conjunct forming. Dropping the wrong
  lookups produces text that renders but is positioned wrongly. Verify visually with
  real Shan text, not just a byte-size diff.
- Tooling: `fonttools` (`pyftsubset`) is the usual choice, with
  `--layout-features` retained for `mymr`.
- Keep `public/fonts/CREDITS.md` accurate if filenames change.
