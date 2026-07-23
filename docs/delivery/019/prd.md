# PBI-019 — Feedback / issue dialog (frontend only)

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-22 |
| **Depends on** | — (reuses the `Dialog` primitive from PBI-014) |
| **Blocks / precedes** | The GitHub-issue **write path** (server route + token + rate limit) — a later PBI |

## Problem

There is no way for a visitor to report a bug or send feedback. The top nav's Create /
notifications / account controls are display-only until auth, and nothing anywhere invites
a bug report or a suggestion. For an early-stage community platform whose whole point is to
be shaped by the people who use it, that is a missing loop.

The owner wants feedback to land as an **issue on the project's GitHub repo**
(`Lwant-02/Shan-Developer-Netwotk`), created automatically on submit. That end state is a
**server-side write path** — a Route Handler holding a GitHub token, calling the issues API
— which pulls in this repo's hard rules: **every write endpoint needs a rate limit**
(`AGENTS.md`), and with no auth yet, an anonymous endpoint that writes to a public repo is a
spam and abuse vector.

**This PBI builds the frontend only.** The dialog and its form are real and reviewable; the
submit is the seam where the GitHub route attaches later — exactly as PBI-014 shipped the
sign-in dialog with inert provider buttons "where Better Auth attaches." No network call,
no token, no endpoint, so none of the write-path rules bind yet.

## Why it matters

Shipping the surface now lets the entry point, the placement, the form shape, and the copy
settle and get reviewed without waiting on backend and rate-limit infrastructure that
doesn't exist yet. It also keeps the risky part — an anonymous write path to a public repo —
behind its own decision, rather than smuggling it in with a UI change. When the write path
is built, the form it submits is already designed.

## Scope

A feedback/issue dialog reachable from the app chrome, with a form and a submit that is not
yet wired to anything.

**In scope:**

- An **entry point** in the chrome (e.g. a "Feedback" item in the left-nav footer near
  Terms/Privacy) that opens the dialog.
- A **dialog** (reusing the existing `Dialog` primitive) with a form: a short **title**, a
  **description**, and an **optional image**.
- The **image field is a client-side picker only** — accepts an image, shows a preview, and
  can be removed. **Nothing is uploaded**; the file is held in local state (submit sends
  nothing anyway). Validate type (image) and a sensible max size.
- **Client-side validation only** — required fields (title, description), sensible max
  lengths — with disabled/enabled submit state. `"use client"` confined to this dialog leaf.
- A **submit control that does not send anything yet**: it is the documented attach point
  for the future GitHub route. On submit it shows a **local, mocked success state** (a
  thank-you), making clear in code that no network call happens.
- **Bilingual chrome**, Shan via the usual hand-off.
- Works **fully logged out**.

**Out of scope — deliberately (the next PBI, or a decision):**

- **The actual GitHub submission** — the server Route Handler, the token, and the live API
  call. That is the write path this one only prepares for.
- **Uploading the image anywhere.** The picker holds a file client-side only. Delivering it
  needs **image storage, which this app does not have** (an open item — Neon bundles none),
  *plus* a step to host the image and embed its URL in the issue body, since the GitHub
  issues API cannot attach a file directly. All of that belongs to the write-path PBI.
- **The rate limit and spam defense** (honeypot, throttling) — mandatory for the write path,
  meaningless without it. They land with the endpoint, not here.
- **Any secret / env var** (`GITHUB_TOKEN`, repo config) — nothing is read at runtime yet.
- **Auth-gating** the form — auth doesn't exist; anonymous is the only option today, and
  whether to gate it is part of the write-path decision.
- **Moderation** of what reaches the public repo — a write-path concern.
- **File/screenshot attachments.**

## Conditions of Satisfaction

1. An entry point in the chrome opens a **feedback/issue dialog**, and it works **fully
   logged out** (no session, nothing gated).
2. The dialog has a form with a **title**, a **description**, and an **optional image**,
   using the existing `Dialog` and form primitives (`Input` etc.) rather than new ones.
3. **Client-side validation**: submit is disabled until title and description are valid, with
   sensible max lengths; no submission is possible with those empty. The **image is optional**
   and validated for type + max size; picking one shows a **preview** that can be removed.
   **No file is uploaded** — it stays in local state.
4. On submit, **no network request is made** — a local success/thank-you state shows, and
   the code makes explicit (a comment + a clearly-named handler) that this is the attach
   point for the future GitHub route, not a real submission.
5. **Server-Component-first:** `"use client"` is confined to the dialog leaf; the chrome that
   hosts the trigger stays a Server Component (trigger passed as `children`, the PBI-014
   pattern).
6. **Monochrome, `rounded-lg` only, no `font-bold`** (labels/placeholder can be Shan);
   semantic tokens; reuses `Dialog`, `buttonVariants`, and the form inputs.
7. **Mobile-first:** the dialog and form are usable at ~360px with no horizontal scroll.
8. `lint`, `build`, and `test` pass, and a test asserts the dialog **renders for an anonymous
   visitor** and that submitting the mock form does **not** perform a fetch. New strings are
   wired in English and handed off for Shan.

## Notes

- **This is a seam, not a stub to forget.** The success state must not imply the feedback
  went anywhere real, or testers will assume issues are being filed when they aren't. Word it
  as "Thanks — sending will be wired up soon," or keep the mock clearly labelled, so no one is
  misled. (Same honesty as the display-only vote/like and the sign-in-gated composer.)
- **The write path is the real work and its own PBI.** When it lands it needs: a Route
  Handler (`app/api/feedback/route.ts`) that never exposes the token; a **fine-grained PAT
  scoped to issues on the one repo** (or a GitHub App), read from an env var server-side; a
  **rate limit** (per-IP; needs a store — an infra decision, likely Upstash on Vercel); a
  **honeypot** and length caps; **image storage + hosting** so the optional image can be
  embedded as a URL in the issue body (GitHub can't attach a file via the API, and no storage
  exists yet); and a note that content lands on a **public** repo. File that PBI before wiring
  submit.
- **Image field, this PBI:** a single image, previewed via an object URL and revoked on
  remove/close; cap the size (~5 MB) and accept `image/*`. It is a UI affordance and a seam —
  the file never leaves the browser here.
- **Repo target:** `Lwant-02/Shan-Developer-Netwotk` (note the upstream spelling). Issues
  would carry a label (e.g. `feedback`) so app-filed reports are filterable.
- **Reuse the shadcn form inputs** — pull `textarea` / `select` via `npx shadcn@latest add`
  if not present (Base UI shape, not Radix); do not hand-write them.
- If the form grows past type/title/description during breakdown, keep the extra scope in the
  write-path PBI rather than expanding this one.
