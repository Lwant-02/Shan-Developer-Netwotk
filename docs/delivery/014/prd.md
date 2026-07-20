# PBI-014 — Sign-in dialog (frontend only)

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-20 |
| **Depends on** | PBI-010 (top nav, which holds the trigger), PBI-013 (dark-only palette) |
| **Blocks** | Better Auth wiring — a later PBI |

## Problem

`design.md` settles authentication 🟢: **Better Auth with Google and GitHub OAuth**.
The top nav already renders a live-looking "Sign in" button, but it does nothing —
there is no surface to sign in *from*.

This PBI builds **only that surface**: the dialog, its copy, and the two OAuth
buttons. It deliberately does **not** wire Better Auth, create a session, touch the
database, or add env vars. Those need Neon and OAuth apps and belong in their own PBI;
splitting the UI out lets the design be reviewed now without standing up a backend.

## Why it matters

- The nav's "Sign in" is currently the one live-looking control that leads nowhere.
- Sign-in is the **only gate** in this product, so the moment a visitor decides to
  contribute is the single highest-stakes screen in the UI. It deserves deliberate copy
  rather than two unexplained buttons.
- **Identity is sensitive here.** `design.md` requires that the OAuth email is never
  public and that pseudonymity is supported. A visitor handing over a Google or GitHub
  identity should be told what becomes public *before* they click, not after.

## Conditions of Satisfaction

1. **A dialog opens from both sign-in entry points** — the top nav's "Sign in" and the
   right rail's "Sign in to post" — sharing one component. It closes on the close
   button, `Esc`, and backdrop click (Base UI defaults).
   The nav trigger is **hidden from `xl`**, where the right rail appears: two sign-in
   buttons on one screen is one too many.
2. **Two OAuth options — Google and GitHub** — each with its brand mark from
   `public/icons/`, a clear "Continue with …" label, and an **"or" divider** between
   them.
3. **The GitHub mark is legible on the dark surface.** The supplied asset is `#161514`
   on a `#0a0a0a` background; it must be inverted to render white, which is what
   GitHub's brand guidance specifies for dark backgrounds. The Google mark stays
   **unaltered** — Google's guidelines require the multicolour "G" as-is.
4. **The copy states what stays private**: the OAuth email is never shown publicly, and
   a display name may be used instead of a real one.
5. **The copy reinforces anonymous read** — no account is needed to read — so the
   dialog never reads as a wall.
6. **The buttons are inert placeholders.** No auth call, no session, no network. This
   is explicit in the code so the next PBI knows exactly where to attach.
7. **Consent gates sign-in.** A checkbox covering the Terms and Privacy Policy must be
   ticked before either provider button is enabled — consent is a precondition, not a
   footnote, and a test pins it.
8. **`"use client"` is justified by exactly one thing** — the consent checkbox state.
   The trigger arrives as `children`, not a named prop: a React element crossing the
   server/client boundary as a prop breaks the static prerender. `/shn` and `/en` stay
   statically prerendered.
9. **No bold on any Shan-bearing string.** Both `buttonVariants` and the registry
   `DialogTitle` ship `font-medium`; override at the call site rather than editing
   `components/ui/*`.
10. **`rounded-lg` only.** The registry `DialogContent` ships `rounded-xl`; override at
    the call site — `design.md`'s one-radius rule names dialogs explicitly.
11. **No invented Shan.** Strings land as English + `TODO(shn):` placeholders unless a
    Shan speaker supplies the translation. The owner wrote all seven Shan values
    directly, so no placeholder ships and `npm run i18n:prompt` reports nothing pending.
12. `lint`, `build`, and `test` pass, and tests cover the trigger rendering for an
    **anonymous** visitor and the consent gate.

## Known gap — Terms and Privacy do not exist

The consent checkbox names a **Terms of Service** and a **Privacy Policy** that are not
written and have no routes. They are therefore rendered as **plain text, not links** —
this repo already refuses to ship links that 404 (PBI-010 disables the unbuilt nav items
rather than routing them), and a link is the lesser problem here anyway.

The real problem is that consent to a non-existent document is meaningless. This must be
resolved before any real sign-in ships: write both documents, give them routes, and turn
this label into links. Related to PBI-005 (moderation policy), which is `Deferred`.

## Notes

- **Not in `components/ui/`.** This is an app-specific composite, so it lives in
  `components/auth/`; `components/ui/` is registry-managed and `shadcn add` overwrites it.
- **Icons via `next/image` with `unoptimized`.** Next's image optimizer refuses SVG
  unless `dangerouslyAllowSVG` is set; `unoptimized` avoids widening that config for
  two static brand marks.
- **Deliberately no email/password and no magic link.** `design.md` settles OAuth-only,
  and "verified" means OAuth-email-verified — adding a second mechanism would create a
  second, weaker verification tier the product explicitly doesn't have.
- The dialog does not promise a Shan-language OAuth experience: Google's and GitHub's
  own consent screens are outside our control and will render in their own locales.
