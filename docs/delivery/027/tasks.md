# PBI-027 — Tasks

Breakdown of [PBI-027](./prd.md).

| # | Task | Status |
| --- | --- | --- |
| 1 | Install Prisma 7 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`) and scaffold with `prisma init` | Done |
| 2 | Write `prisma/schema.prisma` — Profile, SocialLink, Post, Project, Event, Comment, Like, Star, Follow, Notification, Report. No email column anywhere | Done |
| 3 | Map every table and column to **snake_case** (`@@map` / `@map`), so RLS policies and SQL files need no quoted identifiers | Done |
| 4 | Use **UUIDv7** primary keys (`uuid(7)`) rather than random v4, which fragments the primary-key index | Done |
| 5 | Index every foreign key — Postgres does not do it automatically, and `onDelete: Cascade` turns a missing index into a full scan | Done |
| 6 | Add `lib/db.ts` — client singleton on the pooled connection with a dev-reload guard | Done |
| 7 | Split migrations onto `DIRECT_URL` in `prisma.config.ts` (Prisma 7 has no `directUrl` field, and Supavisor cannot hold migrate's advisory locks) | Done |
| 8 | Write `prisma/sql/enable-rls.sql` — RLS `ENABLE` + `FORCE` on every table, no policies | Done |
| 9 | Write `prisma/sql/polymorphic-checks.sql` — one-target CHECKs, no self-follow, no self-resolved report | Done |
| 10 | Record the supersedes in `design.md` — Supabase over Neon, Supabase Auth over Better Auth, plus the RLS and image-compression decisions | Done |
| 11 | Owner: create the Supabase project (Singapore) and put the connection strings in `.env.local` | Done |
| 12 | Run the first `prisma migrate`, then apply both SQL files | Done |
| 13 | Verify: RLS covers **every** table with no policies, and a two-target insert is rejected | Done |
| 14 | Verify against CoS: `lint`, `build`, `test` unchanged; close out PBI (statuses, PR) | Done |

## Notes

- **The MCP verifies, it does not migrate.** `prisma migrate` owns schema changes because
  it maintains `_prisma_migrations`; DDL applied through the MCP would read as drift.
- Tasks 3–5 came out of the `supabase-postgres-best-practices` skill and corrected the
  first draft of the schema.

### Found during task 12

- **`prisma.config.ts` loaded `.env`, not `.env.local`.** `dotenv/config` reads only
  `.env`; Next loads `.env.local` itself, so the app would have worked while every CLI
  command failed with "datasource.url property is required". Now loads both, `.env.local`
  first.
- **`_prisma_migrations` needed RLS too.** The first draft skipped it as Prisma's own
  bookkeeping, but it sits in `public`, so PostgREST published the schema's entire change
  history to anyone with the publishable key. `ENABLE` only — never `FORCE`, since
  `prisma migrate` writes to it on every deploy.

### What task 13 actually showed

Verified against the live database, not inferred:

| Check | Result |
| --- | --- |
| Tables in `public` without RLS | 0 of 12 |
| Policies defined | 0 — deny by default, as intended |
| Columns matching `%email%` | none, in any table |
| Comment on a post **and** a project | rejected, `comments_one_target` |
| Comment with no target at all | rejected, `comments_one_target` |
| A profile following itself | rejected, `follows_not_self` |

The probe ran inside a transaction and rolled back; the database is empty.

**`postgres` has `rolbypassrls`.** Prisma's runtime connection therefore ignores RLS
entirely. That is the intended design — RLS is a backstop against the public PostgREST
endpoint, not against our own queries — but it means **authorization has to live in the
server handlers**, beside the rate limits. Nothing in the database will catch a missing
ownership check.
