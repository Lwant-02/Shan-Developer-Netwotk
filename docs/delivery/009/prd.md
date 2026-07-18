# PBI-009 — Installable PWA (web manifest + icons)

| | |
| --- | --- |
| **Status** | Proposed |
| **Created** | 2026-07-18 |
| **Depends on** | A ≥512×512 icon source (human/design input — see Notes) |
| **Relates to** | PBI-008 (already set `appleWebApp` + `icons` in the layout) |

## Problem

The app cannot be installed to an Android home screen. There is **no web app
manifest** anywhere in `app/` (no `app/manifest.ts`, no `manifest.webmanifest`), so
Chrome/Android has no `name`, `start_url`, `display`, or install icons to work from.

What already exists, from PBI-008's SEO metadata in `app/[locale]/layout.tsx`:

- `appleWebApp: { capable: true, title, statusBarStyle }` — covers iOS "Add to Home
  Screen" naming.
- `icons: { icon, shortcut, apple }` — all pointing at `public/icons/logo.png`.

That is the iOS half and a favicon. The Android/Chrome half — a real manifest — is
missing, and the one icon asset is **96×96** (verified with `sips`), well below the
**192 and 512** that installable icons require and with no `maskable` variant. So even
with a manifest, the install experience would be a blurry, letter-boxed icon.

## Why it matters

`design.md` names the audience as **mid-range Android on mobile data, with
intermittent connectivity** and makes low-bandwidth a hard constraint. For that user,
a home-screen install is not a nice-to-have: it puts a regional, single-purpose
community app one tap away, launches it chromeless in `standalone` mode so it reads as
a real app rather than a browser tab, and fixes it to the Shan-default entry point.
This is a **locality** argument — the network and device reality of this region — not
a generic "make it a PWA" checkbox, which is why the scope stops at installability and
does **not** add a service worker.

## Scope

A web app manifest and installable icons, wired so mid-range Android can install the
app and launch it standalone.

**In scope:** `app/manifest.ts`, the manifest fields, 192/512/maskable icons, and
verifying install + standalone launch.

**Out of scope — deliberately:**

- **No service worker, no offline caching, no offline fallback.** A service worker is
  exactly the client JS the repo is ruthless about, and there is no real content to
  cache yet (the home page is a placeholder). This is a separate, later PBI, and it is
  premature until posts/projects exist.
- **No push notifications / background sync.** Those need auth + a backend that don't
  exist, and push on a pseudonymity-sensitive audience needs its own safety review.

## Conditions of Satisfaction

1. `app/manifest.ts` serves a valid manifest at `/manifest.webmanifest` with at least:
   `name`, `short_name`, `start_url` (`/shn`), `display: "standalone"`,
   `background_color`, `theme_color`, `lang: "shn"`, `dir: "ltr"`.
2. `icons` includes a **192×192** and a **512×512** PNG, plus one `purpose: "maskable"`
   icon with safe-zone padding. The images are genuinely those resolutions, **not
   upscaled from the 96×96 logo**. If no ≥512 source exists yet, this CoS is blocked on
   that artwork (see Notes) rather than met with a blurry upscale.
3. `<link rel="manifest" href="/manifest.webmanifest">` appears in the document head
   (Next injects it from `app/manifest.ts`), verified in built HTML **logged out**.
4. Installing via the browser ("Install" / "Add to Home Screen") launches the app in
   **standalone** mode at `/shn`, showing the app name and the installed icon. The
   automatic install *prompt* (`beforeinstallprompt`) is **out of scope** — Chrome
   requires a service-worker fetch handler for it, which this PBI deliberately omits.
5. `theme_color` / `background_color` use the actual light-palette value (the white
   `--background`), **not an invented brand color** — the palette is deliberately
   greyscale until brand colors are chosen.
6. **Zero new client JS.** No service worker and no `"use client"` — the manifest and
   icons are static assets.
7. Chrome DevTools → Application → Manifest reports no errors, and the manifest
   validates against the installability criteria given the no-service-worker boundary.
8. `npm run lint` and `npm run build` pass, and the manifest is verified served from a
   **production build, by request** (not by reading source).

## Notes

- **Icons are a design/human input, and the blocking dependency.** Installable icons
  need 192 and 512, plus a `maskable` variant with ~10% safe-zone padding. The only
  asset today is `public/icons/logo.png` at 96×96; upscaling it ships blurry icons.
  A ≥512×512 source (ideally the original vector/artwork) is required first. An agent
  can generate the sized PNGs from a large enough source, but cannot invent detail that
  isn't in a 96px image.
- **Brand colors aren't chosen** (the palette is greyscale, `--background` is white).
  Use white / the neutral token for `theme_color` and `background_color`; revisit if a
  palette lands. There is no dark theme, so a single color is correct.
- **Chrome's automatic install prompt needs a service worker** with a fetch handler.
  Without it the app is still installable from the browser menu and launches
  standalone — it just won't proactively prompt. The offline/service-worker layer is a
  future PBI, not this one.
- **Align with PBI-008's metadata, don't duplicate it.** The layout already sets
  `appleWebApp` and `icons`; the manifest should reference the same icon assets
  consistently rather than introduce a second, divergent set.
- **Read the Next `manifest` file convention** (`app/manifest.ts`) before implementing
  — this repo's Next differs from training data.
- `start_url` is `/shn`, matching the Shan-first rule (`localeDetection: false`); the
  manifest is a single file and is not localised.
