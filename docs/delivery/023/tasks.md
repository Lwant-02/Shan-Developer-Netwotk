# PBI-023 — Tasks

Breakdown of [PBI-023](./prd.md). Follows the read-surface precedent (PBI-020/021) and
the PBI-022 frontend-only / made-live-bell pattern.

| # | Task | Status |
| --- | --- | --- |
| 1 | Add `lib/notifications.ts` — a `Notification` discriminated union (`comment` / `like` / `star` / `follow` / `event-reminder`) with actor handle, target (slug + title + href), `unread`, `createdAtISO`; a `listNotifications()` helper and mock rows covering every kind | Done |
| 2 | Add `NotificationRow` component — initials avatar + `HandleLink` + action text + target link + relative time via `lib/datetime.ts` `en` helpers; an unread marker (display-only). Extend existing card/list patterns, don't fork | Done |
| 3 | Add `/notifications` route (`app/[locale]/notifications/page.tsx`) inside `AppShell` — header + list + empty state + `setRequestLocale` + own `generateMetadata`/`alternates`; anonymous-readable, statically prerenderable | Done |
| 4 | Make the top-nav bell live — route to `/notifications` (plain `Link`, no `disabled`); assert no logged-in identity/session; update the `top-nav.tsx` comment | Done |
| 5 | Add `Notifications` message namespace — English in `en.json`, Shan in `shn.json` with key parity (i18n hook fills Shan) | Done |
| 6 | Add `__tests__/notifications.test.tsx` — surface renders for an anonymous visitor; Shan-block script survives; a target link is present | Done |
| 8 | Add `NotificationList` (`"use client"` leaf) — a **frontend-only** "Mark all as read" that clears the unread dots in local state (persists nothing), and row spacing (`gap-2`) | Done |
| 7 | Verify against CoS: `lint`, `build`, `test`, run app logged out; close out PBI (statuses, PR) | Done |

## Notes

- **Frontend-only.** `lib/notifications.ts` is mock; the page reads it directly so a real
  per-user query can replace the module without touching the page. No "mark as read".
- **Times** use `relativeTimeEn` / `formatDateEn` (the hydration-safe `en` path added with
  the PBI-022 fix), so the list renders identically server and client.
- **Identity safety:** the bell and page assert no session — the unread marker is derived
  from the mock, mirroring how Create went live (PBI-022) without asserting identity.
- Notification kinds are fixed by the interactions that already exist (like/comment/star/
  follow/event) — no generic-platform types.
