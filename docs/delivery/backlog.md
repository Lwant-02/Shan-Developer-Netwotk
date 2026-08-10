# Product Backlog

The ordered list of Product Backlog Items (PBIs) for Shan Developer Network.
One row per PBI. Detail lives in `docs/delivery/<id>/prd.md` and `tasks.md`.

**This file is the index, not the spec.** Keep rows short; put reasoning in the PRD.

**PBIs are filed one at a time, by the owner, using the `create-pbi` skill** — when
the work is actually wanted, not speculatively. A backlog pre-stuffed with everything
that might one day be built is a wish list: it goes stale faster than it gets read,
and it invites building against items nobody decided on. Known-open work that hasn't
been scoped yet lives in `design.md` and in Open Questions below — not as `Proposed`
rows here.

## Status values

| Status | Means |
| --- | --- |
| `Proposed` | Written down, not agreed. Do not build. |
| `Agreed` | Scope settled, ready to pick up. |
| `InProgress` | Being worked on now. |
| `Done` | Shipped and verified. |
| `Reserved` | ID claimed for planned work, not yet drafted. |
| `Deferred` | Real, deliberately postponed. Not dropped. |
| `Won't Do` | Decided against. Kept so the decision isn't relitigated. |

A PBI must reach `Agreed` before code is written for it. This mirrors the
🟢/🟡/🔴 markers in `design.md` — don't build against a 🟡 or 🔴.

Resolve IDs with `npm run pbi:next` rather than reading this table by eye — it scans
every branch, so a PBI filed on an unmerged branch still holds its number.

## Backlog

