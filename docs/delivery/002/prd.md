# PBI-002 — Apply the Shan font to Shan text

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-18 |
| **Completed** | 2026-07-18 |

## Problem

`aj06.ttf` sat in `public/fonts/` unreferenced. `layout.tsx` loaded only Montserrat (since replaced by Google Sans)
with `subsets: ["latin"]`, which has **no Myanmar-block coverage**, so every Shan
character fell through to whatever the operating system happened to provide — or to
tofu. For a project whose thesis is that Shan content is first-class, the Shan text
was the one thing not rendering correctly.

## Why it matters

This is the thesis at its most literal. Nothing else in the product matters if Shan
script doesn't render.

## Conditions of Satisfaction

1. ✅ Shan renders in a Shan font, not a system fallback or tofu.
2. ✅ Latin renders in the Latin face (Montserrat at the time; now Google Sans).
3. ✅ Mixed Shan/Latin in a single string renders correctly, with no per-element
   markup and no `lang` attribute required.
4. ✅ No `font-bold` reliance on Shan — both fonts are Regular only.
5. ✅ Verified in the built CSS, not just the source.

## Outcome

`aj06.ttf` was replaced by two fonts from the same designer, both loaded via
`next/font/local` as `--font-aj12` and `--font-aj00`.

Shan text is handled by a **fallback stack**, not per-element classes. `--font-sans`
in `app/globals.css`:

```
Google Sans → aj12 → aj00 → sans-serif
```

The browser falls back **per glyph**, so the Latin face serves Latin and AJ serves Shan
inside the same sentence. A `:lang(shn)` rule was considered and rejected — content
is user-generated and multilingual per string, so untagged Shan would have missed out.

aj12 leads the Shan fallbacks on evidence: reading the `cmap` tables gives it 116
Myanmar codepoints to aj00's 59, and it is the only one of the two carrying U+1080
SHAN THA, the U+108B–U+108D Council tone marks, and U+108F SHAN RR.

Verified in built output: `html{font-family:var(--font-google-sans),
var(--font-aj12), var(--font-aj00), sans-serif}`. (The Latin face was Montserrat
when this shipped; it was swapped for Google Sans afterwards. The stack mechanism
is unchanged.)

## Notes

- Follow-on work: **PBI-006** (locale routing) fixes the hardcoded
  `<html lang="en">` that still mislabels Shan pages. Subsetting the fonts to
  `.woff2` remains open and is recorded in `design.md` under Font loading — the
  files ship unoptimized at ~250 KB.
- Both fonts are `usWeightClass 400`. Emphasis on Shan must use size, color, or
  spacing; `font-bold` triggers synthesized faux-bold and distorts Myanmar marks.
