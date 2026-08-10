# PBI-029 — Tasks

Breakdown of [PBI-029](./prd.md).

| # | Task | Status | CoS |
| --- | --- | --- | --- |
| 1 | Prove Better Auth over Prisma 7 + `@prisma/adapter-pg` — the risk that blocked agreement | Done | — |
| 2 | Install `better-auth`; add `lib/auth/config.ts` with the Google + GitHub providers and the Prisma adapter | Done | — |
| 3 | Add the four auth models to `prisma/schema.prisma` in their **own `app_auth` schema** via `multiSchema`; migrate | Done | 8 |
| 4 | Extend `prisma/sql/enable-rls.sql` to cover the new tables, and keep the auth schema unpublished | Done | 9 |
| 5 | Route handler at `app/api/auth/[...all]/route.ts` via `toNextJsHandler` | Done | 3, 4 |
| 6 | Server-side session read (`lib/auth/get-current-user.ts`), `import "server-only"`, joined to `profiles` | Done | 14 |
| 7 | `ensureProfile` on first sign-in — one row, collision-safe, adapted from `90c1c87` | Done | 6, 7 |
| 8 | Handle derivation from the provider name (`Test User` → `test_user`), generated fallback, numeric suffix on collision | Done | 6 |
| 9 | `/api/me` + rewire `CurrentUserProvider` to the real session; **delete `mockCurrentUser`** and `useAuthActions` | Done | 10 |
| 10 | Wire the [014](../014/prd.md) dialog's two buttons to real sign-in; sign out from the account menu | Done | 3, 4, 11 |
| 11 | Re-gate `/admin` on `profiles.moderator`, read from the database, server-side | Done | 12 |
| 12 | `/settings` reads the real session again; keep Save disabled | Done | 16 |
| 13 | Tests: anonymous render, no identity leak, and **no `%email%` column in `public`** | Done | 13, 17 |
| 14 | Verify every CoS one by one; close out (statuses, `design.md` 🔴 → 🟢, `AGENTS.md`) | Done | all |
| 15 | **Owner:** add the Better Auth redirect URIs to the Google and GitHub OAuth apps | Done — both providers sign in and link to one identity | 3, 4 |
| 16 | **Owner:** set `moderator = true` on your own profile row after first sign-in | Proposed — still `false`, so `/admin` correctly 404s | 12 |

## Notes

- **Task 16 is still open and is the owner's.** `profiles.moderator` is `false`, so
  `/admin` renders the localised 404 — correct behaviour, but it means the moderation
  surface is unreachable until one row is updated. There is deliberately no UI for
  granting it.
- **Scope is auth only.** Every surface keeps its mock; no write path ships. `/settings`
  Save stays disabled and the moderation queue still persists nothing — both need rate
  limiting first.
- **`90c1c87` is the reference for tasks 7 and 8**, not a rewrite. Only the OAuth payload
  type changes; the handle rules, reserved-name list, collision retry, and https-only
  avatar check are all product decisions that survived the provider swap.
- **Task 9 deletes the mock.** `mockCurrentUser` and `useAuthActions` exist only because
  auth was removed; leaving them behind would be a second source of truth for identity.

### Task 1 — result

Cleared on 2026-08-10 and recorded in the PRD. `better-auth@1.6.26` over Prisma 7.9.1 with
`PrismaPg` signed a user up, signed them in, and persisted a session against local
Postgres; the real pooled Supabase connection authorized and failed only on the missing
table. `multiSchema` is GA with no preview flag. Discussion #6529 does not reproduce here.

### Decisions taken during implementation (owner's calls, 2026-08-10)

- **The schema is `app_auth`, not `auth`.** Supabase already owns an `auth` schema with 18
  of its own tables. Pointing Prisma at it made `migrate dev` treat every one as drift and
  demand a **reset of both schemas** — caught by `--create-only`, applied to nothing.
  **Never add `auth` to the Prisma `schemas` list.**
- **`profiles.id` *is* the auth user id** — a shared primary key with a real FK and
  `onDelete: Cascade`, replacing the bare `auth_user_id` uuid that had no FK because
  Supabase's `auth.users` sat outside Prisma's reach. Deleting an account now removes the
  profile automatically. All 10 content relations already pointed at `profiles.id`, so
  none of them moved.
- **`profiles.display_name` and `profiles.avatar_url` are gone.** The name and avatar come
  from `app_auth.user.name` / `.image` through the FK, so there is one source per fact.
  `CurrentUser`'s shape is unchanged — the session read fills those fields.
- **The handle is derived from the provider name for both providers**, normalised to
  `test_user`. This follows `AGENTS.md` ("the provider's real name is the public default,
  so pseudonymity is something a member opts into"), which is also what the shipped 028
  code did. PBI-028's PRD said Google should get a generated handle instead; that line was
  already contradicted by the implementation and does not bind here.
- **The session cookie is `httpOnly`, so `proxy.ts` mirrors it into a readable hint.**
  028's client architecture assumed a JS-readable cookie (Supabase's `sb-` cookies are),
  and carrying it over meant the gate never fired and **the signed-in UI never appeared at
  all**. `proxy.ts` now sets a secret-free `sdn.session=1` when a session cookie is
  present and clears it when it is not; the client gates on that.
- **Sign out is a full page load.** The action clears the cookie, but `useSession()` keeps
  a client cache that a server-action `redirect()` does not invalidate, so the nav kept
  showing a signed-in user until the next reload. The toast survives via `?signed_out=1`,
  the same mechanism as `?signed_in=1`.
- **The client uses Better Auth's `useSession()`, lazy-loaded.** `customSession` shapes
  the payload server-side so `handle`, `role` and `moderator` arrive in one call **and the
  email never leaves the server**. The island is behind a dynamic import gated on the
  session cookie, so anonymous readers still download no auth JavaScript (CoS 15,
  verified against the built chunks). This replaced the hand-rolled `/api/me` fetch, which
  is deleted.

### Task 3 — why a separate schema

`user.email` is required by Better Auth and cannot be removed. Supabase publishes `public`
over PostgREST to anyone holding the publishable key, so an email in `public` is guarded
only by `enable-rls.sql`, which has to be re-run after every migration that adds a table.
Putting the auth tables in their own schema restores what `auth.users` gave for free:
PostgREST never publishes them, and RLS becomes the second safeguard rather than the only
one. `profiles` keeps no email column, ever.
