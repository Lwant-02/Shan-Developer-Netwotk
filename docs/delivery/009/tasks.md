# PBI-009 — Tasks

See [prd.md](./prd.md). Status: `Proposed` → `Agreed` → `InProgress` → `Done`.

## Decisions taken at implementation time

- **Scope is installable-only** — manifest + icons, no service worker. Offline is a
  separate, later PBI (premature until there is content to cache).
- **Icons ship as placeholder upscales of the 96×96 logo, by owner decision.** This is
  a deliberate, recorded deviation from CoS 2 ("not upscaled"): the owner chose to ship
  a working install now and replace the art later. The icons are soft but the manifest
  is install-valid. Replacement is tracked in the backlog's Open Questions.
- **Colors are white** (`#ffffff`), mirroring the light `--background`; no dark theme.

## Tasks

| # | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Read the Next `manifest` file-convention doc | Done | — | `app/manifest.ts` → `/manifest.webmanifest`, link auto-injected. |
| 2 | Add `shortName` to `siteConfig` | Done | — | Set to `SDN` by the owner. |
| 3 | `app/manifest.ts`: name, short_name, start_url `/shn`, display, colors, lang/dir | Done | — | CoS 1, 5. |
| 4 | Reference 192 / 512 / maskable icons in the manifest | Done | — | CoS 2. |
| 5 | Generate `icon-192`, `icon-512`, `icon-maskable` | Done | — | CoS 2 — **placeholder upscales of the 96px logo**, per the owner decision above. |
| 6 | Verify `<link rel="manifest">` in built HTML, logged out | Done | — | CoS 3. |
| 7 | Verify manifest + icons serve 200 from a prod build | Done | — | CoS 8. All three icons `image/png` 200; manifest `application/manifest+json` 200. |
| 8 | `lint`, `build`, `test` pass | Done | — | CoS 8. 15/15 tests. |
| 9 | Confirm the install button appears in-browser | Owner | **human** | CoS 4, 7. Criteria met (valid manifest, 192+512 load, standalone, secure). The button showing must be seen in Chrome — hard-reload first; Chrome caches manifests. |
| 10 | Replace placeholder icons with ≥512 art | Deferred | **human** | Follow-up in Open Questions; not blocking Done. |

## Conditions of Satisfaction — outcome

1. Manifest fields — **met**. name, short_name, start_url `/shn`, standalone, colors, lang `shn`, dir `ltr`.
2. 192 / 512 / maskable icons — **met with a recorded deviation**: placeholder upscales of the 96px logo, owner-accepted, to be replaced.
3. `<link rel="manifest">` in the head, logged out — **met**.
4. Browser install → standalone at `/shn` — **criteria met; final in-browser confirmation is the owner's** (task 9). Automatic prompt is out of scope (needs a service worker).
5. Real light-palette color, not invented — **met** (`#ffffff` = `--background`).
6. Zero new client JS — **met** (no service worker, no `"use client"`).
7. No manifest errors — **met** for the served manifest; DevTools confirmation is task 9.
8. `lint` + `build` pass, manifest served from a prod build — **met**.
