# PBI-008 — Rate limiting for write endpoints

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Depends on** | PBI-007 (auth) |

## Problem

There are no write endpoints yet, and no rate limiting to protect them. The moment
PBI-007 lands, anyone who can sign in with a Google or GitHub account can post — and
those accounts are free and trivially created in bulk.

## Why it matters

This is the load-bearing PBI in the backlog.

`AGENTS.md` states the rule plainly: sign-in is the only gate, so **rate limiting and
moderation are the entire spam defense**. Moderation has since been **deferred**
(PBI-009), which removes the human half of that pair. Rate limiting is therefore not
routine hardening — it is currently the *whole* defense.

A community platform that gets overrun early doesn't recover. The people it was built
for leave, and they are exactly the audience that cannot easily be re-acquired.

## Conditions of Satisfaction

1. **Every write endpoint** is rate limited. Not most — every one. A write path
   without a limit is incomplete and should not merge.
2. Limits are enforced **server-side**. Client-side throttling is not a limit.
3. Limits are keyed on the authenticated user, with an additional IP-based limit for
   unauthenticated requests to any endpoint that accepts them.
4. Exceeding a limit returns a proper `429` with a `Retry-After` header, and the UI
   surfaces it in the active locale — not an unhandled error.
5. **Anonymous reads are never rate limited into failure.** Public read access and
   indexability are product rules; a crawler must not be able to trip a write limit.
6. Limits survive deploys and instance restarts — in-memory counters are not
   sufficient on serverless.
7. There is a test proving a write path rejects when over its limit. Verify it can
   fail.
8. Limits are recorded somewhere a human can find and tune without reading code.

## Notes

- **Storage choice is open.** Serverless functions on Vercel don't share memory
  between invocations, so this needs a shared store — Neon, Upstash Redis, or Vercel
  KV. Neon is already a dependency; adding a second store is a real cost worth
  weighing. Decide and record it.
- Set limits deliberately per action, not one global number. Posting, editing,
  reporting, and profile updates have different abuse profiles and different
  legitimate rates.
- Consider what happens to a **legitimate burst** — someone posting several projects
  after signing up is normal behaviour, not abuse.
- Revisit PBI-009 when this ships. Rate limiting slows bulk abuse; it does nothing
  about a single account posting something that needs removing.
