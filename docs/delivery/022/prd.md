# PBI-022 — Create flow — post / project / event (shell + composer, frontend only)

| | |
| --- | --- |
| **Status** | InProgress |
| **Created** | 2026-07-25 |
| **Depends on** | Better Auth + rate limiting (Open Questions) for the real write path; PBI-014 (sign-in dialog — the auth gate) as the attach point |
| **Relates to** | PBI-010/016 (Post), PBI-020 (Project), PBI-021 (Event) — the read shapes this creates into; PBI-019 (frontend-only submit precedent); PBI-005 (moderation, deferred) |

## Problem

The three 🟢-decided content types all have **read** surfaces built from typed mock
data — the feed + post detail (PBI-010/016), Projects (PBI-020), Events (PBI-021) —
but there is **no way to create any of them.** `design.md` says a signed-in member can
"Post, share projects, create events, interact"; today they can do none of it.

The top-nav **Create** control renders but goes nowhere:

```
components/shell/top-nav.tsx:54
<span className="hidden sm:inline">{t("create")}</span>   // no href, no handler
```

It is display-only, exactly like the notifications and account controls (`AGENTS.md`:
"The top-nav Create / notifications / account controls are display-only until auth").
So the product advertises a capability that dead-ends — the same gap PBI-021 described
for the disabled Events nav, but for the primary action the whole platform is about.

The fields each form must collect already exist as typed models — nothing collects
them:

- `Post` (`lib/feed.ts`) — `title`, `body`, `lang`.
- `Project` (`lib/projects.ts`) — `title`, `description`, `repo`/`website`/`appStore`/
  `playStore`, `tags`, `lang`.
- `EventItem` (`lib/events.ts`) — `title`, `description`, `startsAtISO` (UTC),
  `online`, `location`, `joinUrl`/`registerUrl`, `lang`.

Creating content is a **write**, and writes need a signed-in user plus a rate limit
(`AGENTS.md`) — neither of which exists yet. So, like every prior interactive shell
(PBI-014 sign-in, PBI-019 feedback), this is a **frontend-only** UI: the forms render
and validate, and **Publish** is the attach point for a later write endpoint, asserting
no logged-in identity.

## Why it matters

The platform's recruiting and community mechanism is members sharing their work **in
their own language**. A create flow is the one path by which Shan content enters the
system, so the composer is a first-class language surface, not a generic form:

- It carries a **per-content language tag** distinct from the UI locale (`design.md`
  per-content-language tagging, 🟢 decided) — someone reading the UI in English still
  authors in Shan.
- It must accept **Shan-script input** rendered in the AJ font, with **no faux-bold**
  anywhere (`AGENTS.md`).

Until it exists the product is entirely read-only, and the most prominent button in
the top nav is a dead affordance.

## Approach (proposed — settle at agree-time)

- **One shared composer shell across all three types**, so they look and behave
  identically and differ only in type-specific fields. Reached from the top-nav Create
  control; that control stops being display-only.
- **Body editor: a lightweight markdown composer with a Slack-style formatting
  toolbar** — toolbar buttons insert markdown into a plain `textarea` (wrap the
  selection in inline code, insert a fenced code block, bullet / ordered list,
  blockquote, and the emphasis the fonts allow), and typing plainly also works. This is
  **deliberately not a WYSIWYG editor library** (ProseMirror / TipTap / Lexical / Slate):
  `AGENTS.md` is Server-Component-first and "ruthless about client JS … the target user
  is on a mid-range Android phone on mobile data," and those bundles are exactly the
  weight the audience can't afford. Markdown is also the natural storage/render format
  and survives mixed Shan/Latin content. **This is the key open decision — see Notes.**
- **Type-specific fields** map the existing models above. Event start time gets explicit
  timezone handling and is represented as **UTC** (PBI-021's store-UTC / Myanmar
  +06:30 rule — the half-hour offset naive code mangles). An **optional photo** is a
  client-side picker only (preview + remove, 5 MB cap), mirroring the feedback dialog —
  nothing is uploaded, since server-side image **storage** is still an Open Question. No
  draft persistence.
- **Frontend-only:** Publish persists nothing and is the documented seam for a later
  rate-limited write endpoint. Anonymous visitors are routed to the sign-in gate
  (PBI-014), not a working publish.

## Conditions of Satisfaction

1. A create surface exists for each of the three types (post, project, event),
   reachable from the top-nav Create control; that control is no longer a dead
   affordance.
2. The three share one composer shell — consistent layout, body editor, language
   selector, publish/cancel — differing only in their type-specific fields.
3. The body editor offers a formatting toolbar whose controls — at minimum bullet list,
   ordered list, blockquote, inline code, and code block — insert the corresponding
   markdown into the field, and plain typing works unchanged.
4. Each form collects exactly the fields its data model needs (`Post` / `Project` /
   `EventItem`), including a **per-content language tag** distinct from the UI locale.
5. Event start time is captured with explicit timezone handling and represented as UTC;
   no naive local-time bug (verifiable against the PBI-021 rule).
6. Creating is **frontend-only**: Publish persists nothing and asserts no logged-in
   identity; it is the documented attach point for a later write endpoint. Anonymous
   visitors reach the sign-in gate rather than a working publish.
7. The composer follows the house rules: Server-Component-first with `"use client"`
   pushed to the smallest interactive leaves; no faux-bold on any Shan-capable text;
   Shan input renders in the AJ font; semantic tokens only; `rounded-lg` only.
8. UI strings live in `messages/en.json` + `shn.json` with key parity and no ICU
   placeholder drift; Shan is translated or flagged for review per the repo's Shan-copy
   policy.
9. The later write endpoint's **rate-limit requirement is carried forward** as a
   recorded dependency (`AGENTS.md`), since the endpoint itself is out of scope here.

## Notes

- **Depends on the auth gate and later infra.** Real creation needs Better Auth, a
  rate-limited write endpoint, and (for images) storage — all Open Questions / not
  built. This PBI is the UI shell only, per the PBI-014 / PBI-019 frontend-only
  precedent; the Publish handler and the anonymous→sign-in gate are the seams those
  later PBIs attach to.
- **Editor weight is the decision to make at agree-time.** The recommendation is a
  markdown `textarea` + toolbar, not a WYSIWYG library, on client-JS grounds. If the
  owner wants live-rendered rich text, reconsider then — it changes the bundle budget
  materially and would likely warrant its own note in `design.md`.
- **Markdown must render on the read surfaces.** The post/project/event detail pages
  currently render bodies as plain text. If the composer emits markdown, those pages
  need a (lightweight) markdown renderer, or the format won't display. Decide at
  agree-time whether that rendering is in-scope here or a sibling PBI.
- **Reuse before create** (`AGENTS.md` ladder): build the fields from existing shadcn
  primitives (`input`, `textarea`, `button`, `checkbox`; pull `select`/others via
  `npx shadcn@latest add`), not hand-rolled controls. The tag input and language
  selector should reuse existing patterns.
- Relates to PBI-005 (moderation, deferred) — relevant the moment writes go live.

## Out of scope

- Any persistence, database, session, or write endpoint.
- Server-side image/file **storage** and upload (Open Question) — the composer's photo
  field is a client-side preview only, delivered nowhere.
- Draft saving, autosave, or edit-after-publish.
- Moderation / spam handling (PBI-005, deferred) beyond noting the rate-limit
  dependency.
