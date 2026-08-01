# PBI-024 — Tasks

Breakdown of [PBI-024](./prd.md). Follows the PBI-022 (`create-menu.tsx`) / PBI-023
pattern for making a dead top-nav control live on frontend-only terms.

| # | Task | Status |
| --- | --- | --- |
| 1 | Give `SignInDialog` optional controlled `open` / `onOpenChange` and make `children` optional, so a menu item can open it (a `DialogTrigger` cannot survive inside the menu popup). Existing uncontrolled callers unchanged | Done |
| 2 | Add `components/shell/account-menu.tsx` — a `"use client"` leaf using the shadcn `dropdown-menu`: signed-out header, **Sign in** item wired to the dialog, and profile/settings/saved disabled with the `soon` cue | Done |
| 3 | Replace the disabled account button in `top-nav.tsx` with `<AccountMenu />`; update the comment that records why the control was dead | Done |
| 4 | Add the `Account` message namespace — English in `en.json`, Shan in `shn.json` with key parity (i18n hook fills Shan) | Done |
| 5 | Add `__tests__/account-menu.test.tsx` — renders for an anonymous visitor, opens on activation, exposes Sign in, and asserts no session-derived identity | Done |
| 7 | Add `lib/viewer.ts` — a `Viewer` type (handle, display name, role, provider, optional `avatarUrl`), `PROVIDER` presentation, a mock viewer, and a `getViewer()` gated to `next dev` / `NEXT_PUBLIC_PREVIEW_VIEWER` so production and tests stay signed-out | Done |
| 8 | Render the **signed-in** branch — initials avatar, display name, `@handle`, sign-in provider, real link to `/developers/[handle]`, and `soon`-cued settings/saved/sign out. No email, ever | Done |
| 9 | Drop the nav "Sign in" button and the right rail's "Sign in to post" card when a viewer is present, so the shell never shows both states at once | Done |
| 10 | Extend the tests to the signed-in branch, and verify the **prerendered production HTML** renders the signed-out menu | Done |
| 11 | Drop **Saved** from the menu (nothing in the product saves anything yet) and point **Settings** at a real page from both states | Done |
| 12 | Extract `Field` / `UrlInput` to `components/form/field.tsx`, shared with the PBI-022 composer instead of copied | Done |
| 13 | Add `/settings` — a form over exactly the public-profile fields, prefilled, **no email field**, Save disabled with a reason, sign-in gate for anonymous visitors, `noindex` and out of the sitemap | Done |
| 6 | Verify against CoS: `lint`, `build`, `test`, run the app logged out; close out PBI (statuses, PR) | Done |

## Notes

- **Frontend-only.** No session, no sign-out, no persistence. The menu is the seam Better
  Auth attaches to later.
- **Identity safety is the load-bearing rule:** the menu may state that the visitor is
  *not* signed in and nothing more — no name, photo, handle, presence dot, or count.
- **Reuse before create:** `create-menu.tsx` is the shape; the `soon` cue comes from
  `nav-item.tsx`. No new `components/ui/` primitive.
