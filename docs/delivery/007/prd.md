# PBI-007 — Better Auth with Google and GitHub OAuth

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Blocks** | PBI-008 (rate limiting) |

## Problem

There is no authentication of any kind. No database, no session, no sign-in. Nobody
can post, which means the product has no write path at all.

## Why it matters

Sign-in is the **only** gate in this product. There is no separate verification tier —
"verified" means OAuth email-verified and nothing more. That single decision is what
keeps the barrier to contributing low, and it makes getting auth right load-bearing:
everything downstream (posting, rate limiting, moderation) hangs off it.

## Conditions of Satisfaction

1. **Better Auth** is wired with Google and GitHub OAuth providers. Not NextAuth or
   Auth.js — do not import patterns from them.
2. Sessions persist against **Neon** (Postgres), per `design.md`.
3. **Anonymous read access is unaffected.** Every public route still renders with no
   session and stays indexable. This is the rule most at risk in an auth PBI —
   verify it explicitly by loading pages logged out.
4. No `verificationState`, `isVerified`, or trust-level field is introduced.
5. **OAuth emails are never exposed** — not in API responses, not in page props, not
   in logs. Identity is a safety requirement in this region, not a preference.
6. Pseudonymity works: a user can sign in and present a handle with no real name and
   no location.
7. Auth routes respect locale prefixes (`/shn/...`, `/en/...`) once PBI-012 lands, or
   are deliberately excluded from localization with that choice recorded.
8. Secrets live in environment variables. Nothing is committed; `.env*` stays ignored.
9. Sign-in and sign-out are verified end to end against both providers.

## Notes

- **Requires human setup.** OAuth client IDs and secrets must be created in the Google
  and GitHub consoles, and a Neon database provisioned. An agent cannot do these.
- Read the Better Auth docs directly. This is the area where training-data patterns
  are most likely to be NextAuth-shaped and silently wrong.
- Callback URLs will need registering for local, preview, and production — three
  origins, and preview URLs are per-deployment on Vercel.
- Sequencing: **PBI-012 (locale routing) should land first.** Auth adds routes, and
  retrofitting locale prefixes onto them is the rework this ordering avoids.
- Once this ships, **PBI-008 becomes urgent**: with governance deferred, rate limiting
  is the entire spam defense the moment a write path exists.
