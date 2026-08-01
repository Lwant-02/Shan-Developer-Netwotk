# PBI-025 — Admin surface — overview + reports queue (frontend only)

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-08-01 |
| **Depends on** | PBI-024 (`lib/viewer.ts`) for the gate; Better Auth (Open Questions) for a real admin identity; PBI-005 (moderation policy, **Deferred**) before any action here can enforce anything |
| **Relates to** | PBI-010 (posts), PBI-020 (projects), PBI-021 (events) — the three surfaces whose `⋯` menu already offers **Report** |

## Problem

**Report already ships, and it goes nowhere.** The `⋯` menu on posts, projects, and
events all offer it (`Post.report`, `Projects.report`, `Events.report` in `messages/`),
and nothing is on the other end. That is the same dead-affordance gap PBI-022, PBI-023,
and PBI-024 closed for Create, the bell, and the account control — except this one is
worse, because a report is a request for help. A member who reports something is told,
implicitly, that someone will look. Nobody can.

Separately, the owner has no view of the community as a whole. Every existing surface is
built for a *visitor*: the feed ranks posts, the directory browses members. Nothing
answers the operator's question at cold start — is anything happening here at all?
`design.md`'s *Seeding* concern is exactly that a small Shan community either reaches
critical mass or drifts back to the Facebook group.

## Why it matters

This is **operator tooling, not a product feature** — no member ever sees it, so it does
not have to justify itself against the language-and-locality thesis the way a
member-facing surface does. What it must not do is *undermine* that thesis.

The report queue is the honest half of a promise the product already makes. The overview
is the cold-start instrument: counts and recent joins, so "is anyone here?" has an answer
that does not require browsing four public pages.

Identity safety still binds. A report names **who reported** and **whose content** —
both pseudonymous handles, and nothing more. `design.md` and `AGENTS.md` make
pseudonymity a safety requirement for this region, so no email appears here (none exists
in the data model, and this PBI does not add one) and no identity fact is shown that the
public profile does not already show.

## Approach

- **Gated on `viewer.moderator`.** PBI-024's `getViewer()` returns `null` in production
  and under test, so the admin nav entry and the page are **invisible on the live site**
  and appear only in the `next dev` preview. There is no auth yet; when Better Auth
  lands the flag becomes a real role check.
- **The nav entry sits with Terms / Privacy / About** in the left nav's secondary group —
  not with the content sections. It is not somewhere members browse, and when auth
  arrives it is hidden for everyone but the admin.
- **A single `/admin` route** carrying two things:
  - **An overview strip** — member, post, project, and event counts, plus recent joins.
  - **A reports queue** over the three reportable types, **filtered by type**: All /
    Feeds / Projects / Events, each with its count. Every row shows what was reported
    (linked to the content), who reported it, the reason, and when.
- **A typed mock `lib/reports.ts`** — a `Report` over `post | project | event`, carrying
  the reporter handle, a reason from a fixed set, the target slug and title, and
  `createdAtISO`. Shaped so a real query replaces the module without touching the page.
  Newest first; the type filter is the only control, deliberately.
- **Reuse over new components** (`AGENTS.md` ladder): the filter is `ProfileTabs`,
  generalised to `components/content/section-tabs.tsx` as `SectionTabs` and shared
  rather than copied — it already models exactly *label + count + panel*. No new tab or
  filter primitive.
- **Per-row moderation actions** in a `⋯` menu matching `post-menu.tsx`: **Dismiss
  report**, **Delete content**, **Ban author**. The two destructive ones **confirm
  first** — deleting someone's work and blocking a member are not mis-click actions.
  - **Nothing is persisted.** Resolving removes the row from the queue in local state and
    that is all, the same frontend-only shape as PBI-023's "mark all as read". The
    confirm dialog and a banner both say so in as many words, because the failure mode
    here is an admin walking away believing a takedown happened.
  - This is a **UI design ahead of its policy**: PBI-005 is `Deferred`, so the rules these
    actions would enforce do not exist yet. Building the surface is fine; wiring it before
    the policy is agreed is not.

## Conditions of Satisfaction

1. An `/admin` route exists under `app/[locale]/`, reachable from a left-nav entry in the
   secondary group beside Terms / Privacy / About.
2. Both the nav entry and the page content are **absent for a visitor with no moderator
   viewer** — verified against the prerendered production HTML, not just the component.
3. The page shows an overview strip with member, post, project, and event counts, and
   recent joins.
4. The page lists reports from typed mock data (`lib/reports.ts`) covering all three
   reportable types, each row linking to the reported content and naming the reporter
   handle, the reason, and the time.
5. The queue can be **filtered by type** — All / Feeds / Projects / Events — with counts.
6. No email appears anywhere on the surface, and no identity fact is shown that the
   public profile does not already show.
7. Each row offers **Dismiss / Delete content / Ban author**; the two destructive actions
   confirm before acting, and the confirmation states that nothing is stored.
8. Acting on a report **persists nothing** — the row clears in local state only, and the
   surface says so and says a reload restores it.
9. `"use client"` is scoped to the queue and its action leaves; the page and the overview
   stay Server Components, and the reports are read on the server and passed in.
10. House rules hold: no faux-bold on Shan-capable text, semantic tokens only,
    `rounded-lg` only, every class list through `cn()`.
11. UI strings live in `messages/en.json` + `shn.json` with key parity and no ICU
    placeholder drift.
12. The route is `noindex` and absent from `app/sitemap.ts`.

## Notes

- **Frontend-only**, per the PBI-014/019/022/023/024 precedent. Reports are mock; a real
  queue needs auth (to know who reported) and the write path that files a report — which
  itself needs a rate limit, since an unlimited report button is a harassment vector.
- **The actions are designed, not wired — and that gap is the risk.** A moderation
  control that looks live and does nothing is worse than no control, so the confirm
  dialog and the banner state it outright. Do not wire these to a real endpoint before
  PBI-005 settles the policy they enforce.
- **The `⋯` Report control stays inert in this PBI.** Filing a report is a write; this
  PBI builds only the queue that will receive them.

## Out of scope

- **Making the moderation actions real.** The UI exists; the write path behind it is
  blocked on PBI-005 as well as auth and a rate limit.
- **A moderation action log** — what was actioned, by whom, and why. It only has content
  once the actions persist, but it is the natural next PBI alongside PBI-005.
- **Wiring the `⋯` Report control** to actually file a report (a write; needs auth and a
  rate limit).
- **Member / post / project / event lists.** Considered and dropped by the owner: the
  overview strip already answers the "how much is there" question, and the public pages
  already browse the content.
- **Comments**, deliberately excluded by the owner — not listed, not reportable here.
- **Shan copy review queue** — thesis-aligned, but translation review is build-time today
  (`npm run i18n:prompt`); a runtime page needs copy in the DB first.
- **Rate-limit / spam signals** — will matter once write paths exist; nothing to show yet.
- **Real roles or permissions.** `viewer.moderator` is a preview flag, not an
  authorization system.
