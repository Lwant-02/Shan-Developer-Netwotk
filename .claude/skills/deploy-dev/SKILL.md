---
name: deploy-dev
description: Deploy this project to a Vercel preview (dev) environment. Use when asked to deploy to dev/staging/preview, ship a preview build, or get a shareable URL for review. For production use deploy-prod instead.
---

# Deploy to preview (dev)

Creates a **preview** deployment — a unique URL, not the production domain. Safe and
non-destructive: it never touches the live site, and previews can be redeployed
freely.

> **Setup is not complete yet.** The repo has no `.vercel/`, no `vercel.json`, and
> the Vercel CLI is not installed. Work through "First-time setup" below once the
> owner has granted Vercel access. Do not invent a project name or IDs.

## First-time setup (once per machine)

```bash
npm i -g vercel     # or use npx vercel throughout
vercel login
vercel link         # interactive: pick the scope + project
```

`vercel link` writes `.vercel/project.json` (git-ignored, machine-local — this is
correct, don't commit it).

If the project needs environment variables, pull them after linking:

```bash
vercel env pull .env.local
```

`.env*` is git-ignored. **Never commit secrets, and never print pulled env values
into the transcript** — this project treats identity data as sensitive.

## Preflight

**This skill deploys the `dev` branch only.** Check first:

```bash
git rev-parse --abbrev-ref HEAD    # must be: dev
```

If you are **not** on `dev`, stop and tell the user which branch they're on. Do not
deploy anyway and do not switch branches on their behalf — they may have work in
progress. Feature branches get merged into `dev` first; `dev` is what previews.

If you are on `main`, this is the wrong skill entirely — `main` is production, and
that's `deploy-prod`.

Then catch failures locally; a broken build wastes a remote round trip.

```bash
npm run lint
npm run build
```

Both must pass. If `build` fails, fix it before deploying — do not deploy "to see if
it works on Vercel."

## Deploy

```bash
vercel deploy
```

Prints a preview URL. Report that URL back to the user — it's the whole point of the
deployment.

To deploy the current working tree including uncommitted changes, that's the default
behavior. Note the tree state in your summary if it's dirty, so the user knows the
preview doesn't match any commit.

## After deploying

- Give the user the preview URL.
- Sanity-check that the page actually renders — a Next.js build can succeed and still
  fail at request time (Server Component errors, missing env vars). Fetch the URL or
  ask the user to look.
- If it 500s, get the logs: `vercel logs <deployment-url>`

## Notes for this project

- **Verify Shan text renders** on any preview involving typography or fonts. Fonts
  are loaded via `next/font/local` from `public/fonts/`; a missing file fails at
  build, but a wrong fallback fails silently and only shows up visually.
- **Check on a narrow viewport.** The target user is on a mid-range Android phone;
  desktop-only verification misses the case that matters.
- Preview deployments are **publicly reachable by default**. Since all content here
  is meant to be publicly readable that's usually fine, but don't preview anything
  containing real user data.

## Do not

- Don't run `vercel --prod` here — that is production. Use the `deploy-prod` skill,
  which has the required confirmation gates.
- Don't commit `.vercel/` or `.env.local`.
