# PBI-029 — Better Auth: Google + GitHub sign-in, real sessions

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-08-10 |
| **Depends on** | [027](../027/prd.md) — the `profiles` table this writes to |
| **Blocks** | Every write path. Rate limiting, real posts/projects/events, notifications, moderation ([005](../005/prd.md)), avatar upload — none can start without a session. |
| **Replaces** | [028](../028/prd.md) — Supabase Auth, built and then removed on 2026-08-10 |
| **Relates to** | [014](../014/prd.md) (the sign-in dialog), [024](../024/prd.md) (account menu + settings), [025](../025/prd.md) (admin) |

## Problem

There is no authentication. The identity layer is frontend-only mock state:
`mockCurrentUser` in `lib/current-user.ts` seeds `CurrentUserProvider`, so **every visitor
renders as signed in** and `useAuthActions` flips that in local state. Nothing reads a
cookie, a header, or the database.

This is worse than the state PBI-028 was written against. Then, `getViewer()` returned
`null` outside `next dev`, so production shipped a signed-out shell. Now the mock ships to
everyone, which has one concrete consequence today:

**`/admin` is ungated and publicly reachable.** Commit `e864094` removed its server-side
`profiles.moderator` check along with the rest of the auth layer. It is acceptable only
because its queue is mock data that persists nothing — but the moderation *design*, with
Dismiss / Delete content / Ban author, is visible to anyone who guesses the URL.

Seven surfaces are built against this seam and are inert until it is real:

| Surface | What it does today |
| --- | --- |
| Sign-in dialog (014) | Opens, two provider buttons, sets local state and toasts |
| Account menu (024) | Renders the signed-in state for everyone, from the mock |
| `/settings` (024) | Full form prefilled from the mock, Save permanently `disabled` |
| `/admin` (025) | **Publicly reachable**; queue actions persist nothing |
| Profile owner menu (024) | Renders whenever the handle matches the mock |
| Create composer (022) | Publish opens the sign-in dialog |
| Notifications (023) | Mock list; a per-user feed needs a user |

PBI-027 built the table these write to, and it survived the Supabase removal intact.
`profiles.auth_user_id` is a bare `uuid` with a unique constraint and **no foreign key**
into any auth table, so it can key off a new provider without a data migration.
`profiles.moderator` exists specifically to gate `/admin` and is unused until this ships.

## Why it matters

**Sign-in is the only gate.** `design.md` is explicit that there is no verification tier
and no approval queue: signing in is enough to post. That makes this the single control
between the platform and an open post box — which is why it lands *before* the write
paths rather than alongside them. Rate limiting is separate work, and no write path may
ship without one.

**It has to preserve anonymous read access.** The recruiting mechanism is that posts,
projects, profiles, and events render without a session and stay indexable. Adding auth is
the classic moment that breaks: a session read in a layout turns a statically prerendered
page dynamic, and a stray `redirect()` in a shared component gates content that must never
be gated. This PBI touches the shell, so it is exactly where that regression comes from.

**It is the first time real identity enters the system.** `design.md`'s *Safety and
pseudonymity* section is a requirement, not a preference — the audience is in a region
where linking a public profile to a real identity carries actual risk. This is where the
OAuth payload arrives — real name, avatar URL, provider username, email — and decides what
is allowed to escape into a public profile.

## Provider

**Better Auth**, with Google and GitHub OAuth. This settles the 🔴 that commit `e864094`
opened in `design.md` under *Authentication*; Google + GitHub was never in question.

Better Auth is a library, not a hosted service: it owns tables in the existing Supabase
Postgres and is reached through the Prisma client already configured. That is the reason
to prefer it here — the database, its region, and its data layer stay exactly as PBI-027
left them, and swapping auth again later means dropping four tables rather than migrating
a vendor.

## Where the auth tables live

