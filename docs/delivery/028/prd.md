# PBI-028 — Supabase Auth: Google + GitHub sign-in, real sessions

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-08-01 |
| **Depends on** | [027](../027/prd.md) — the `profiles` table this writes to |
| **Blocks** | Every write path. Rate limiting, real posts/projects/events, notifications, moderation (005), avatar upload — none can start without a session. |
| **Relates to** | [014](../014/prd.md) (the sign-in dialog, built inert), [024](../024/prd.md) (account menu + settings), [025](../025/prd.md) (admin, gated on `viewer.moderator`) |

## Problem

There is no session. `lib/viewer.ts` returns a hardcoded mock under `next dev` and `null`
everywhere else, including under test — so what ships is the signed-out shell, and always
has been. Its own header says as much: *Better Auth replaces the body of `getViewer()`*
(now Supabase Auth).

Seven surfaces are built against that seam and are inert until it is real:

| Surface | What it does today |
| --- | --- |
| Sign-in dialog (014) | Opens, shows two provider buttons, does nothing |
| Account menu (024) | Renders a signed-in state that never ships |
| `/settings` (024) | Full form, Save permanently `disabled` |
| `/admin` (025) | 404s in production; queue actions persist nothing |
| Profile owner menu (024) | Never renders — no viewer to match the handle |
| Create composer (022) | Publish opens the sign-in dialog |
| Notifications (023) | Mock list; a per-user feed needs a user |

PBI-027 built the table these write to. `profiles.auth_user_id` is a unique FK to
Supabase's `auth.users`, and `profiles.moderator` exists specifically to replace the
preview flag. Both are unused columns until this ships.

## Why it matters

**Sign-in is the only gate.** `design.md` is explicit that there is no verification tier
and no approval queue: signing in is enough to post. That makes this the single control
between the platform and an open post box — which is also why it lands *before* the write
paths rather than alongside them. Rate limiting is a separate PBI, and no write path may
ship without one.

**It has to preserve anonymous read access.** The recruiting mechanism is that posts,
projects, profiles, and events render without a session and stay indexable. Adding auth
is the classic moment that breaks: a session read in a layout turns a statically
prerendered page dynamic, and a stray `redirect()` in a shared component gates content
that must never be gated. This PBI touches the shell, so it is exactly where that
regression would come from.

**It is the first time real identity enters the system.** `design.md`'s *Safety and
pseudonymity* section is a requirement, not a preference — the audience is in a region
where linking a public profile to a real identity carries actual risk. PBI-027 made "the
OAuth email is never public" structural by giving `profiles` no email column. This PBI is
where the *rest* of the OAuth payload arrives — real name, avatar URL, provider username
— and decides what is allowed to escape into a public profile.

## Handle assignment

