# PBI-023 — Notifications surface — dedicated page (shell + mock data, frontend only)

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-07-25 |
| **Depends on** | Better Auth (Open Questions) for a real per-user feed; the write features that generate events — likes/comments (PBI-016), stars (PBI-020), follows (PBI-017/018), events (PBI-021) — for real notifications; PBI-014 (sign-in dialog) as the auth gate |
| **Relates to** | PBI-022 (frontend-only shell precedent, and the top-nav controls it made live); PBI-010/016 (Post + like), PBI-020 (Projects + star), PBI-021 (Events), PBI-017/018 (Developers + follow) — the interactions notified about |

## Problem

The top-nav bell renders but is **deliberately disabled** — a dead affordance, exactly
like Create was before PBI-022:

```
components/shell/top-nav.tsx:51-58
<button type="button" disabled aria-label={t("notifications")} …>
  <Bell className="size-5" />
</button>
```

The comment above it records why: "Notifications and account stay disabled — they need
auth to mean anything." That is true of the *real* feed, but it is the same gap PBI-022
closed for Create: the product shows a control for a capability that goes nowhere.

There is no notifications model, no route, and no `design.md` entry for the feature. The
interactions a notification would announce, however, all already exist as decided
surfaces with typed mock data:

- **A like on your post** — `Post` (`lib/feed.ts`), like is 🟢 decided (PBI-016).
- **A comment on your post** — `Comment` (`lib/comments.ts`).
- **A star on your project** — `Project` (`lib/projects.ts`).
- **A new follower** — follow controls on the developer profile (PBI-017/018).
- **An event reminder** — `EventItem` (`lib/events.ts`), times stored UTC.

Surfacing a notification is a **read** of per-user state, and that state is produced by
**writes** (someone else likes/comments/stars/follows) — none of which function yet,
because writes need Better Auth and a rate limit. So, like PBI-014 / PBI-019 / PBI-022,
this is a **frontend-only** shell: a `/notifications` page rendering a typed mock list,
with real data attaching once auth and the write paths land.

## Why it matters

The honest scope test (`design.md`): *why would someone use this instead of the Facebook
group or Discord they already have?* Notifications are not, by themselves, a
language-or-locality feature — global platforms do them well, and "nicer notifications"
is the unwinnable fight `design.md` warns against. This PBI is justified on a **different**
axis the thesis does support: **community survival for a cold-start audience.**

- A small Shan-speaking community has to give people a **reason to come back**, or they
  drift back to the Facebook group and the network dies of neglect. `design.md`'s
  *Seeding* concern is exactly this cold-start risk.
- The return hook is *"someone engaged with your Shan-language work"* — a comment or
  like on your post, a star on your project, a new follower. That is retention plumbing
  for **this** community's content, not a generic feed. It is the connective tissue
  between the already-decided community features (like, comment, star, follow, events),
  not a new product pillar.

Because the argument is retention-for-locality rather than the core thesis, it **warrants
an explicit `design.md` entry** before build (a 🟡→🟢 decision), so the justification is
recorded and not laundered through the backlog.

Meanwhile the bell is a visible dead control, and every notification line is Shan-capable
text — so the surface is bound by the same no-faux-bold / AJ-font rules as the rest of the
UI.

## Approach (proposed — settle at agree-time)

- **A dedicated `/notifications` route** under `app/[locale]/`, matching how `/projects`
  and `/events` are structured (PBI-020/021): Server-Component-first, anonymous-readable,
  statically prerenderable, with `setRequestLocale(locale)` and its own `alternates`
  metadata.
- **A typed mock module `lib/notifications.ts`** — a `Notification` discriminated union
  over the interaction kinds above (`comment` / `like` / `star` / `follow` /
  `event-reminder`), each carrying the actor handle, the target (post/project/event
  slug + title), an `unread` flag, and `createdAtISO`. Shaped so a real per-user query
  can replace the mock without touching the page.
- **Times via the `en` helpers in `lib/datetime.ts`** (`relativeTimeEn` / `formatDateEn`),
  so the list renders identically server and client — the same hydration-safe path the
  cards now use.
- **Frontend-only:** the list is mock and read-only. No "mark as read", no persistence —
  those are writes and need auth + a rate limit. The unread indicator is display-only.
- **The bell stops being display-only** and links to `/notifications` (a plain `Link`,
  no `disabled`). It must **not** assert a logged-in identity or a live unread count from
  a session — any unread badge is derived from the mock, mirroring how Create went live
  without asserting identity (PBI-022, `AGENTS.md` identity-safety rule).

## Conditions of Satisfaction

1. A `/notifications` page exists under `app/[locale]/`, reachable from the top-nav bell;
   the bell is no longer a disabled/dead control.
2. The page renders a list of notifications from typed mock data (`lib/notifications.ts`),
   covering at least: a comment on your post, a like on your post, a star on your project,
   a new follower, and an event reminder.
3. Each row identifies the actor (pseudonymous handle), what happened, the target it links
   to (post/project/event/profile), and a relative time rendered via the `lib/datetime.ts`
   `en` helpers — no locale-dependent date that could drift on hydration.
4. The page **renders with no session** (anonymous-readable) and stays statically
   prerenderable, like `/projects` and `/events`; it sets its own locale and `alternates`.
5. The surface is **frontend-only**: nothing is persisted, there is no working
   "mark read", and neither the page nor the bell asserts a logged-in identity or a
   session-derived presence (identity-safety rule).
6. House rules hold: Server-Component-first with `"use client"` pushed to the smallest
   leaf (if any); no faux-bold on Shan-capable text; semantic tokens only; `rounded-lg`
   only.
7. UI strings live in `messages/en.json` + `shn.json` with key parity and no ICU
   placeholder drift; Shan is translated or flagged per the repo's Shan-copy policy.
8. The dependency on Better Auth + the write features that generate notifications is
   recorded, and a **`design.md` entry for notifications is added** as part of moving this
   to `Agreed` (so the retention justification is on the record).

## Notes

- **Blocked on auth for real data.** Notifications are inherently per-user; a real feed
  needs Better Auth *and* the write paths (like/comment/star/follow) that produce the
  events. This PBI is the UI shell only — the mock module and the page are the seams the
  later work attaches to, per the PBI-022 precedent.
- **Needs a `design.md` decision.** Unlike the read surfaces (which flow directly from the
  🟢 Product section), notifications are not currently in `design.md`. The scope argument
  is retention/cold-start (above); record it as a decision before building, or the feature
  is being justified only in its own PRD.
- **Reuse before create** (`AGENTS.md` ladder): build rows from existing primitives and
  the card/list patterns in `components/` (the feed/event/project cards, `HandleLink`,
  the initials avatar). A notification row is close to a compact card — extend, don't
  fork.
- **No new notification *types* beyond the mock set** without a product reason — the set
  is defined by the interactions that already exist, not by what a generic platform sends.

## Out of scope

- Any persistence, database, session, real-time push, or write endpoint. **"Mark all as
  read" is in scope only as a frontend-only clear** — it hides the unread dots in local
  state and persists nothing (reloading restores them); the *persistent* per-user
  read-state, and email/push delivery, stay out until auth + a rate limit exist.
- Notification **preferences / settings** (per-type opt-out) — a later concern once real
  notifications exist.
- A bell **dropdown panel** — this PBI is the dedicated page only (the owner chose the
  page over an inline panel); a panel can be a later, separate PBI if wanted.
- The account/profile menu next to the bell, which stays display-only until auth.
