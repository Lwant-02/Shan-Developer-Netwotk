# PBI-015 — Static informational pages: About, Terms, Privacy

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-20 |
| **Depends on** | — (uses the shipped layout, nav, and sign-in dialog) |
| **Blocks** | — |

## Problem

Three destinations are already promised by shipped UI, but none of them has a page:

- **Nav footer, Terms & Privacy.** `components/shell/left-nav.tsx:128-132` renders
  "Terms" and "Privacy" as inert, non-link `<span>`s, with a comment stating plainly:
  *"neither document exists yet, and this repo does not ship links that 404."*
- **Secondary nav, About.** `components/shell/left-nav.tsx:27` lists an `about` item
  that renders disabled with a "soon" cue — no `/about` route exists.
- **Sign-in consent.** PBI-014's dialog shows the consent line *"I agree to the Terms
  of Service and Privacy Policy"* (`messages/en.json:36`). Sign-in is the only gate in
  this product, so this is the one place every joining member is asked to agree to
  documents — and those documents do not exist.

The strings already exist (`Nav.about` / `Nav.terms` / `Nav.privacy`), the sitemap
(`app/sitemap.ts`) lists only the home route, and no `design.md` decision currently
covers these pages. This PBI is where they are decided and built.

## Why it matters

These are not generic boilerplate bolted on for compliance — if they were, they'd fail
the scope gate. Two of the three are core to this product's thesis of **language and
locality**:

- **Privacy is where the identity-safety promise becomes a promise.** `AGENTS.md` and
  `design.md` require treating identity as sensitive — pseudonymity supported, coarse
  and optional location, OAuth emails never public — and call it *"a safety
  requirement for this region, not a preference."* A Privacy page is the surface where
  the user actually reads that commitment back. A global platform's boilerplate privacy
  policy would never make these specific promises; making them is the locality thesis.
- **About recruits.** Anonymous read access is the recruiting mechanism, so the page
  that states the community's purpose to a first-time visitor must render without a
  session and stay indexable.
- **Terms lets sign-in be honest.** You cannot ask a member to agree to a Terms of
  Service that returns 404. The consent line already claims they exist.

## Conditions of Satisfaction

1. Routes `/about`, `/terms`, `/privacy` exist under `app/[locale]/`, render for both
   `shn` and `en`, are **readable with no session**, and call `setRequestLocale(locale)`
   so they stay statically prerendered.
2. **Each page sets its own `alternates`** (canonical + hreflang for its own path). Per
   the metadata rule in `AGENTS.md`, a sub-route that omits this inherits the home URL
   as canonical — that must not happen here.
3. The three paths are added to the `routes` array in `app/sitemap.ts` so every locale
   in `routing.locales` gets each one; `__tests__/sitemap.test.ts` still passes.
4. The nav footer's inert "Terms"/"Privacy" spans become real localized `Link`s, and
   the secondary "about" nav item becomes an enabled link. No link 404s. The comment at
   `left-nav.tsx:125-127` is resolved/removed since the pages now exist.
5. The sign-in dialog consent line links "Terms of Service" and "Privacy Policy" to the
   new pages, so the agreement points at real documents.
6. Content obeys the i18n rules: `messages/en.json` is the source of truth; Shan values
   are attested Shan **or** `TODO(shn): <English>` placeholders — never
   machine-translated or invented (PBI-006). No `font-bold`/`font-semibold`/
   `font-medium` on any text (all strings may contain Shan).
7. Reuse-before-create: the three pages share **one** static-content layout/primitive
   (a readable prose shell), not three bespoke layouts. Built Server-Component-first,
   semantic tokens only, `rounded-lg` only.
8. The Privacy page content does not contradict the identity-safety commitments already
   recorded in `AGENTS.md`/`design.md` (emails never public, pseudonymity supported,
   location coarse and optional).

## Notes

- **The binding legal copy for Terms and Privacy is a human task.** An agent must not
  invent a Terms of Service or data-handling claims — that is the same class of error
  as machine-translating Shan: fluent-looking text that asserts practices the platform
  may not actually follow. The *pages and shell* are in scope for the implementing
  agent; the *legally binding wording* is owner-reviewed. Any draft an agent writes
  must be clearly marked draft-pending-review and must state only practices this repo
  already commits to. The **About** page can be authored from the thesis now.
- **Shan translation** of all three pages is handed off via `npm run i18n:prompt`
  (PBI-006), not filled in by the implementing agent guessing.
- **This could be split** into "page shell + About" and "Terms/Privacy content" if the
  legal copy lags — the CoS are written so the infrastructure ships independently of
  the final legal wording. Kept as one PBI because the three share the shell and the
  same nav/consent wiring.
- **Related PBIs:** [014](../014/prd.md) (the consent line these satisfy),
  [005](../005/prd.md) (moderation / code of conduct — Deferred; Terms may reference
  it), [007](../007/prd.md) (sitemap these routes join).
- No OG image or per-page `openGraph.images` is expected — that asset is still an open
  question (backlog OQ, PBI-009), and out of scope here.
