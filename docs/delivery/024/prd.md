# PBI-024 — Account menu in the top nav (frontend only)

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-08-01 |
| **Depends on** | Better Auth (Open Questions) for a real session, an identity to show, and the destinations the menu points at; PBI-014 (sign-in dialog) as the auth gate |
| **Relates to** | PBI-022 (Create control), PBI-023 (bell) — the two sibling top-nav controls made live on the same frontend-only terms |

## Problem

Three controls sit at the right of the top nav. Two of them now work — Create opens a
menu to the composers (PBI-022), the bell links to `/notifications` (PBI-023). The third
is still dead:

```
components/shell/top-nav.tsx:59-68
<button type="button" disabled aria-label={t("account")} …>
  <span …><User className="size-4" /></span>
</button>
```

It is a `disabled` button with a generic person icon and no menu behind it. A visitor
who clicks it gets nothing, and there is no way to discover what an account on this
network is *for* — the only sign-in affordance is a separate button beside it, and that
button is hidden from `xl` where the right rail takes over. On a phone, the account icon
is the most account-looking thing on the screen and it does nothing.

This is the same dead-affordance gap PBI-022 and PBI-023 closed for their controls.

## Why it matters

Sign-in is the **only gate** in this product (`AGENTS.md`), which makes the account
control the entire visible surface of "what happens if I join". Anonymous read access is
deliberate and the recruiting mechanism — so the account menu's job is not to manage a
session (there isn't one) but to make the *offer* legible at the moment someone reaches
for it, and to be honest that they are signed out.

The constraint that shapes the whole design: **it must never assert a logged-in identity
or presence** — no name, no photo, no presence dot, no session-derived anything
(`AGENTS.md` identity-safety rule, inherited from PBI-022/023). Pseudonymity is a
supported case in this region and a leaky account affordance is a safety problem, not a
polish problem.

## Approach

- **A new `components/shell/account-menu.tsx`**, mirroring `create-menu.tsx`: a
  `"use client"` leaf whose only reason for the directive is the dropdown. The top nav
  stays a Server Component.
- **The shadcn `dropdown-menu` primitive** (already in `components/ui/`, Base UI-shaped
  — not Radix). No new primitive: the ladder in `AGENTS.md` stops at rung 1/2.
- **Both states, driven by `Viewer | null`.** A new `lib/viewer.ts` models the signed-in
  visitor — *who am I*, as against `Developer`'s *who is this person*. `getViewer()`
  returns `null` in production and under test, and the mock viewer only under `next dev`
  (or with `NEXT_PUBLIC_PREVIEW_VIEWER=1` on a preview deploy). **What the live site
  ships is the signed-out menu**; the signed-in branch is a reviewable design, not a
  session. Better Auth replaces the body of `getViewer()` and nothing above it changes.
- **Contents, signed out:**
  - A header block stating plainly that the visitor is **not signed in**, with one line
    on what signing in gets them. This asserts the *absence* of a session, which is the
    one identity claim that is always safe to make.
  - **Sign in** — opens the existing `SignInDialog` (PBI-014). The one live action.
  - **Your profile**, disabled with the same `soon` cue the left nav uses for unbuilt
    routes — there is no *your* profile without a session — and **Settings**, which
    links out regardless, since the page handles a visitor with no account.
- **Contents, signed in:** display name, `@handle`, and **which OAuth provider the
  account signed in through** (mark + label) — the last so an account reachable by two
  sign-in routes is unambiguous. The **OAuth email is never shown**, to its owner or
  anyone else. **Your profile** links to the existing `/developers/[handle]` route
  (PBI-017), **Settings** to `/settings`; Sign out keeps the `soon` cue until auth
  exists. There is **no "Saved"** item — nothing in the product saves anything yet, so
  it would be a menu row promising a feature that has not been decided.
- **A `/settings` page** editing exactly the fields the public profile card renders
  (`Developer`: display name, handle, role, bio, coarse location, links) — so what you
  change is precisely what other members see, and the form cannot become a second,
  richer identity store. Prefilled from the profile. **No email field**, deliberately:
  a settings form is the most likely place for one to creep in.
  - **Save is disabled**, with a line saying why. Saving is a write over identity data,
    so it needs Better Auth *and* a rate limit; a live-looking button that silently
    discards edits is worse than an honest disabled one.
  - **Anonymous visitors get the sign-in gate, not a form** — there is nothing to
    configure without an account. This is not a public read surface, so gating it does
    not touch the anonymous-read rule; it is `noindex` and absent from the sitemap.
- **`Field` / `UrlInput` move to `components/form/field.tsx`**, shared with the PBI-022
  composer rather than copied. Importing the composer module instead would drag the
  markdown editor into the settings bundle.
- **Avatars are initials**, matching every other avatar in the app
  (`developer-card.tsx`: "never a photo"). `Viewer.avatarUrl` is typed and rendered when
  set, but nothing sets it — image storage is an unresolved Open Question, so there is
  no photo to show yet.
- **The nav's "Sign in" button is dropped when there is a viewer** — a sign-in prompt
  sitting beside a signed-in avatar is exactly the contradiction the identity rule
  exists to prevent. The **right rail's "Sign in to post" card stays in both states**
  (owner's call): it is a welcome card aimed at newcomers, not a session indicator, and
  it is far enough from the avatar not to read as a contradiction.
- **Opening the dialog from a menu item** needs `SignInDialog` to accept optional
  controlled `open` / `onOpenChange`, because a `DialogTrigger` cannot live inside the
  menu popup (the menu unmounts it on close). The existing uncontrolled
  trigger-as-`children` API is unchanged for the nav button and the right rail.
- **The trigger keeps its current look** — the generic `User` icon in a muted circle, at
  the same `size-9` as its siblings — and gains a `chevron`-free, icon-only affordance so
  the nav's horizontal budget on mobile is untouched.

## Conditions of Satisfaction

1. The top-nav account control is no longer `disabled`; clicking or keyboard-activating
   it opens a dropdown menu.
2. The menu is built from the existing shadcn `dropdown-menu` primitive — no
   hand-written menu, no new component in `components/ui/`.
3. The menu contains a **Sign in** action that opens the PBI-014 sign-in dialog, and the
   dialog's consent gate and provider buttons behave exactly as before.
4. **What production renders is the signed-out menu**: it states that the visitor is
   **not signed in** and shows no name, photo, handle, presence dot, or count. The
   prerendered HTML is checked for this, not just the component.
5. The **signed-in** branch renders display name, `@handle`, the sign-in provider, and a
   working link to the viewer's own profile — and **never an email**.
6. Unbuilt destinations (sign out, and profile while signed out) appear **disabled with
   a `soon` cue** rather than as links that 404, matching the left-nav convention.
   Settings links to a real page from both states.
7. With a viewer present, the nav's "Sign in" button is gone, so a sign-in prompt never
   sits beside a signed-in avatar.
8. The page stays anonymous-readable and statically prerenderable; `"use client"` is on
   the menu leaf only, and `TopNav` remains a Server Component.
9. House rules hold: no faux-bold on Shan-capable text, semantic tokens only,
   `rounded-lg` only, every class list through `cn()`.
10. UI strings live in `messages/en.json` + `shn.json` with key parity and no ICU
    placeholder drift; Shan is translated per the repo's Shan-copy policy.
11. The menu is keyboard-navigable and the trigger keeps an accessible name.

## Notes

- **Frontend-only, on the PBI-014/019/022/023 precedent.** There is no session to read
  and nothing to persist. When Better Auth lands, `getViewer()` is the seam: it starts
  returning a real session, the disabled items become links, and Sign out is wired.
- **The signed-in preview is dev-only by design.** `getViewer()` returns `null` under
  test as well as in production — deliberately, since otherwise every "renders for an
  anonymous visitor" test would quietly be asserting against a signed-in shell.
- **Reuse before create.** `create-menu.tsx` is the shape to follow; the `soon` cue and
  its styling come from `nav-item.tsx`; the initials avatar matches
  `developer-card.tsx`.
- **Sign-in stays reachable without the menu** for anonymous visitors — the nav button
  and right rail card are unchanged in that state. Burying the only gate one level
  deeper would cost conversions.
- **No photo until image storage exists.** `Viewer.avatarUrl` is typed and rendered when
  set, but the whole app is initials-only today; the missing piece is the storage Open
  Question, not this menu.

## Out of scope

- Better Auth, sessions, a working sign-out, and any real settings/saved destination.
- A **settings page**, and **profile editing** — both are writes over identity data, so
  they need auth *and* a rate limit, and profile editing needs the field-level identity
  rules (coarse location, no email) settled. Their own PBIs.
- **Avatar upload**, which is blocked on the image-storage Open Question (and on EXIF
  GPS stripping, since location is coarse by design).
- Moving the locale switcher into the menu — considered and left alone; the SHN/EN
  toggle stays a first-class nav control.
- Any change to the sign-in dialog's content, providers, or consent copy.