| ID | Title | Status | Notes |
| --- | --- | --- | --- |
| [001](./001/prd.md) | Font attribution and licensing | Done | AJ (Jao Kunheing) built the fonts free for Shan speakers. Attribution in `public/fonts/CREDITS.md`. |
| [002](./002/prd.md) | Apply the Shan font to Shan text | Done | Fallback stack `Google Sans → aj12 → aj00` in `--font-sans`. Verified in built CSS. |
| [003](./003/prd.md) | Dark mode palette | Won't Do | **Superseded by [011](./011/prd.md)** — the owner reversed the light-only call. Kept so the original decision stays legible. |
| [004](./004/prd.md) | Decide locale routing | Done | **Locale-prefixed URLs, Shan (`shn`) default.** Implemented by 006. |
| [005](./005/prd.md) | Moderation policy and code of conduct | Deferred | Revisit before public launch. |
| [006](./006/prd.md) | Locale-prefixed routing with next-intl | Done | `/shn` and `/en`, `/` → `/shn`. Implements 004. Should land before any auth or home-page routes. |
| [007](./007/prd.md) | Sitemap and robots.txt | Done | Neither file exists; nothing tells a crawler the routes exist. Indexability is the recruiting mechanism. |
| [008](./008/prd.md) | Design the 404 page | Done | Next's unstyled English default is replaced by a localized page. Verified and completed with verified Shan script. |
| [009](./009/prd.md) | Installable PWA (web manifest + icons) | Done | `app/manifest.ts` + install icons; **no service worker** (offline deferred). Icons are placeholder upscales of the 96px logo — real ≥512 art is an Open Question below. |
| [010](./010/prd.md) | Home page — Reddit-style feed (shell + mock data) | Done | Replaces the placeholder home with a **mobile-first** 3-region feed layout + post cards from **typed mock data**. Anonymous-readable. No DB/auth/voting — those are later PBIs; the card carries a vote *slot* only. |
| [011](./011/prd.md) | Dark mode | Done | Built light + dark (`.dark` block + `next-themes` + toggle), superseding [003](./003/prd.md). **Now superseded by [013](./013/prd.md)** — the owner reversed to dark-only and its toggle/`next-themes` were removed. Kept so the light+dark decision stays legible. |
| [012](./012/prd.md) | Command palette search (kbar) | Done | Makes the dead nav search live. **Navigation + mock feed only** — real full-text search needs the DB and the Myanmar-tokenisation decision. |
| [013](./013/prd.md) | Dark-only theme | Done | Supersedes [011](./011/prd.md) — the owner reversed light+dark to **dark only** for the developer aesthetic. Removes `next-themes`, the toggle, and the `DevConsoleFilter` workaround; the greyscale palette moves into `:root`. |
| [014](./014/prd.md) | Sign-in dialog (frontend only) | Done | The nav's "Sign in" now opens a dialog with Google + GitHub OAuth options. **UI only** — no Better Auth, no session, no DB; the two provider buttons are where wiring attaches. |
| [015](./015/prd.md) | Static informational pages — About, Terms, Privacy | Done | About/Terms/Privacy shipped on a shared static-page shell (merged `f5d69a2`). Footer/nav links now resolve; PBI-014's consent line links out. About is translated; Terms/Privacy are English-only by design (`ENGLISH_ONLY`). Relates to [014](./014/prd.md), [005](./005/prd.md), [007](./007/prd.md). |
| [019](./019/prd.md) | Feedback / issue dialog (frontend only) | Done | A dialog to submit a bug or feedback. **UI only** — the submit is the attach point for a later GitHub-issue route; nothing is sent yet. That future write path (server route + token) will need a **rate limit** and spam defense (`AGENTS.md`). Per the [014](./014/prd.md) frontend-only precedent. |
| [018](./018/prd.md) | Shareable developer profile card (dialog + QR + download) | Done | A **Share** button on a profile opens a dialog with a profile card carrying a **QR of the profile URL**, downloadable as a PNG. **No copy-link** (owner's call — the QR carries the URL). QR via `qrcode.react`. Follows [017](./017/prd.md). |
| [017](./017/prd.md) | Developers directory + profile pages (shell + mock data) | Done | The disabled "Developers" nav gets real routes: a `/developers` directory + `/u/[handle]` profiles, derived from the mock feed/comment authors so profiles show a member's real posts and author names everywhere become links. UI shell + mock only; identity-safety rules are load-bearing (pseudonymous, coarse/optional location, **never** email). No auth/edit/unlisted. Per the [010](./010/prd.md)/[016](./016/prd.md) precedent. |
| [016](./016/prd.md) | Post detail page (shell + mock data) | Done | Gives the feed's dead comment button (`post-card.tsx`) a destination — a single-post view with the full body + a mock comment thread. UI shell + typed mock data only, per the [010](./010/prd.md) precedent. Anonymous-readable. No DB/auth/voting/comment-submission. URL keys on a **slug**. |
| [020](./020/prd.md) | Projects surface — directory + detail (shell + mock data) | Done | Turns the disabled "Projects" nav into real routes: a `/projects` single-column list of feed-style cards (title/body/image) + `/projects/[slug]` detail carrying outbound links (GitHub, website/live URL, App Store, Play Store). Redesigns the provisional `project-card.tsx` from [017](./017/prd.md); reuses its mock `lib/projects.ts`. UI shell + mock only, per the [010](./010/prd.md)/[016](./016/prd.md) precedent. Anonymous-readable. No DB/auth; star count display-only. |
| [021](./021/prd.md) | Events surface — directory + detail (shell + mock data) | InProgress | Turns the disabled "Events" nav into real routes: an `/events` list of event cards ordered by start time (upcoming vs past) + `/events/[slug]` detail with host, local-rendered time, online/physical, and a Join link for online events. Reuses the provisional `event-card.tsx` + mock `lib/events.ts` from [017](./017/prd.md). UI shell + mock only, per the [010](./010/prd.md)/[016](./016/prd.md)/[020](./020/prd.md) precedent. Anonymous-readable. No DB/auth. **Timezone care** (Myanmar UTC+06:30) is load-bearing — store UTC, render local. |
| [022](./022/prd.md) | Create flow — post / project / event (shell + composer) | InProgress | One shared composer + design across all three content types, reached from the dead top-nav Create control. Body editor is a **Slack-style markdown toolbar** (lists / blockquote / inline + block code insert markdown) — deliberately not a heavy WYSIWYG lib, on the client-JS constraint. Collects each model's fields ([010](./010/prd.md)/[016](./016/prd.md), [020](./020/prd.md), [021](./021/prd.md) shapes); per-content language tag; event time stored UTC. **Frontend-only** — Publish persists nothing and is the attach point for a later rate-limited write endpoint; anonymous → sign-in gate ([014](./014/prd.md)). Per the [014](./014/prd.md)/[019](./019/prd.md) precedent. Editor weight + markdown rendering on read pages are open decisions for agree-time. |
| [029](./029/prd.md) | Better Auth — Google + GitHub sign-in, real sessions | Proposed | Replaces [028](./028/prd.md), removed on 2026-08-10. Auth is **frontend-only mock state** today: `mockCurrentUser` seeds every visitor as signed in, and `/admin` is **ungated and publicly reachable** — CoS 12 closes that. **Better Auth** is a library over the existing Supabase Postgres and Prisma, so PBI-027's database, region, and data layer are untouched. Its four tables (`user`/`session`/`account`/`verification`) go in **their own Postgres schema** (owner's call): `user.email` is required and cannot be removed, and `public` is what Supabase publishes over PostgREST — so the schema boundary restores what `auth.users` gave for free. `profiles` still has **no email column, ever**. Handle derivation, the identity rules, and the lazy-client-island rendering strategy carry over from 028 unchanged; `90c1c87` holds the deleted logic worth adapting. **Auth only** — every surface keeps its mock and **no write path ships**, all pending rate limiting. **Blocked on proving Prisma 7 + `@prisma/adapter-pg` works with Better Auth** (unresolved upstream discussion #6529) before this can be agreed. |
| [028](./028/prd.md) | Supabase Auth — Google + GitHub sign-in, real sessions | Won't Do | **Built, then removed on 2026-08-10** (commit `90c1c87` has the implementation) — the owner decided to change auth provider. The identity layer is frontend-only mock state again: `mockCurrentUser` in `lib/current-user.ts` seeds `CurrentUserProvider`, so every surface renders signed-in and `/admin` is **ungated**. The database (PBI-027) was kept; only auth was dropped. A replacement provider needs its own PBI, and the rules that outlived this one are in `AGENTS.md`. Original scope: replaces the `lib/viewer.ts` design preview with a real cookie session via **`@supabase/ssr`**, and creates a `profiles` row on first sign-in. Unblocks seven surfaces built inert against that seam — the sign-in dialog ([014](./014/prd.md)), account menu and `/settings` ([024](./024/prd.md)), `/admin` ([025](./025/prd.md)), the composer ([022](./022/prd.md)), notifications ([023](./023/prd.md)), and the profile owner menu. **Handle is derived from the provider** (owner's call): GitHub's `user_name`, which is already a public chosen login; Google has no username, so it falls back to a generated handle rather than slugging a real name or an email into a public URL. `display_name` is never auto-filled from OAuth. **Auth only** — every surface keeps its mock, and **no write path ships**: Save stays disabled, publish stays gated, moderation still persists nothing, all pending rate limiting. The regression to fear is a session read turning a public page dynamic; anonymous read access and static prerendering are conditions of satisfaction. |
| [027](./027/prd.md) | Database foundation — Supabase + Prisma + schema | Done | The first PBI that stores anything. **Supabase** for database, auth, and storage (Singapore), **Prisma 7** as the data layer — both reverse 🟢 decisions (Neon, Better Auth); supersedes recorded in `design.md`. Schema mirrors the mock shapes so each surface can switch over one at a time, and carries **no email column** — the OAuth email stays in `auth.users`. snake_case throughout, UUIDv7 keys, every FK indexed. **RLS enabled with no policies (deny by default)**: not the authorization model, but Supabase publishes `public` over PostgREST and Prisma migrations don't turn RLS on. Schema only — no auth wiring, no reads switched, no writes. |
| [026](./026/prd.md) | Share dialog for posts, projects, and events | InProgress | Gives the dead Share control on every card and detail page a dialog, via **`react-share`**. Networks are a locality choice — Facebook, Telegram, Viber, LINE first; X and LinkedIn for reach beyond. **Lazy-loaded** (the [012](./012/prd.md) kbar precedent): the button is on every feed card, so the library must stay out of the initial bundle for readers on mobile data. No share counts, and **no copy-link** — each button already carries the URL (owner's call, matching [018](./018/prd.md)). URLs are built server-side, since `siteUrl()` falls back to a server-only env var. |
| [025](./025/prd.md) | Admin surface — overview + reports queue (frontend only) | InProgress | Gives the `⋯` menu's **Report** a destination: an `/admin` route with a cold-start overview strip (member/post/project/event counts + recent joins) and a reports queue over posts, projects, and events, **filtered by type**. Gated on `viewer.moderator` from [024](./024/prd.md), so it is **invisible in production** and appears only in the `next dev` preview. Rows carry **Dismiss / Delete content / Ban author** with a confirm step, but **persist nothing** — the row clears in local state only, because the write path is blocked on [005](./005/prd.md) (moderation policy, Deferred) as well as auth and a rate limit. Member/content lists and comments deliberately excluded (owner's call). |
| [024](./024/prd.md) | Account menu + settings page (frontend only) | InProgress | Turns the last dead top-nav control into a dropdown on the shadcn `dropdown-menu` primitive, and adds `/settings` editing exactly the fields the public profile card renders (no email field, coarse location, Save disabled until auth + a rate limit). `lib/viewer.ts` models the signed-in visitor as a **design preview**: `getViewer()` returns `null` in production and under test, the mock only under `next dev`. **Frontend-only** — no session, no sign-out, nothing persisted; it is the seam Better Auth attaches to. Identity safety is load-bearing. Per the [014](./014/prd.md)/[022](./022/prd.md)/[023](./023/prd.md) precedent. |
| [023](./023/prd.md) | Notifications surface — dedicated page (shell + mock data) | InProgress | Turns the disabled top-nav bell into a live `/notifications` route: a list of mock notifications about interactions on **your** content — a comment or like on your post, a star on your project, a new follower, an event reminder. Reuses the `lib/datetime.ts` `en` helpers for times. **Frontend-only** — the list is mock (`lib/notifications.ts`); real per-user data needs Better Auth + the write features that generate events (likes/comments/follows), so it is **blocked on auth**. Thesis fit is community **retention/cold-start** (the return hook that keeps a small Shan community from drifting back to the Facebook group), not a generic engagement feature — **needs a `design.md` entry at agree-time**. Per the [010](./010/prd.md)/[016](./016/prd.md)/[020](./020/prd.md)/[021](./021/prd.md) shell+mock precedent. Anonymous-readable. No DB/auth. |

