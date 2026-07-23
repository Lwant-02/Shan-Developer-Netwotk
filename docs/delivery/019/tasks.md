# PBI-019 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **Frontend only.** The dialog + form are real; **submit sends nothing** — it is the
  documented seam for the future GitHub-issue route. A local, clearly-labelled success state,
  so no tester thinks an issue was filed.
- **A Bug / Idea type toggle** at the top of the form (segmented control, defaults to Bug),
  plus **title, description, optional image**. Two types only — no "Note".
- **Entry point is a floating icon button pinned bottom-right**, mounted once in the shell so
  it rides every page. It replaces the earlier left-nav footer trigger. Icon-only, with an
  `aria-label`.
- **Image is a client-side picker only** — preview + remove, `image/*`, ~5 MB cap. **Nothing
  is uploaded**; delivering it later needs image storage + hosting (doesn't exist) and belongs
  to the write-path PBI.
- **The write path** (server route, token, rate limit, spam defense, image hosting) is a
  **separate later PBI**, filed before submit is wired.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | New `Feedback` namespace strings (English + `TODO(shn)`): launch, title/description, type label + Bug/Idea, field labels + placeholders, add/remove-image, imageError, submit, success, done | Done | — | CoS 8. 16 strings; **Shan pending**. |
| 2 | Pulled `textarea` via `npx shadcn@latest add textarea` (`input` already existed) | Done | — | CoS 2, 6. Base UI shape. |
| 3 | `FeedbackDialog` (client leaf): Bug/Idea type toggle (defaults Bug), `Dialog` + form (`Input` title, `Textarea` description), title/description required + max lengths, disabled→enabled submit | Done | — | CoS 1, 2, 3, 5, 6. Trigger via `children`. |
| 4 | Image field: `image/*` file input, type + 5 MB validation, object-URL **preview** + remove, URL revoked on remove/close; optional | Done | — | CoS 3. Held in state only — **no upload**. |
| 5 | Submit handler: **no network call** — `handleSubmit` with an ATTACH-POINT comment (`{ type, title, description, image }`); local success state worded so it doesn't imply the report was sent | Done | — | CoS 4. |
| 6 | Entry point: `FeedbackLauncher`, a fixed bottom-right icon button mounted in `AppShell`; both stay Server Components (trigger passed as `children`) | Done | — | CoS 1, 5. |
| 7 | Responsive: `rounded-lg`, no bold, semantic tokens; `DialogContent` is `max-w-sm` and the image preview caps height | Done | — | CoS 6, 7. ~360px is a browser check. |
| 8 | `__tests__/feedback.test.tsx`: trigger renders anonymously; opening + submitting the form makes **no `fetch`** (stubbed) | Done | — | CoS 8. 2 tests. |
| 9 | Verify: `lint`, `build`, `test`; logged-out render; close-out | Done | — | CoS 1–8. See below. |

## Verified vs browser-only

Verified here:

- `npm run lint`, `npm run build`, `npm test` (39 tests) all pass; build still prerenders 43
  static pages (the client dialog didn't push any route dynamic).
- Two feedback tests: the trigger renders for an anonymous visitor, and **opening + submitting
  the form makes no `fetch`** (stubbed and asserted) — CoS 4.
- Prerendered `/en` HTML carries the floating launcher (`aria-label="Send feedback"`) logged
  out — the entry point is in the static payload, no session required.

**Browser-only:** the Bug/Idea toggle, the image picker/preview + remove, the floating button
placement, and the dialog/form at ~360px.

## Shan copy

The 16 `Feedback` strings were translated by the owner (a Shan speaker) before merge — no
`TODO(shn)` ships. `messages/shn.json` carries the reviewed Shan for the whole namespace.

## Conditions of Satisfaction

Tracked in [prd.md](./prd.md#conditions-of-satisfaction). The load-bearing one is **CoS 4** —
nothing is submitted, and the UI must not pretend otherwise.