**Decided: their own Postgres schema** (owner's call, 2026-08-10).

Better Auth's core schema is four tables — `user`, `session`, `account`, `verification` —
and **`user.email` is required and cannot be removed.** It is what links a second provider
to an existing account, so someone who signs in with Google and later with GitHub lands on
one identity instead of two.

This does not weaken the identity rule, but it does move it. Under Supabase the email sat
in `auth.users`, a schema PostgREST does not publish, so "no email column" was structural.
Better Auth's tables go wherever the Prisma schema puts them — and today that is `public`,
which Supabase publishes to anyone holding the publishable key.

So the auth tables get their own schema via Prisma's `multiSchema`, and `public` keeps
only application data:

| `public` — published by PostgREST | auth schema — never published |
| --- | --- |
| `profiles` (no email column), posts, projects, events, … | `user` (email), `session`, `account`, `verification` |

That restores the two-safeguard position PBI-027 designed for: RLS is the backstop, and
the schema boundary means a forgotten `enable-rls.sql` run cannot expose an email over the
REST API. The restated rule for `AGENTS.md` is **"the email lives only in the auth schema;
`profiles` has no email column, ever"** — same intent, one word different.

## Handle assignment

**Carried forward unchanged from PBI-028** (owner's call, 2026-08-01). The reasoning was
about identity safety, not about Supabase, so the provider swap does not disturb it:

- **GitHub** → the provider's username claim, which is the login the person already chose
  and already displays publicly. Deriving from it moves nothing from private to public.
- **Google** → there is no username. The only candidates are the real name and the email
  local-part, both identity-revealing — addresses are frequently `firstname.lastname`. So
  Google falls back to a generated opaque handle.

Collisions get a numeric suffix; handles stay editable in `/settings`. **`displayName` is
never auto-filled from the OAuth profile** — the schema comment on that column already
says so.

Commit `90c1c87` holds the deleted implementation of exactly this — handle normalisation,
the reserved-name list, collision retry, and the https-only avatar check — written against
Supabase's claim shape. It is worth adapting rather than rewriting; only the payload type
changes.

## Conditions of Satisfaction

1. **Anonymous read access is unchanged.** The home page, a post, a project, a profile,
   the developers directory, and the events pages all render with no session and no
   cookie. Verified against the built output, not by clicking.
2. **Pages that were statically prerendered still are.** The build output shows no route
   moving from `○`/`●` to `ƒ` because of a session read. `/admin` and `/settings` moving
   to `ƒ` is expected and fine — both are `noindex`.
3. **Sign in with Google works end to end** — dialog → provider → callback → back to the
   page the visitor started on, signed in.
4. **Sign in with GitHub works end to end**, same path.
5. **Signing in with both providers on one email yields one identity**, not two profiles.
6. **First sign-in creates exactly one `profiles` row**, with `auth_user_id` set,
   `display_name` null, and a handle per the rules above. Signing in again creates none.
7. **Concurrent first sign-ins cannot create two rows** for one `auth_user_id`, nor two
   profiles with one handle. The unique constraints are enforced by the database, and the
   insert handles the conflict rather than 500ing.
8. **The auth tables are in their own Postgres schema**, and `public` contains no email
   column in any table. Verified against the live database, not the schema file.
9. **RLS is enabled and forced on every new table**, and `prisma/sql/enable-rls.sql`
   covers them — including whatever the auth schema needs to stay unpublished.
10. **`mockCurrentUser` is deleted** and `CurrentUserProvider` reflects the real session.
    No preview or escape-hatch flag survives.
11. **Sign out works** from the account menu, clears the session cookie, and returns the
    visitor to a working signed-out page.
12. **`/admin` is gated on `profiles.moderator`, read from the database, on the server.**
    A signed-in non-moderator gets the localised 404, exactly as an anonymous visitor
    does. This closes the hole described under *Problem*.
13. **No email, real name, or provider avatar URL reaches any public surface.** Asserted
    against rendered output for a signed-in viewer, not by inspecting components.
14. **Every authorization decision is made on the server.** The nav's client island is
    presentation only, so forging its state gains nothing.
15. **Anonymous readers download no auth JavaScript.** Verified against the built chunks.
16. **Writes stay closed.** `/settings` Save remains disabled and the admin queue still
    persists nothing. Both are write paths and neither has a rate limit yet.
17. **Tests cover the seam that would silently break**: anonymous rendering with auth
    present, and a signed-in viewer leaking no identity fact. `lint`, `build`, `test`
    pass.

## Rendering strategy

**Carried forward from PBI-028 and already recorded in `AGENTS.md` and `design.md`.** It
was a consequence of Next 16, not of Supabase, so it binds Better Auth identically.

Every public page renders `AppShell` → `TopNav`. Reading cookies there opts *every* one of
them out of static generation — home, posts, projects, events, profiles. Next 16 removed
the per-route `experimental_ppr` escape hatch; Partial Prerendering now arrives only with
`cacheComponents: true`, which flips data fetching to dynamic-by-default app-wide and is
its own migration. Not something to smuggle into an auth PBI.

So the nav's account state stays a lazy client island — the static HTML ships the
signed-out nav, and the island resolves identity afterwards, only when an auth cookie is
present. Everything that *matters* is still decided on the server: `/admin` and
`/settings` read the session server-side and are already `noindex` and dynamic.

Better Auth reads sessions with `auth.api.getSession({ headers: await headers() })`, which
is a header read and therefore carries exactly the same hazard as the Supabase version.
CoS 2 is what catches a mistake here.

## Notes

- **Scope is auth only.** Every surface keeps reading its mock from `lib/*.ts`. Switching
  a surface to real rows is separate work, per surface, once auth is trustworthy
  underneath.
- **No write paths.** Not `/settings` Save, not publish, not the moderation actions. Each
  needs a rate limit first — `AGENTS.md` treats that as non-negotiable, and with
  moderation deferred (005) it is the whole spam defense.
- **No avatar upload.** Avatars stay initials; `profiles.avatar_path` stays null. Storage
  is its own PBI.
- **Resolved 2026-08-10 — the Prisma 7 + `@prisma/adapter-pg` risk is cleared.** The
  concern was Better Auth discussion #6529, reporting a runtime `P1010` "user was denied
  access" against this repo's exact setup while `db push` worked. A throwaway spike
  (`better-auth@1.6.26`, Prisma 7.9.1) settled it and was then deleted:
  - Against a local Postgres 15, `betterAuth({ database: prismaAdapter(db) })` over a
    `PrismaClient` constructed with `PrismaPg` **signed a user up, signed them in, and
    persisted the session**. No `P1010`.
  - Against the **real pooled Supabase `DATABASE_URL`** (read-only — no writes, no DDL),
    the connection authorized (`select 1`) and Better Auth's adapter failed with *"Model
    user does not exist in the database"* — the missing table, **not** an access denial.
    That is the discriminator: `P1010` fires on connect, before any table lookup.
  - The upstream reporter said the cause was "the database provider", and their database
    was not Supabase. It does not reproduce here.
- **`multiSchema` is GA on Prisma 7 — no `previewFeatures` flag.** Verified in the same
  spike: a datasource with `schemas = ["public", "auth"]` and `@@schema` on each model
  pushed cleanly, creating both namespaces. The spike also asserted the two properties
  this PBI cares about: the four auth tables land in `auth`, `profiles` stays in `public`,
  and `information_schema` shows **no column matching `%email%` anywhere in `public`**.
  Worth reproducing as a real test (CoS 8), since it is the check that would catch a
  future migration quietly putting an email in the published schema.
- **`auth_user_id` is `@db.Uuid`; Better Auth generates string ids** that are not UUIDs by
  default. Either configure Better Auth's id generation to emit UUIDs or widen the column
  — decide at implementation, and prefer the former so the existing type holds.
- **The route handler mounts at `/api/auth/[...all]`.** `proxy.ts`'s matcher already
  excludes `api`, so the locale rewrite that broke Supabase's `/auth/callback` cannot
  recur — but do not narrow that exclusion.
- **`proxy.ts`, not `middleware.ts`.** Better Auth's own Next.js docs cover the Next 16
  rename, so this is one of the few places its documentation matches this repo. Any
  session refresh must live there and must not turn public pages dynamic.
- **Google and GitHub OAuth apps need re-registering** against Better Auth's callback URL,
  for local, preview, and production separately. The Supabase-era redirect URLs are dead.
- **Two env vars come out** once this lands: `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are already unread. `DATABASE_URL` and
  `DIRECT_URL` stay.
- **Making the owner a moderator** is a one-row update after their first sign-in. There is
  no UI for granting it and this PBI does not add one.
- **`AGENTS.md` and `design.md` need updating on completion**: the frontend-only identity
  block is replaced, *Authentication* goes 🔴 → 🟢 naming Better Auth, and the no-email
  rule is restated as the auth-schema version above.
