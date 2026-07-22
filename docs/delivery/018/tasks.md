# PBI-018 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at agreement time

- **No copy-link field or visible URL** (owner's call) — the QR carries the URL, so the
  dialog is the card preview + download, nothing else.
- **QR library is `qrcode.react`** (owner's choice), installed at `^4.2.0`. Client-side is
  acceptable because the dialog is already a client leaf; the QR mounts only when opened.
- **Download is a PNG**, composed on an offscreen canvas and saved as `sdn-<handle>.png`.
- **Profiles only.** Posts / projects / events sharing is out; the post card's Share button
  stays display-only.
- **Identity safety unchanged:** the card can only show what the profile already shows —
  no email, coarse+optional location, initials avatar.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | New chrome strings (English + `TODO(shn)`): `share`, `shareDescription`, `download` | Done | — | CoS 10. Added to the `Developers` namespace. |
| 2 | Card preview inside the dialog: initials avatar, name/handle, role, optional location, site branding, `QRCodeSVG` of the profile URL | Done | — | CoS 2, 3, 5, 8. Lives in `share-profile-dialog.tsx`. |
| 3 | Canvas download: `await document.fonts.ready`, colours + font stack read from the live card, draw card + composite an off-screen `QRCodeCanvas`, `toBlob` → anchor download | Done | — | CoS 4. Saves `sdn-<handle>.png`. |
| 4 | `ShareProfileDialog` (client leaf): reuses `Dialog`/`DialogTrigger` (`render={children}`), preview + Download control | Done | — | CoS 1, 6, 7, 8. The only client file in this PBI. |
| 5 | Wire the Share control into the profile page (paired with the back link), passing the **absolute** URL built server-side (`siteUrl()` + locale path) | Done | — | CoS 1, 3, 7. Page stays a Server Component. |
| 6 | Responsive pass: `rounded-lg`, no bold, semantic tokens (the QR plate is a deliberate `bg-white` exception for scannability) | Done | — | CoS 8, 9. ~360px is a browser check. |
| 7 | Test: the share trigger renders for an anonymous visitor | Done | — | CoS 10. Kept off the canvas path — jsdom cannot rasterise a canvas. |
| 8 | Verify: `lint`, `build`, `test`; logged-out render; close-out | Done | — | CoS 1–10. See below. |
| 9 | **(owner add)** `joinedAtISO` on `Developer` + all 8 mocks; rendered as **month + year only** on the profile header and the share card | Done | — | Scope addition. Coarse on purpose — an exact join date is a correlation handle. |
| 10 | **(owner add)** Enrich the share card ("too simple"): brand rule, avatar, name, role, `location · joined` meta, wrapped bio, an activity stat row (posts/projects/events), then the QR and handle — mirrored in the canvas export with a word-wrap helper | Done | — | Scope addition. Counts arrive as a `stats` prop so the mock data modules stay out of the client bundle. |

## Verified vs browser-only

Verified here:

- `npm run lint`, `npm run build`, `npm test` (37 tests) all pass; the build still prerenders
  43 static pages, so adding the client dialog did not push the profile route dynamic.
- Logged out via `curl`: `/en/developers/tai_builds` and `/shn/...` → 200, the **Share**
  trigger renders, and **no copy-link or raw URL text** appears in the dialog markup (CoS 6).

**Browser-only (cannot be checked headlessly):**

- **The PNG download** — jsdom has no canvas rasterisation, so the composed image, the font
  resolution for Shan text, and the `sdn-<handle>.png` filename need a real browser.
- **Scanning the QR** resolves to the right profile (no camera here).
- The dialog and card at ~360px.

## Shan copy — translated

All four new strings (`share`, `shareDescription`, `download`, `joined`) were translated and
owner-reviewed before the commit, so **no `TODO(shn)` ships** — `npm run i18n:prompt` reports
clean. `joined` carries the `{date}` placeholder; the date itself is formatted per locale via
`useFormatter`, month + year only.
