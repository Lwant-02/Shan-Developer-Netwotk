# PBI-012 — Command palette search (kbar)

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Depends on** | PBI-010 (top nav + mock feed, Done) |
| **Blocked by** | Nothing to ship the UI. **Real content search** additionally needs a database and the Myanmar-tokenisation decision — see Scope. |

## Problem

The top nav has a search field, and it does nothing. PBI-010 shipped it `disabled`
on purpose — there is no database to search and no answer yet to how Shan text gets
tokenised. Below `sm` it collapses to a disabled icon.

So the most prominent control on the page is dead, and the only way to reach anything
is the left nav, whose destinations mostly don't exist yet either.

Two separate things are tangled up in "search", and this PBI is deliberately only the
first:

1. **Getting around the app** — jump to a section, switch language, switch theme,
   reach a post. This needs no database and no tokeniser. It is a command palette.
2. **Finding content by its text** — full-text search over posts, projects, and
   people. This needs the database *and* an answer to Myanmar-script segmentation,
   which `design.md` still lists as an open question.

## Why it matters

Search is where the language problem is at its sharpest, and it is the clearest case
of something global platforms handle badly for Shan:

- **Shan and Burmese are written without spaces between words.** Postgres's default
  tokeniser splits on whitespace, so a Shan sentence becomes one enormous token and
  matching silently fails. This is precisely the "structurally cannot" case the
  project exists for, and getting it right is a differentiator rather than table
  stakes.
- Building the **surface** now, against navigation and the mock feed, means the
  tokenisation work later has somewhere to land — and it makes the dead control in the
  nav live, on both desktop and mobile.

## Scope

A **command palette** over navigation and the existing mock feed, opened from the
existing search affordances.

**In scope:**

- **kbar** wired up, opened by the top-nav search field, the mobile search icon, and
  `⌘K` / `Ctrl+K`.
- **Navigation actions** — the left-nav destinations (including disabled ones, which
  should not appear or should be visibly unavailable), the locale switch, and the
  theme switch.
- **Searching the mock feed** by post title and author, jumping to the post.
- **Shan-aware matching** for what exists today: matching must work on Shan input, not
  only Latin. Whatever kbar's default matcher does with unspaced Myanmar text needs
  checking, and substring matching may be more correct here than word matching.
- **Full keyboard operation** and a visible focus state.
- **Anonymous access** — no session required, consistent with every other read path.
- Shan + English strings for the palette chrome, per the usual placeholder rule.

**Out of scope — deliberately:**

- **Full-text search over real content.** No database exists; this is a later PBI.
- **The Myanmar tokenisation decision itself** (`design.md` open question 3). This PBI
  must not quietly pick an answer by shipping one — if the mock matching needs a
  strategy, record it as provisional.
- Search result ranking, history, filters, or a `/search` results page.
- Indexing infrastructure, and any third-party search service.

## Conditions of Satisfaction

1. The **top-nav search field is live** — clicking it opens the palette. The **mobile
   search icon** opens the same palette.
2. **`⌘K` / `Ctrl+K` opens it** and `Esc` closes it.
3. The palette lists **navigation actions** — sections, locale switch, theme switch —
   and activating one performs it.
4. Typing **filters the mock feed by post title and author**, and selecting a result
   goes to that post (or the feed, until post pages exist).
5. **Shan input matches Shan content.** Typing a Shan substring that appears in a
   title finds it. Verified with real Shan text, not transliteration.
6. **Fully keyboard operable** — open, arrow through results, select, close — with a
   visible focus indicator throughout.
7. **Renders and works with no session**, and does not push `/shn` or `/en` from
   static to dynamic.
8. **Mobile-first:** usable at ~360px — the palette is not a desktop-only affordance,
   and the mobile entry point is the icon shipped by PBI-010.
9. **Client JS is confined to the palette.** It must not be mounted on every page as
   an always-loaded provider; a visitor who never opens search should not pay for it.
   State a measured before/after bundle delta.
10. Palette chrome is **translated** (English + `TODO(shn):` handed off via
    `npm run i18n:prompt`), and no Shan is invented.
11. `lint`, `build`, and `test` pass, with a test covering the palette rendering for an
    anonymous visitor and matching on Shan input.

## Notes

- **kbar is the owner's choice.** Worth recording the trade-off it carries: kbar
  expects a `<KBarProvider>` high in the tree, which pulls its JS onto every page —
  including for the anonymous Shan reader on a mid-range Android who never opens
  search. CoS 9 exists to force that cost to be measured and mitigated (lazy mounting,
  dynamic import) rather than discovered later. shadcn's `command` dialog was the
  alternative considered; if kbar's footprint proves unacceptable at breakdown time,
  say so rather than shipping it silently.
- **Check kbar's maintenance status** before committing to it — last release date and
  React 19 compatibility. This repo has already been bitten by a library that predates
  React 19 (`next-themes` and its client-rendered `<script>`; see PBI-011).
- **The disabled nav items** (Projects, Posts, Events, People) have no destinations.
  Decide at agreement time whether they appear in the palette as unavailable or are
  omitted. Omitting is probably right — a palette full of dead ends is worse than a
  short one.
- **Don't let the palette become the tokenisation decision.** Substring matching over
  six mock posts is not evidence that substring matching is right for a real corpus.
- The search field's placeholder string already exists (`Nav.search`), as does the
  mobile icon's label. Reuse them.
