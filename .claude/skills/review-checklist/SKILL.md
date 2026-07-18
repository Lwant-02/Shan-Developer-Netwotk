---
name: review-checklist
description: Review a change against this project's specific product and code rules — anonymous read access, rate limits, identity safety, multilingual content, Base UI/Tailwind conventions. Use before committing or opening a PR, alongside the built-in /code-review.
---

# Project review checklist

This complements the built-in `/code-review`, which finds generic correctness bugs.
This pass checks the things a general reviewer **cannot know** — the product rules in
`AGENTS.md` and `design.md` that make this project what it is.

Run `git diff` (or `git diff main...HEAD`) and check the changed code against the
sections below. Only raise what the diff actually touches.

## Product rules — these are not style preferences

**Anonymous read access.** Posts, projects, profiles, and events must render with no
session and stay indexable. Any new gate, redirect, or `session`-dependent render on
readable content is a bug. Public reach is the recruiting mechanism.

**Every write endpoint is rate limited.** Sign-in is the only gate, so rate limiting
and moderation are the entire spam defense. A new write path without one is
incomplete — flag it even if it "works."

**No verification tier.** "Verified" means OAuth email-verified, nothing more. A
`verificationState`, `isVerified`, or trust-level field is inventing a concept the
product doesn't have.

**Identity is sensitive.** Pseudonymity is supported. Location is coarse and
optional. **OAuth emails are never public.** Check that no new response, log line, or
serialized payload leaks an email or a precise location. This is a safety requirement
for this region, not a preference.

**Content is multilingual.** Posts/projects/events carry their own language tag,
independent of UI locale. Flag anything assuming one language per user or per page,
or hardcoding text direction.

**Auth is Better Auth**, not NextAuth/Auth.js. Imported NextAuth patterns are wrong
here even when they compile.

## Code conventions

- **Base UI, not Radix.** `@radix-ui/*` imports, `asChild`, or `React.forwardRef` in
  a component = wrong shape. Compare to `components/ui/button.tsx`.
- **Reuse before creation.** Did this add a component that duplicates an existing one,
  or that `npx shadcn@latest add` would have provided? A near-copy differing by a
  radius is the debt to catch here.
- **`components/ui/` is registry-managed.** App-specific composites belong in
  `components/`; `shadcn add` will overwrite `ui/`.
- **`cn()` everywhere**, never template-string class concatenation.
- **Semantic tokens only.** Any hex or raw palette colour (`bg-neutral-900`) opts out
  of theming — flag it.
- **Server Components by default.** Is `"use client"` on the smallest leaf that needs
  it, or did a whole page become client-side for one handler? The target user is on a
  mid-range Android phone on mobile data.
- **No `font-bold` on Shan text.** Both fonts are Regular only; bold is synthesized
  and distorts Myanmar marks.
- **Tailwind v4 is CSS-configured.** New tokens go in the `@theme inline` block in
  `app/globals.css`, not a JS config.

## Scope and docs

- **Is this justified against `design.md`?** Anything that can't be argued from the
  language-and-locality thesis is out of scope.
- **Is it building on a 🟡 or 🔴?** Those aren't decided. Building on one without
  asking is the error.
- **Did `AGENTS.md` need updating and not get updated?** This file has drifted from
  reality repeatedly — a doc that describes a file or behaviour that no longer exists
  actively misleads the next session. Check it in the same change.
- **Does the commit message follow the convention?** Type, scope, why-focused body,
  and the three `Deploy-*` trailers.

## Tests

- Would any new test fail if the behaviour broke? If you can't say yes, it isn't
  pulling its weight.
- New product rule (auth gate, rate limit, language handling) → is it covered?
- No snapshot tests of markup — they break on restyles and catch nothing.

## Verify before signing off

```bash
npm test
npm run lint
npm run build
```

Report what you actually ran. If you didn't run something, say so — don't imply a
check you skipped.
