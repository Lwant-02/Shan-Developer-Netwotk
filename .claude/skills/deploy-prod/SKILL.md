---
name: deploy-prod
description: Deploy this project to Vercel production — the live public site. Use only when explicitly asked to deploy to production/prod/live, or to promote a preview. Requires explicit user confirmation before shipping.
---

# Deploy to production

This publishes to the **live public site**. Treat it as outward-facing and hard to
reverse: once it's up it can be seen, crawled, and indexed, and a rollback does not
un-see it.

> **Setup is not complete yet.** No `.vercel/`, no `vercel.json`, no Vercel CLI, and
> no production domain is recorded anywhere in the repo. Complete the setup in the
> `deploy-dev` skill first (`vercel login` + `vercel link`). Do not guess a project
> name, org ID, or domain.

## Hard rule: confirm before shipping

**Never run the production deploy as a side effect of another task.** Deploy only
when the user has asked for production specifically, in this turn. If they said
"deploy" without qualifying it, ask which environment — assume preview, not prod.

Before the deploy command, show the user:

- the branch and short SHA being deployed
- the commit subject
- whether the working tree is dirty
- what changed since the current production deployment, if determinable

Then get an explicit go-ahead. One approval covers one deploy, not future ones.

## Preflight — all must pass

```bash
git status --short          # must be clean
git rev-parse --abbrev-ref HEAD
git log -1 --oneline
npm run lint
npm run build
```

Stop and report if any of these fail:

- **Dirty working tree.** Never deploy uncommitted changes to production — what's
  live must correspond to a commit that exists in the repo.
- **Lint or build failure.** Non-negotiable.
- **Not on `main`.** **`main` is the only branch that deploys to production.** If
  `HEAD` is anything else, stop — no exceptions, no "confirm and proceed." Ship it by
  merging into `main` first. Never switch branches on the user's behalf to satisfy
  this check.
- **Unpushed commits.** Push first, so the deployed SHA is recoverable by others.

## Branch model

```
pbi/* and feature/* → dev → main
             │      │
             │      └─ production (this skill)
             └──────── preview (deploy-dev skill)
```

`dev` is the integration branch and previews via `deploy-dev`; `main` is production.
Production changes reach `main` through `dev` — going straight from a feature branch
to `main` skips the preview that would have caught the problem.

> **Note:** Vercel's Git integration is not configured yet. If it gets connected
> later, pushes to `main` will deploy automatically and a manual CLI deploy from a
> laptop can race it. Confirm which mechanism is authoritative before using this
> skill in that setup.

## Deploy

```bash
vercel deploy --prod
```

Prefer **promoting an already-verified preview** over building fresh for production,
when a good preview exists — same artifact, already checked:

```bash
vercel promote <preview-deployment-url>
```

## After deploying

1. **Verify the live site loads.** Fetch the production URL and confirm a real
   response, not just a successful build.
2. **Check anonymous access.** Open the site logged out. Posts, projects, profiles,
   and events must render without a session — public read access is a product
   requirement here, and auth misconfiguration is exactly the kind of regression that
   only appears in prod.
3. **Check Shan text renders** in the real environment.
4. **Watch for errors:** `vercel logs <production-url>`
5. **Report to the user**: the live URL, the deployed SHA, and what you verified.

## Rollback

If something is wrong, roll back immediately — diagnose afterward, not while the site
is broken:

```bash
vercel rollback              # revert to the previous production deployment
vercel ls                    # list deployments if you need a specific target
```

Tell the user you rolled back and why.

## Do not

- Don't deploy to prod without explicit, current confirmation.
- Don't deploy a dirty tree or a failing build.
- Don't print secrets or pulled env values into the transcript.
- Don't add a production domain, env var, or project ID to a committed file based on
  a guess — ask the owner.
