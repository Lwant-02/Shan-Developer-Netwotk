# PBI-006 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Shan copy:** no copy needs translating yet — the home page is a greeting plus
  the product name. The rule stands for when real copy lands: a Shan speaker writes
  it, never an agent.
- **Locale detection:** `Accept-Language` does **not** override the default. Every
  visitor with no explicit locale lands on `/shn`. Keeps pages static — nothing varies
  per request.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Read the Next routing/middleware docs in `node_modules/next/dist/docs/01-app/` | Done | — | Required by `AGENTS.md`; conventions may differ from training data. |
| 2 | Install `next-intl@^4.13.2` | Done | — | Peers verified: `next ^16`, `react ^19`. |
| 3 | Add routing config — locales `["shn","en"]`, default `shn`, `localePrefix: "always"` | Done | — | CoS 1, 2. |
| 4 | Add middleware for prefix redirects, no `Accept-Language` detection | Done | — | CoS 2. Keep pages static (Notes). |
| 5 | Move `app/layout.tsx` and `app/page.tsx` under `app/[locale]/` | Done | — | Root layout still required. CoS 3. |
| 6 | Set `<html lang>` from the active locale | Done | — | CoS 3 — removes the hardcoded `lang="en"`. |
| 7 | Create `messages/shn.json` and `messages/en.json` | Done | — | CoS 7. English placeholders marked for the owner. |
| 8 | Render the home page from messages, not hardcoded JSX | Done | — | CoS 7. |
| 9 | Return 404 for unknown locales | Done | — | Ends at 404 via redirect; direct 404 for malformed segments. CoS 4 amended with owner agreement. |
| 10 | Add `hreflang` alternates via `alternates.languages` | Done | — | CoS 6. |
| 11 | Update `__tests__/page.test.tsx` for the new path | Done | — | CoS 10 — assertions must survive, not be deleted. |
| 12 | Add a test that `<html lang>` matches the locale | Not doing | — | Not unit-testable: the layout is an async Server Component and Vitest cannot render those (AGENTS.md). Verified in built HTML instead — `<html lang="shn">` / `lang="en"`. Needs E2E, which doesn't exist yet. |
| 13 | Confirm the font stack is unchanged and Shan still renders in both locales | Done | — | CoS 8. |
| 14 | Confirm pages are still prerendered as static | Done | — | Notes — middleware must not break anonymous caching. |
| 15 | Check the client JS delta | Done | — | CoS 9. Server-Component-first. |
| 16 | Verify all 11 CoS one by one; run lint, build, test, and the app | Done | — | CoS 11. |
| 17 | Supply the Shan UI strings | Done | human | Nothing to translate yet — the home page is a greeting and the product name. The rule still stands for real copy: a Shan speaker writes it, not an agent. |

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. `/shn` and `/en` both serve the home page in their own locale's strings.
2. `/` redirects to `/shn`.
3. `<html lang>` matches the active locale; no hardcoded value remains.
4. An unknown locale returns a 404.
5. Anonymous access unaffected — renders with no session, stays indexable.
6. `hreflang` alternates present.
7. UI strings come from message files, not hardcoded JSX.
8. Shan still renders in the Shan font under both locales.
9. Server-Component-first; client JS delta checked.
10. Tests updated; anonymous-render and Myanmar-script assertions survive.
11. `lint`, `build`, `test` pass and the app is verified running.
