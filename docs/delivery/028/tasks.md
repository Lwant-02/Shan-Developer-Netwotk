# PBI-028 — Tasks

Breakdown of [PBI-028](./prd.md).

| # | Task | Status |
| --- | --- | --- |
| 1 | Decide the rendering strategy — a server-read nav session cannot coexist with static prerendering, and Next 16 removed per-route PPR | Done |
| 2 | Install `@supabase/supabase-js` + `@supabase/ssr`; add the server client factory (no browser client — see below) | Done |
| 3 | Session refresh in `proxy.ts`, alongside the locale routing — **not** `middleware.ts` | Done |
| 4 | Sign-in server actions for Google and GitHub; wire the [014](../014/prd.md) dialog's two dead buttons | Done |
| 5 | `/auth/callback` — exchange the code, then create the `profiles` row on first sign-in | Done |
| 6 | Handle derivation: GitHub `user_name`, generated for Google, numeric suffix on collision | Done |
| 7 | Replace the body of `getViewer()` with the real session; delete `mockViewer` and the preview gate | Done |
| 8 | The nav account island — static signed-out shell, lazy-loaded account menu when an auth cookie is present | Done |
| 9 | Sign out from the account menu | Done |
| 10 | Gate `/admin` on `profiles.moderator` read from the database, server-side | Done |
| 11 | Tests: anonymous rendering with auth wired, and no identity leak for a signed-in viewer | Done |
| 12 | Verify the CoS one by one; close out (statuses, `design.md`, `AGENTS.md`, PR) | Done — **except 3, 4, 5, 6, 8**, which need task 13 |
| 13 | Owner: configure redirect URLs for local, preview, and production | Proposed |
| 14 | Owner: set `moderator = true` on your own profile row after first sign-in | Proposed |

## Notes

- **Tasks 13–14 are the owner's.** An agent cannot configure a dashboard it has no
  account for, and there is deliberately no UI for granting moderator.
- **Scope is auth only.** Every surface keeps its mock; no write path ships. `/settings`
  Save stays disabled and the moderation queue still persists nothing — both need rate
  limiting first.
- **`getClaims()`, not `getUser()` or `getSession()`.** Current Supabase guidance:
  `getSession()` is not guaranteed to revalidate the token and must never back an
  authorization decision in server code.
- **`@supabase/ssr`, not `auth-helpers`.** The latter is deprecated and is what most
  training data shows.

### Task 1 — what was decided and why

Every public page renders `AppShell` → `TopNav`, so a `cookies()` read there would opt
home, posts, projects, events, and profiles out of static generation together. Next 16
removed `experimental_ppr`; PPR now arrives only with `cacheComponents: true`, which makes
data fetching dynamic-by-default app-wide and is its own migration.

**Owner's call: static shell + a lazy client island for the nav's account state.** The
anonymous majority keeps prerendered, edge-cacheable HTML and downloads no auth
JavaScript; the signed-in minority absorbs a brief signed-out nav on first paint.

The island is **presentation only**. Every authorization decision stays server-side —
`/admin` reads `profiles.moderator` on the server and calls `notFound()`, and `/settings`
gates on the server session. Both routes are already `noindex` and were never static, so
their being dynamic costs nothing.

### Added after review (owner's call)

- **Create, notifications, and the account menu are hidden for anonymous visitors.** All
  three belong to someone with an account — nothing to publish, no notifications, no
  identity. The account menu therefore lost its signed-out branch entirely: an account
  button whose only offer is a way to get an account is worse than no button. The ways in
  are the nav's Sign in button (below `xl`) and the right rail's welcome card (`xl` and
  up), which between them cover every width.
- **`AuthedOnly` hides; it does not protect.** `children` pass through as a slot, so
  wrapped Server Components stay on the server — but their client chunks are still
  referenced in the RSC payload and still ship. This is a visual change, **not a bundle
  saving**, and nothing behind it may rely on it for safety.
- **Auth helpers now exist in two deliberately different shapes.** `lib/auth/guards.ts`
  has `requireViewer` / `requireModerator` / `requireOwner`, which enforce and can end the
  request; `viewer-provider.tsx` has `useIsAuthenticated` / `useIsModerator` /
  `useIsOwner`, which only decide what to draw. The naming split is the point: a single
  `isAdmin()` usable on both sides is how someone eventually gates something real on an
  answer the browser can forge. The pure predicates (`isOwner`, `isModerator`) live in
  `lib/viewer.ts` and decide nothing on their own — where the `Viewer` came from is what
  makes an answer trustworthy.

