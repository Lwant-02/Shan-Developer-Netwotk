# PBI-015 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Scope: three static pages + one shared prose shell + nav/consent wiring.** No DB,
  no auth, no CMS. Content is hard-coded message strings.
- **Legal copy is a plain-language foundation for owner review.** The agent writes
  Terms/Privacy in good faith from the identity-safety commitments in
  `AGENTS.md`/`design.md` plus the standard clauses every web app carries. Content
  asserts only practices this repo already commits to. (An interim "working draft"
  callout was added, then removed once the full foundation landed — owner review still
  applies, but the pages no longer present as unfinished.) The About page is authored
  from the thesis outright.
- **Shan is English + `TODO(shn)` for all new prose**, handed off via
  `npm run i18n:prompt` at the end. Real Shan already exists for nav labels, so `/shn`
  still shows Shan script in the chrome. The existing attested Shan consent string is
  kept and only wrapped with link tags (no Shan invented or altered).
- **Content is nested string objects, never arrays.** `i18n-prompt.mjs` flattens only
  objects and treats non-strings as already-translated, so array content would silently
  escape the translation brief. Each section is `{ heading, body }` string leaves.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | New message strings (`en.json`): `About`, `Terms`, `Privacy` namespaces + shared `Legal` chrome | Done | — | CoS 6. Nested `{heading,body}` leaves. |
| 2 | Mirror keys in `shn.json` as `TODO(shn):` placeholders; keep existing Shan for nav/consent | Done | — | CoS 6. |
| 3 | `components/content/prose-page.tsx` — prose article rendered inside `AppShell` | Done | — | CoS 7. One shell for all three. |
| 3a | Extract `components/shell/app-shell.tsx`; home + prose pages share it | Done | — | Owner request: left nav + right rail on every page, not just home. |
| 4 | ~~Draft-pending-review callout~~ | Removed | — | Added, then removed once the full foundation landed (owner request). |
| 5 | `app/[locale]/about/page.tsx` — content + own `alternates` metadata | Done | — | CoS 1, 2. |
| 6 | `app/[locale]/terms/page.tsx` — foundational content + own metadata | Done | — | CoS 1, 2, 8. |
| 7 | `app/[locale]/privacy/page.tsx` — foundational content + own metadata | Done | — | CoS 1, 2, 8. |
| 8 | Add `/about`, `/terms`, `/privacy` to `app/sitemap.ts` routes | Done | — | CoS 3. |
| 9 | `LeftNav`: make Terms/Privacy real `Link`s, enable About link, drop stale comment | Done | — | CoS 4. |
| 10 | Sign-in dialog: link Terms/Privacy in the consent line via `t.rich` | Done | — | CoS 5. |
| 11 | Tests: pages render anonymously + carry Shan script; sitemap covers new routes | Done | — | CoS 1, 3. |
| 12 | Verify: lint, build, test, dev server logged out | Done | — | CoS 1. |
| 13 | `i18n:prompt` brief + docs close-out (AGENTS.md if a convention changed) | Done | — | Close-out. |
| 14 | Translate the new Shan strings (About + chrome) | Done | owner | Owner translated; `i18n:prompt` reports complete. |
| 15 | Terms & Privacy legal wording | Done | owner | Foundational content accepted; draft notice removed. |
| 16 | Terms & Privacy are **English-only** — mark it explicitly | Done | — | Legal copy stays English. `ENGLISH_ONLY` in `i18n-prompt.mjs`, note in AGENTS.md, comment in both page files. |
| 17 | Relax the Shan-translation rule so a translator can translate uncertain terms (owner reviews) | Done | — | AGENTS.md "Shan strings are translated"; the `i18n:prompt` brief text itself left unchanged. |

## Verified vs owner-only

Verified here (prod build + `npm run start`, logged out):

- `/en/{about,terms,privacy}` and `/shn/about` return **HTTP 200 with no session**;
  all six locale routes prerender as static SSG (CoS 1).
- Content renders: About ("Why this exists", "Your identity is yours"), Terms shows
  the **Working draft** notice + sections, Privacy carries the identity-safety promises
  ("never shown publicly", "coarse and optional") (CoS 8).
- Each page emits its **own** `canonical` + `hreflang` for its own path — `/en/terms`
  canonical is `…/en/terms`, not the home root (CoS 2).
- `sitemap.xml` lists all six new URLs; the home footer links to `/en/{about,terms,
  privacy}` (CoS 3, 4).
- `npm run i18n:prompt` flags all 48 new Shan leaves as pending (CoS 6 — nested objects,
  no array escapes the brief).
- Lint clean, **28/28 tests pass** (added: content-page render + `localeAlternates`;
  updated: sitemap length/new-routes, sign-in consent links + bold-weight).

**Needs the owner's browser** (can't drive a viewport/interaction here): the pages at
~360px (single readable column, no horizontal scroll), the nav active-state on the new
routes in the mobile drawer, and clicking a consent link actually navigating out of the
open dialog.

**Owner tasks (14, 15):** translate the Shan strings via the generated brief, and
review/finalize the draft Terms & Privacy wording.

## Status note

Code-complete on `pbi/015-static-info-pages`, PR #17 open into `dev`. Stays
`InProgress` until merged and deployed — `Done` means shipped and verified live.