## Open questions — not yet PBIs

Known-open work. **File these with `create-pbi` when you actually want them built**,
not before. The reasoning behind each lives in `design.md`.

- **Replace the placeholder PWA icons.** PBI-009 ships `icon-192/512/maskable` upscaled
  from the 96×96 logo, so the home-screen icon is soft. Swap in real ≥512 (ideally
  vector) art — the same missing asset blocks a proper OG image and a 180 apple-touch
  icon. One good source resolves all three.
- **Subset the fonts to `.woff2`.** ~250 KB of unsubsetted `.ttf` ships today and the
  audience is on mobile data; `design.md` calls it the highest-leverage perf win.
  Consider dropping `aj00` — `aj12` supersedes its coverage.
- ~~**Better Auth with Google + GitHub OAuth.**~~ Now [029](./029/prd.md). Went to
  Supabase Auth ([028](./028/prd.md), built and removed), then back to Better Auth — the
  database stays on Supabase either way. See `design.md`.
- **Rate limiting on write endpoints.** Required by `AGENTS.md` before any write path
  ships — and with moderation deferred (005), it is currently the whole spam defense.
- **Real posts feed** (replaces PBI-010's mock `lib/feed.ts`). The interaction model is
  **decided — a single like, not voting** (`design.md`, PBI-016); making it *function*
  (and any ranking by likes) still needs the DB + auth + a rate limit.
- **Contributor onboarding** — `CONTRIBUTING.md`, issue templates, a `good first
  issue` path. Needed before inviting collaborators.
- **Image and file storage.** The vendor question is settled — **Supabase Storage**, and
  `profiles.avatar_path` already exists for it ([027](./027/prd.md)). What is still open
  is the work: a bucket, an upload path, and **client-side compression before upload**
  (`design.md`). Watch EXIF GPS stripping — location is coarse and optional by design, and
  photo metadata defeats that silently.
- **Search on Myanmar script.** Shan and Burmese are written without spaces between
  words, so Postgres's default tokenizer will segment them badly or not at all. Still
  open — [012](./012/prd.md) builds the palette surface but deliberately does **not**
  decide tokenisation.
- **A bold weight of A J Kunheing**, if one exists. Both fonts are Regular only, so
  all bold on Shan is faux-bold today.
- **Shan technical vocabulary** — does an existing effort exist to align a glossary
  with?
- **Community seeding** — an existing community to draw from, or cold-start from zero?

*(Resolved: the missing-glyph question — `aj12.ttf` carries SHAN THA, the Council
tones, and SHAN RR. See `design.md`.)*
