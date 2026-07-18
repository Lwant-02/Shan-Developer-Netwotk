# PBI-007 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decision taken at agreement time

- **Base URL:** no production domain exists and Vercel isn't linked, so the canonical
  origin comes from an env var with a local fallback rather than a guessed domain.
  Set it for real when the domain is registered.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Read the `sitemap` and `robots` file-convention docs | Done | — | Required by `AGENTS.md`. |
| 2 | Add a shared `siteUrl` helper reading the env var | Done | — | Local fallback; no hardcoded domain. |
| 3 | Add `app/sitemap.ts`, generated from `routing.locales` | Done | — | CoS 1, 2. |
| 4 | Include `alternates.languages` per entry | Done | — | CoS 3. |
| 5 | Add `app/robots.ts` allowing crawl, pointing at the sitemap | Done | — | CoS 4. |
| 6 | Confirm `proxy.ts` doesn't redirect either file | Done | — | CoS 5 — the likely trap. |
| 7 | Verify both served from a production build | Done | — | CoS 6. |
| 8 | Add a test that the sitemap covers every locale | Done | — | Guards CoS 2 against a hardcoded list creeping back. |
| 9 | Document the env var | Done | — | README + `.env.example`. |
| 10 | Verify all 7 CoS; run lint, build, test | Done | — | CoS 7. |

## Conditions of Satisfaction

Copied from the PRD so this file stands alone:

1. `/sitemap.xml` lists every route in every locale (`/shn`, `/en`).
2. The locale list is derived from `routing.locales`, not a literal array.
3. Entries carry `alternates.languages`.
4. `/robots.txt` allows crawling and points at the sitemap.
5. Both reachable with no session and not caught by the locale redirect.
6. A production build emits both; verified by request, not by reading source.
7. `lint`, `build`, `test` pass.