**Decided: derive the handle from the provider** (owner's call, 2026-08-01), rather than
an onboarding step or a random slug. No extra screen — a new member lands back where they
were, signed in and postable.

This resolves cleanly for GitHub and not at all for Google, so the two differ:

- **GitHub** → the `user_name` claim, which is the login the person already chose and
  already displays publicly on GitHub. Deriving from it moves nothing from private to
  public.
- **Google** → there is **no username**. The only candidates are the real name and the
  email local-part, and both are identity-revealing; the email one especially, since
  addresses are frequently `firstname.lastname` and `design.md` forbids exposing the
  OAuth email. So Google falls back to a generated opaque handle.

Deriving where a public handle exists and generating where one does not is what "derive
from the provider" means when a provider has nothing to derive from. The alternative —
slugging a Google user's real name into a public URL by default — would publish an
identity fact the person never chose to publish, which is the specific harm the
pseudonymity rule exists to prevent.

Collisions get a numeric suffix. Handles stay editable in `/settings`.

**`displayName` is never auto-filled from the OAuth profile.** The schema comment on that
column already says it: *optional chosen name — still pseudonymous, never the OAuth real
name*. It starts `null` regardless of provider.

## Conditions of Satisfaction

1. **Anonymous read access is unchanged.** The home page, a post, a project, a profile,
   the developers directory, and the events pages all render with no session and no
   cookie. Verified against the built output, not by clicking.
2. **Pages that were statically prerendered still are.** The build output shows no route
   moving from `○`/`●` to `ƒ` because of a session read.
3. **Sign in with Google works end to end** — dialog → provider → callback → back to the
   page the visitor started on, signed in.
4. **Sign in with GitHub works end to end**, same path.
5. **First sign-in creates exactly one `profiles` row**, with `auth_user_id` set,
   `display_name` null, and a handle per the rules above. Signing in again creates none.
6. **Concurrent first sign-ins cannot create two rows** for one `auth_user_id`, nor two
   profiles with one handle. The unique constraints are enforced by the database, and the
   insert handles the conflict rather than 500ing.
7. **`getViewer()` returns the real session** and the mock is deleted. No
   `NEXT_PUBLIC_PREVIEW_VIEWER` escape hatch survives.
8. **Sign out works** from the account menu, clears the session cookie, and returns the
   visitor to a working signed-out page.
9. **`/admin` is gated on `profiles.moderator`**, read from the database. A signed-in
   non-moderator gets the localised 404, exactly as an anonymous visitor does.
10. **No email, real name, or provider avatar URL reaches any public surface.** Asserted
    against rendered output for a signed-in viewer, not by inspecting components.
11. **Every authorization decision is made on the server.** The nav's client island is
    presentation only, so forging its state gains nothing: `/admin` still 404s for a
    non-moderator, and `/settings` still gates on the server session.
12. **Anonymous readers download no auth JavaScript.** The Supabase browser client
    loads only when an auth cookie is present. Verified against the built chunks.
13. **Writes stay closed.** `/settings` Save remains disabled and the admin queue still
    persists nothing. Both are write paths and neither has a rate limit yet.
14. **Tests cover the seam that would silently break**: anonymous rendering with auth
    present, and a signed-in viewer leaking no identity fact. `lint`, `build`, `test`
    pass.

## Rendering strategy

Decided during implementation (owner's call, 2026-08-01), because CoS 2 and a
server-read nav session cannot both hold.

Every public page renders `AppShell` → `TopNav`. Reading `cookies()` there opts *every*
one of them out of static generation — home, posts, projects, events, profiles. Next 16
removed the per-route `experimental_ppr` escape hatch; Partial Prerendering is now
all-or-nothing via `cacheComponents: true`, which flips data fetching to dynamic-by-default
across the app and carries its own migration guide. Not something to smuggle into an auth
PBI.

So the split is:

- **The nav's account state is a lazy client island.** The static HTML ships the signed-out
  nav. A small client component checks for an auth cookie and, only then, loads the account
  menu and fetches the profile. Anonymous readers — the audience the entire thesis rests on
  — download no auth JavaScript and keep their prerendered, edge-cacheable HTML. Same
  lazy-import pattern as kbar (012) and the share dialog (026).
- **Everything that matters is still decided on the server.** The island is presentation
  only. `/admin` reads the session and `profiles.moderator` server-side and calls
  `notFound()`; `/settings` gates on the server session. Those routes are already `noindex`
  and were never static, so nothing is lost by their being dynamic.

The cost is a brief signed-out nav on first paint for members, which is the correct
trade: the signed-in minority absorbs a flash so the anonymous majority keeps static HTML.

## Notes

- **Scope is auth only** (owner's call). Every surface keeps reading its mock from
  `lib/*.ts`. Switching a surface to real rows is separate work, per surface, once auth is
  trustworthy underneath.
- **No write paths.** Not `/settings` Save, not publish, not the moderation actions. Each
  needs a rate limit first — `AGENTS.md` treats that as non-negotiable, and with
  moderation deferred (005) it is the whole spam defense.
- **No avatar upload.** Avatars stay initials. Storage is its own PBI, and the schema's
  `avatar_path` column stays null.
- **`@supabase/ssr`, not the deprecated auth-helpers.** Cookie-based sessions readable
  from Server Components. Most training data for Supabase auth in Next.js is
  `auth-helpers`-shaped and wrong for this.
- **The owner has enabled Google and GitHub providers** in the Supabase dashboard. Redirect
  URLs for local, preview, and production still need configuring.
- **Making the owner a moderator** is a one-row update after their first sign-in; there is
  no UI for granting it and this PBI does not add one.
- **`proxy.ts`, not `middleware.ts`.** Supabase's docs put session refresh in
  `middleware.ts`; this Next version renamed the convention and the repo already routes
  locales through `proxy.ts`. Any session refresh has to live there — and must not turn
  public pages dynamic.
