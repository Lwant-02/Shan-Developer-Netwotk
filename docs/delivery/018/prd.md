# PBI-018 — Shareable developer profile card (dialog + QR + download)

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-22 |
| **Completed** | 2026-07-22 |
| **Depends on** | PBI-017 (developer profiles, Done) |
| **Relates to** | PBI-014 (sign-in dialog — the Dialog primitive it reuses) |

> **Closed.** A **Share** control on `/developers/[handle]` opens a dialog with a profile
> card — initials avatar, name, role, optional coarse location, site branding, and a QR of
> the absolute profile URL — downloadable as `sdn-<handle>.png` via an off-screen canvas.
> **No copy-link or raw URL** (owner's call). QR from `qrcode.react@^4.2.0`; the whole
> feature is one `"use client"` leaf, so the profile page stays a Server Component and the
> route stays SSG. `lint`/`build`/`test` (37) pass; verified logged out.
>
> **Scope additions (owner, during review).** The card was enriched — brand rule, wrapped
> bio, a `location · joined` meta line, and an activity stat row (posts/projects/events) —
> and a **`joinedAtISO`** field was added to `Developer`, rendered as **month + year only**
> on both the profile header and the card (an exact join date is a correlation handle, so
> coarse matches the house style for identity). Counts reach the client dialog as a `stats`
> prop so the mock data modules stay out of the client bundle.
>
> **Caveat:** the **PNG download and an actual QR scan are browser-only** — jsdom has no
> canvas rasterisation and no camera, so those need the owner's browser. All four new Shan
> strings were translated and reviewed before the commit, so no `TODO(shn)` ships. As with
> PBI-010/016/017, "Done" = merged + verified (Vercel unlinked).

## Problem

PBI-017 shipped public, indexable profiles at `/developers/[handle]`, but there is no way
to *share* one. The only mechanism today is copying the URL out of the address bar —
`components/developers/profile-header.tsx` has no share affordance at all.

That is a poor fit for how this audience actually shares. The community's links move
through messaging apps — Telegram and LINE are already first-class enough that members
list them among their profile links — and a lot of connecting happens in person, at
meetups and sessions like the ones members host. A URL you have to type is friction in
both places; a **scannable code** and a **saveable image** are not.

## Why it matters

Public reach is the recruiting mechanism for this project — that is why profiles render
without a session and stay indexable. A profile nobody can pass on doesn't recruit. A
card that a member can drop into a Telegram or LINE group, or show on a phone screen at
a meetup, turns a static page into something portable, without needing an account on
either end.

It is also cheap: profiles are already public, so a share card exposes nothing new. It
reuses the existing `Dialog`, the profile data, and the identity-safety rules already in
force.

## Scope

A share affordance on a developer profile that produces a downloadable card carrying a QR
code to that profile.

**In scope:**

- A **Share** control on `/developers/[handle]`.
- A **dialog** (reusing the existing `Dialog` primitive) showing a **profile card preview**:
  initials avatar, display name / handle, role, optional coarse location, site branding,
  and a **QR encoding the absolute profile URL**.
- **Download the card as a PNG**, named for the handle (e.g. `sdn-tai_builds.png`).
- Works **fully logged out** — sharing needs no account, like reading.
- **Bilingual chrome** (share / download labels), Shan via the usual hand-off.

**Out of scope — deliberately:**

- **A copy-link field or a visible URL** — the owner's call: the QR already carries the
  URL, so the dialog stays the card + download.
- The **Web Share API** and share-to-platform buttons (Telegram/LINE/Facebook deep links).
- **Server-side image generation** (`next/og`) — this is a user-triggered download, not a
  link-preview image. The missing OG image remains a separate open item.
- Sharing **posts, projects, or events** — profiles only for now. (The post card's Share
  button stays display-only.)
- Customising the card (themes, colours, layout options).
- The **Project/Event card visual redesign** — a separate PBI.

## Conditions of Satisfaction

1. A **Share** control on `/developers/[handle]` opens a dialog, and it works **fully
   logged out** (no session, nothing gated).
2. The dialog shows a **card preview** with the member's public details — initials avatar,
   name / handle, role, coarse location when present — plus site branding.
3. The card carries a **QR encoding the absolute profile URL**, and scanning it resolves to
   that member's profile.
4. A **Download** control saves the card as a **PNG** named for the handle. The downloaded
   image contains the same content as the preview, including the QR.
5. **Identity safety:** the card shows nothing that isn't already public on the profile —
   **no email**, no precise location (coarse only, and omitted when the member has none),
   initials-only avatar, no presence/verified indicator.
6. **No copy-link field or raw URL text** in the dialog.
7. **Server-Component-first:** `"use client"` is confined to the share dialog leaf; the
   profile page and `ProfileHeader` stay Server Components.
8. **Monochrome, `rounded-lg` only, no `font-bold`** (names/roles can be Shan); semantic
   tokens; reuses `Dialog` and `buttonVariants` rather than new primitives.
9. **Mobile-first:** the dialog and card are usable at ~360px without horizontal scroll.
10. `lint`, `build`, and `test` pass, and a test asserts the share trigger renders for an
    **anonymous visitor**. New strings are wired in English and handed off for Shan.

## Notes

- **QR library: `qrcode.react`** (owner's choice, installed at `^4.2.0`; supports React 19).
  It renders client-side, which is acceptable here because the dialog is already a client
  leaf — the QR only mounts when the dialog opens. `QRCodeCanvas` is the useful variant for
  the download path, since a canvas can be composited directly.
- **Download approach.** Compose the card on an offscreen `<canvas>` (background, text, the
  QR drawn from `QRCodeCanvas`), then `toBlob` → object URL → anchor `download`. Two things
  to get right: `await document.fonts.ready` before drawing, and read the **resolved font
  family from the DOM** rather than hardcoding one, so Shan names/roles render with the AJ
  fonts in the PNG instead of falling back and breaking tone marks.
- **The absolute URL comes from the server** (`siteUrl()` + `/${locale}/developers/${handle}`),
  matching the page's canonical, rather than being rebuilt on the client. Note `siteUrl()`
  falls back to `http://localhost:3000` when no domain env is set — the same caveat the
  metadata already carries.
- **Reuse ladder.** `Dialog`, `DialogTrigger`, `DialogContent` already exist (PBI-014 shows
  the Base UI shape — `render={children}` for the trigger, not `asChild`). The card preview
  is the one genuinely new composite; it belongs in `components/developers/`.
- Sharing is **not** a write path, so no rate limit is implicated — nothing is persisted.
