# PBI-007 — Sitemap and robots.txt

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-18 |
| **Agreed** | 2026-07-18 |
| **Completed** | 2026-07-18 |
| **Depends on** | PBI-006 (locale routing, Done) |

## Problem

The site has no `sitemap.xml` and no `robots.txt`. Neither file exists anywhere in the
repo, so a crawler arriving at the domain gets no route list and no crawl directives —
it has to discover pages by following links, and there are none yet.

PBI-006 shipped `hreflang` alternates, which tell a crawler that `/shn` and `/en` are
translations of each other. It did not tell a crawler those URLs exist in the first
place.

## Why it matters

`AGENTS.md` states it plainly: anonymous visitors get full read access and content
must **stay indexable**, because *public reach is the recruiting mechanism*. A
community platform nobody can find recruits nobody.

This matters more than usual for a Shan-language site. There is very little
Shan-script technical content indexed anywhere, so the pages this project publishes
have an unusually good chance of ranking — but only if they are discoverable at all.

## Scope

`sitemap.ts` and `robots.ts` using the Next file conventions. Both must be generated
from `i18n/routing.ts` rather than hardcoding a locale list, so adding Burmese later
doesn't silently leave it out of the sitemap.

**Out of scope:** canonical tags, per-page `generateMetadata`, and Open Graph images.
Those are real, and deliberately not included here — file them separately when wanted.

## Conditions of Satisfaction

1. `/sitemap.xml` is served and lists **every route in every locale** — today that is
   `/shn` and `/en`.
2. The sitemap's locale list is **derived from `routing.locales`**, not a literal
   array. Adding a locale must not require editing the sitemap.
3. Sitemap entries carry `alternates.languages` so the hreflang relationships from
   PBI-006 are expressed in the sitemap too.
4. `/robots.txt` is served, allows crawling of public content, and points at the
   sitemap URL.
5. Both files are reachable **with no session**, and are not caught by the locale
   redirect in `proxy.ts` — i.e. `/robots.txt` must not 307 to `/shn/robots.txt`.
6. A production build emits both; verified by requesting them from the running build,
   not by reading the source.
7. `npm run lint`, `npm run build`, and `npm test` pass.

## Notes

- **Read the Next docs first** — `node_modules/next/dist/docs/01-app/03-api-reference/`
  has the `sitemap` and `robots` file conventions for this version. Do not write them
  from memory; this repo's Next differs from training data, as `middleware.ts` →
  `proxy.ts` demonstrated in PBI-006.
- **CoS 5 is the likely trap.** The `proxy.ts` matcher excludes paths containing a dot,
  which covers `/robots.txt` and `/sitemap.xml` — but that is an inference from the
  pattern, so verify it rather than assume it.
- A canonical base URL is needed for absolute sitemap URLs. There is no production
  domain yet and Vercel is not linked, so this likely needs an env var with a sensible
  local default. Flag it rather than hardcoding a guessed domain.
