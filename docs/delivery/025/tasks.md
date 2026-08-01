# PBI-025 — Tasks

Breakdown of [PBI-025](./prd.md). Follows the PBI-024 viewer-gate pattern and the
PBI-010/020/021/023 shell+mock precedent.

| # | Task | Status |
| --- | --- | --- |
| 1 | Add `moderator` to `Viewer` (and the mock viewer) in `lib/viewer.ts` — the preview gate, `null` in production and under test | Done |
| 2 | Add `lib/reports.ts` — a `Report` over `post \| project \| event` with reporter handle, reason, target slug/title/href, and `createdAtISO`; a `listReports()` helper, newest first, and mock rows covering every type and reason | Done |
| 3 | Generalise `ProfileTabs` to `components/content/section-tabs.tsx` as `SectionTabs`, shared by the profile page and the admin filter rather than copied | Done |
| 4 | Add the left-nav entry in the **secondary** group beside Terms / Privacy / About, rendered only for a moderator viewer | Done |
| 5 | Add `components/admin/admin-overview.tsx` — member / post / project / event counts and recent joins; Server Component | Done |
| 6 | Add `components/admin/report-row.tsx` — reported content link, reporter handle, reason, relative time via the `lib/datetime.ts` `en` helpers; Server Component, read-only | Done |
| 7 | Add `/admin` route (`app/[locale]/admin/page.tsx`) inside `AppShell` — overview + the type-filtered queue, `setRequestLocale`, `noindex`, out of the sitemap; not-found for a non-moderator | Done |
| 8 | Add the `Admin` message namespace — English in `en.json`, Shan in `shn.json` with key parity | Done |
| 9 | Add `__tests__/admin.test.tsx` — the queue renders and links to reported content, no email appears, the surface offers no moderation action, and the type filter narrows the list | Done |
| 11 | Add `components/admin/report-actions.tsx` — a `⋯` menu (Dismiss / Delete content / Ban author) matching `post-menu.tsx`, with a confirm dialog on the destructive two that states nothing is stored | Done |
| 12 | Make `ReportQueue` a client leaf holding the resolved set — acting clears the row locally only, with a banner saying it was not saved (the PBI-023 pattern); reports are read on the server and passed in | Done |
| 10 | Verify against CoS: `lint`, `build`, `test`, and check the **prerendered production HTML** carries no admin nav entry or page content; close out PBI (statuses, PR) | Done |

## Notes

- **Read-only.** No hide/remove/suspend/dismiss — those need PBI-005 (moderation policy,
  `Deferred`) as well as auth and a rate limit.
- **Reuse before create:** `SectionTabs` is an extraction, not a new primitive, and the
  times reuse `relativeTimeEn` (never `useFormatter` — the PBI-023 hydration rule).
- **Identity safety:** reports name two pseudonymous handles and nothing else. No email
  anywhere, and no identity fact the public profile does not already show.