### Second review round (owner's call)

- **Identity defaults reversed.** Handle, display name, and avatar are now all seeded from
  the OAuth profile, so a new member arrives recognisable rather than as `member_a7f3k2`
  with grey initials. The trade, recorded plainly: the provider's real name becomes the
  public default, which makes pseudonymity something to opt into via `/settings` rather
  than the starting point. **The email is still never copied** and has no column to go to;
  it is not even a fallback for a handle, because addresses are so often
  `firstname.lastname`. Tests pin that line.
- **Schema:** `avatar_path` became `avatar_url` (one column, not two), and
  `terms_accepted_at` was added. Migration `20260801090604_profile_avatar_url_and_terms`.
- **Consent is recorded twice, for two different jobs.** The column is the durable record
  of who agreed and when. `localStorage` is what actually skips the checkbox next time,
  because nobody is identified until *after* they authenticate — so the database cannot
  answer the question at the moment the dialog needs it. Once remembered the checkbox is
  removed rather than pre-ticked: a ticked box nobody ticked reads as consent asserted on
  someone's behalf.
- **Toasts via `sonner`.** Sign-out fires at the call site. **Sign-in cannot** — it sends
  the browser to Google or GitHub, so the page and any pending toast are gone. The only
  thing that survives is a flag in the return URL, read once by `ViewerProvider` (already
  mounted app-wide) and stripped from the URL so a refresh does not re-announce it.
- **`shadcn add sonner` dragged `next-themes` back in.** The registry component calls
  `useTheme()`; PBI-013 removed that package deliberately. Uninstalled again and the
  component edited to `theme="dark"`, with a note to keep the edit.
- **Locale switcher moved into the mobile drawer.** The header row was carrying a
  hamburger, a logo, a locale pill and a Sign in button on a 390px screen. It stays in the
  header from `sm` up.
- **`useSyncExternalStore`, not an effect,** for reading remembered consent — React 19's
  `set-state-in-effect` lint rule rejects the effect form, and this also gives the server
  an explicit `false` instead of a hydration mismatch.

### Found while building

- **No Supabase client reaches the browser at all.** The plan was to lazy-load one in the
  island; instead the island fetches `/api/viewer`, which reads the session on the server
  and returns only the `Viewer` fields. Better on every axis — smaller, and the server
  decides what is disclosed. `lib/supabase/client.ts` was written and then deleted.
- **`lib/viewer.ts` had to be split.** Once `getViewer()` imported Prisma, the client
  components that import `PROVIDER` from the same module would have dragged the database
  client into the browser bundle. Types and constants stayed in `lib/viewer.ts`;
  `getViewer()` moved to `lib/auth/viewer.ts` behind `import "server-only"`, so that
  mistake now fails the build instead of shipping.
- **`proxy.ts` had to stop matching `/auth`.** next-intl was rewriting the OAuth callback
  to `/shn/auth/callback`, which would have broken the code exchange on every sign-in.
- **`mockViewer` moved to `__tests__/fixtures/viewer.ts`.** It was exported from app code
  purely to drive the dev preview; with a real session there is no reason to ship it.

### Verified

| Check | Result |
| --- | --- |
| Public routes still statically prerendered | 14 of 14 `●`; only `/admin`, `/settings`, `/api/viewer`, `/auth/callback` are `ƒ` |
| Supabase JS in any client chunk | none |
| Prerendered home page asserts a session | no — "Not signed in", no `Signed in via` |
| Admin link in anonymous HTML | absent |
| `/api/viewer` anonymously | `null`, `Cache-Control: private, no-store` |
| `/en/admin` anonymously | 404 |
| `lint` / `build` / `test` | pass; 103 tests |

**Not verified, and honestly so:** CoS 3, 4, 5, 6, and 8 — the OAuth round trip, profile
creation, and sign-out — need redirect URLs configured (task 13). The profile-creation
logic is unit-tested including both race branches, but no real provider round trip has
run.
