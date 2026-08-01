# PBI-026 — Share dialog for posts, projects, and events

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-08-01 |
| **Relates to** | PBI-018 (the profile share dialog — QR-based, a different surface); PBI-010/020/021 (the cards carrying the dead Share control) |

## Problem

Every content card has a **Share** button and none of them do anything.
`components/content/share-button.tsx` says so outright — *"Sharing is not wired yet"* —
and the feed card has its own inert copy of the same control. Three surfaces, one dead
affordance, same gap PBI-022/023/024/025 closed elsewhere.

## Why it matters

Anonymous read access exists so the content can recruit — public, indexable pages are
the whole distribution strategy. Sharing is the *other* half of that: search brings
strangers, sharing brings the people a member actually knows. For a community at cold
start, a member pasting a Shan-language post into the Facebook group or Telegram channel
where Myanmar tech conversation already happens is worth more than any amount of SEO.

That also decides **which** networks matter. This is not a generic share sheet: Facebook,
Telegram, Viber, and LINE are where this audience is. X and LinkedIn are there for reach
beyond it, not because they are defaults.

## Approach

- **`react-share`** for the network buttons and marks — it already handles each
  network's share URL format and ships the icons, which is otherwise a pile of
  hand-maintained URL templates.
- **Lazy-loaded**, following the kbar precedent in `search-trigger.tsx`. The Share button
  is on every card in the feed; statically importing the library would put it in the
  bundle of every anonymous reader on mobile data who never taps it. The chunk is fetched
  on hover/focus so the click doesn't wait on the network.
- **One shared control.** `ShareButton` becomes the client trigger and the feed card drops
  its inline copy, so all three surfaces share one component and one dialog.
- **No copy-link control** (owner's call, matching PBI-018's profile dialog). Each
  network button already carries the URL — `react-share` builds the share link from it —
  so a copy field only served channels not listed here.
- **The URL is built server-side** in the card, from `siteUrl()` + locale + path, and
  passed down as a string. `siteUrl()` falls back to a server-only Vercel env var, so
  computing it in the client would silently produce `localhost` links in production.
- **No share counts.** `react-share` can fetch them; that is a third-party request per
  card on mobile data, and a zero next to a member's post is discouraging.

## Conditions of Satisfaction

1. The Share control on a post, project, and event card opens a dialog instead of doing
   nothing.
2. The dialog offers Facebook, Telegram, Viber, LINE, X, and LinkedIn, and nothing else.
3. Each share targets the **canonical absolute URL** of the specific item, locale
   included — not the page the visitor happens to be on, and not a `localhost` URL in
   production.
4. `react-share` is **not** in the initial bundle for a page that merely renders cards;
   it loads when someone reaches for Share.
5. The dialog works for an anonymous visitor — sharing needs no session.
6. House rules hold: `"use client"` only on the trigger and dialog, no faux-bold on
   Shan-capable text, semantic tokens, `rounded-lg`, `cn()`.
7. UI strings live in `messages/en.json` + `shn.json` with key parity.

## Notes

- **Not a write path**, so no rate limit is needed: sharing hands a URL to another app
  and touches nothing here.
- The **profile** share (PBI-018) keeps its own QR-based dialog. Two dialogs is correct —
  one shares a person as a card, the other shares a piece of content as a link.
- Network choice is a **locality decision**, not a default. Revisit it against where the
  audience actually is, not against what a share library ships.

## Out of scope

- Sharing to a network via an API (posting on someone's behalf) — needs OAuth scopes
  nobody has agreed to.
- Share counts or analytics on shares.
- A copy-link control, and the native Web Share sheet — both were considered as the
  fallback for unlisted channels (Messenger, SMS, pasting into a chat) and dropped.
- Changing the profile share dialog.
