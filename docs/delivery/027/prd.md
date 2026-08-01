# PBI-027 — Database foundation: Supabase + Prisma + schema

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-08-01 |
| **Depends on** | A Supabase project (owner-created; the DB password is not retrievable through the management API) |
| **Relates to** | Every shell-and-mock PBI — 010 (posts), 016 (comments), 017 (profiles), 020 (projects), 021 (events), 023 (notifications), 025 (reports). This is the seam all of them were built against. |

## Problem

Everything readable in the app comes from a typed mock in `lib/*.ts`. Every one of those
modules says the same thing in its header: *this is not the database schema; real data
replaces it without touching the UI*. That promise has never been tested, because there
is no database.

Nothing else can start until it is. Auth, writes, rate limits, images, search — all of
them need somewhere to put a row.

## Why it matters

This is the first PBI that stores anything about a person, which makes it the first that
can leak one. `design.md`'s *Safety and pseudonymity* section is a **requirement, not a
setting**, and a schema is where that gets decided permanently: a column that exists will
eventually be populated, exposed, and correlated.

So the schema is deliberately narrow. **There is no email column anywhere.** The OAuth
email lives in Supabase's `auth.users`, which Prisma does not manage, and the public
`Profile` is a separate table keyed to it by id. That is not a convention someone has to
remember — it is the shape of the database.

## Approach

- **Supabase** for database, auth, and storage — one vendor, Singapore region (closest to
  the audience; the Vercel functions should match). Reverses the Neon and Better Auth
  decisions; both supersedes are recorded in `design.md`.
- **Prisma 7** as the data layer, with the `prisma-client` generator and
  `@prisma/adapter-pg`. Prisma 7 dropped the built-in engine for driver adapters, and
  moved the datasource URL out of the schema into `prisma.config.ts`.
- **Two connection strings.** The app uses the pooled Supavisor URL (`DATABASE_URL`,
  port 6543); migrations use the direct one (`DIRECT_URL`, port 5432), because Supavisor
  in transaction mode cannot hold the advisory locks `prisma migrate` takes — the failure
  looks like a hang, not a config error. Prisma 7 has no `directUrl` field, so the split
  lives in `prisma.config.ts`.
- **RLS on every table, with no policies — deny by default.** Not the authorization
  model: Prisma connects with a privileged role and bypasses RLS, and authorization sits
  in the server handlers beside the rate limits. It is there because **Supabase publishes
  the `public` schema over PostgREST with a public anon key, and Prisma migrations do not
  enable RLS** — so every table `prisma migrate` creates is world-readable until this
  runs. `ENABLE` plus `FORCE`, since `ENABLE` alone exempts the table owner.
- **CHECK constraints for the polymorphic tables**, which Prisma cannot express: a
  `Comment`, `Star`, or `Report` must point at exactly one target, nobody follows
  themselves, and a reporter cannot resolve their own report.
- **Schema mirrors the mock shapes**, so replacing `lib/feed.ts` with a query is a
  server-side change and the components stay untouched.

## Conditions of Satisfaction

1. `prisma migrate` creates every table from `prisma/schema.prisma` against the Supabase
   project.
2. **No table in `public` is readable through the anon PostgREST endpoint** — verified,
   not assumed (Supabase's own security advisors report zero RLS findings).
3. There is **no email column** in any table Prisma manages.
4. The polymorphic CHECK constraints are applied and a violating insert is rejected.
5. The app connects through the pooled URL and migrations through the direct URL; a dev
   server reload does not exhaust the connection pool.
6. `lint`, `build`, and `test` still pass — this PBI adds no UI and must change no
   rendered output.

## Notes

- **This PBI stops at the schema.** No reads are switched over, no auth is wired, no
  writes exist. Each of those is its own PBI, and every write path needs a rate limit
  before it ships.
- **The `.env.local` values are owner-supplied.** The database password is shown once at
  project creation and is not retrievable through the API or the MCP.
- **The Supabase MCP is for verification, not migration.** `prisma migrate` owns schema
  changes because it maintains `_prisma_migrations`; applying DDL through the MCP would
  leave Prisma believing the database has drifted.
- **`viewer.moderator` (PBI-024/025) becomes `Profile.moderator`** when auth lands. The
  preview flag in `lib/viewer.ts` is the thing being replaced.

## Out of scope

- Wiring auth (Supabase Auth, the OAuth callback, session reading, the `profiles` row
  created on signup).
- Replacing any mock module with a query.
- Any write path, and therefore any rate limit.
- Image upload, compression, and EXIF stripping — needs the storage bucket and a
  rate-limited endpoint.
- Seed data. The mocks stay until reads are switched over, one surface at a time.
- Full-text search on Myanmar script, still 🔴 in `design.md`.
