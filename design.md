# Shan Developer Network — Design

## What this is

Shan Developer Network exists to serve Shan-speaking developers in a way that global
platforms structurally cannot: **language and locality**. Shan-script content is
first-class, not an afterthought translation. Local developers are findable as a
group. The material is relevant to actually building software from Shan State. This
is the whole reason the project has a right to exist — GitHub, Stack Overflow, and
Discord already do everything else better than we ever will, and they will never do
this. Every feature in this document is justified against that sentence, and any
feature that cannot be is out of scope.

## The test

Before building anything, it has to answer: **why would someone use this instead of
the Facebook group, Telegram, Discord, or GitHub they already use?**

If the answer is "because it's in Shan" or "because it's local," build it. If the
answer is "because it's nicer than Discord," don't — that fight is unwinnable and
it isn't the point.

## Status legend

Labels are load-bearing. Don't build against a 🟡 as though it were a 🟢.

| | Meaning |
| --- | --- |
| 🟢 **Decided** | Ratified by the project owner. Build against it. |
| 🟡 **Proposed** | A recommendation awaiting a decision. May change. |
| 🔴 **Open** | Needs a decision before related work starts. |

## Product 🟢

A place where Shan developers **connect with each other** and share their work.

- **Profiles** — who you are, what you build.
- **Projects** — share what you've made.
- **Posts** — share writing, questions, updates.
- **Events** — members can host their own, including online sessions (e.g. someone
  runs an online AI discussion). Online-first, not conference-first.

### Permission model 🟢

| Visitor | Can |
| --- | --- |
| **Not signed in** | **Read only** — browse posts, projects, profiles, events. No interaction. |
| **Signed in** | Post, share projects, create events, interact. |

"Verified" here means email-verified via OAuth — see below. There is no separate
approval tier.

Read-only-for-anonymous is a deliberate and correct fit for the thesis: the content
must be public and indexable, or nothing pulls new people in. Value locked behind a
login can't recruit.

### Authentication 🟢

**Better Auth**, with **Google and GitHub OAuth**.

Google alongside GitHub is a better call than my earlier GitHub-only suggestion —
GitHub-only would have quietly excluded students and less-established developers,
which is a chunk of the intended audience.

> **Supersedes:** an earlier draft of this doc proposed deferring posts and
> discussion to a later phase on cold-start grounds. The owner has decided posts,
> projects, and events ship together. That decision stands; the residual cold-start
> risk is addressed under *Seeding* below rather than by delaying features.

### Post interactions 🟢 (decided)

**A single like, not up/down voting.** Posts (and later, comments) carry one
appreciation signal — a like, shown with a heart and a count — not a Reddit-style
up/down score or karma. PBI-010 deliberately left this open and shipped only a
display *slot*; the owner has now decided **like-only**, and PBI-016 replaced the
slot with a like control on both the feed card and the post detail page.

A like fits the thesis better than a vote: this is one small community trying to
encourage each other's work, not a ranking machine that buries the unpopular.
Downvotes invite exactly the pile-on dynamic the safety requirements exist to avoid.

Still **display-only until auth** — the count renders, but liking (like every write)
needs a signed-in user and a rate-limited endpoint. Whether the feed ever *ranks* by
likes is a separate, still-open question; the like is an expression, not yet a sort key.

## Language and script

This section is the product, not a localization checklist.

### Font 🟢 (chosen)

`aj06.ttf` was **replaced** by two fonts, both by the same designer:

- **`public/fonts/aj12.ttf` — "AJ 12"**, Jao Kunheing, 2024. **The Shan font.**
- **`public/fonts/aj00.ttf` — "A J Kunheing 00"**, JAO Kunheing (Nawone Sai).
  Kept as a secondary fallback.

Verified by reading the `cmap` and `name` tables of each binary:

| Check | `aj12.ttf` | `aj00.ttf` |
| --- | --- | --- |
| Myanmar block (U+1000–U+109F) | ✅ **116 codepoints** | 59 codepoints |
| Myanmar Ext-A | ✅ 8 | 7 |
| Basic Latin | 95/95 | 95/95 |
| U+1080 SHAN THA | ✅ | ❌ |
| U+108B–U+108D Council tones | ✅ | ❌ |
| U+108F SHAN RR | ✅ | ❌ |
| Weight | Regular only (`usWeightClass 400`) | Regular only |
| Embedding | `fsType = 0` | `fsType = 0` |

**aj12 resolves the missing-glyph problem** that was open against aj06 — it carries
SHAN THA, all three Council tone marks, and SHAN RR. That is why it leads the stack.

Remaining issue:

**🔴 Regular only — no bold, no italic, not variable**, in both fonts. For a
text-heavy reading site this bites: headings and `<strong>` in Shan get synthesized
faux-bold, which distorts Myanmar marks. Express emphasis with size, color, or
spacing rather than weight. Sourcing a bold weight is still worth asking about.

### Font loading 🟢 (wired) / 🔴 (not yet optimized)

Both fonts load via **`next/font/local`** in `app/layout.tsx` as `--font-aj12` and
`--font-aj00`. Shan text gets the right font through a **fallback stack** rather than
per-element classes, defined as `--font-sans` in `app/globals.css`:

```
Google Sans  →  aj12  →  aj00  →  sans-serif
```

The browser falls back **per glyph**, so a sentence mixing Shan and Latin renders
Google Sans for the Latin and AJ for the Shan with no markup, no `lang` attribute, and
no risk of untagged user content missing out. That last point is why a stack beats a
`:lang(shn)` rule here — content is user-generated and multilingual per string.

**🔴 Still to do:** the files are `.ttf` and ship together (~250 KB). **Subset and
convert to `.woff2`** — the audience is on mobile data, and this remains one of the
highest-leverage performance wins available. Consider whether aj00 is worth keeping
at all now that aj12 supersedes its coverage; dropping it halves the font payload.

### Zawgyi vs. Unicode 🟢 (decided)

The chosen fonts are Unicode-only, which effectively decides this: **store Unicode,
period.** **Decided: no Zawgyi detection or conversion.** Not in v1, not planned.
Revisit only if real users actually paste Zawgyi and complain.

### Locale routing 🟢 (decided and implemented)

**Decided: locale-prefixed URLs, with Shan (`shn`) as the default locale.** An
anonymous visitor with no preference gets Shan — `Accept-Language` is deliberately
not consulted. Implemented with `next-intl` in PBI-006: `/shn` and `/en`, `/`
redirects to `/shn`, both prerendered statically. Burmese (`my`) likely later.

This follows from the thesis: a Shan-speaking visitor should land on Shan without
configuring anything, and the URL should say which language the content is in. Note
this is UI locale only — content carries its own language tag, see below.

### Per-content language tagging 🟢 (decided)

Distinct from UI locale, and more important. Each **post/project/event carries its
own language tag**, because the community is genuinely multilingual and someone
posting in Shan should reach Shan readers without the UI locale hiding it. Enables
"show me Shan-language posts" — a direct expression of the thesis, and cheap.

## What "verified" means 🟢

**Verified = email-verified via OAuth. Signing in is enough to post.**

Since Google and GitHub both return a provider-verified email, there is no separate
verification tier and no approval queue. Anyone who signs in can post, share
projects, create events, and interact.

Consequences to build against:

- **There is no `verificationState` on Member.** Don't add one. The gate is simply
  "has a session."
- **There is no spam defense from auth**, so it has to come from elsewhere. Ship
  **rate limits** with the first write endpoint — per-user and per-IP, on posts,
  projects, events, and comments. This is not optional; an open post box with OAuth
  behind it will find spam.
- **Moderation is the backstop**, not the gate. Report + hide + ban must ship
  alongside posting, since nothing stops a bad post from being published first.
- If quality becomes a problem later, a badge (display-only trust marker) can be
  added without changing the permission model. An approval queue should be a last
  resort — an unstaffed queue silently kills signups.

## Additional recommendations 🟡

Answering "what else should a Shan developer network have" — each justified against
the thesis, roughly in order of value.

### Safety and pseudonymity — treat as a requirement, not a setting

A public, named, located directory of developers in Shan State carries real personal
risk given the region's conflict and post-2021 conditions. A naive "developer
network" design imports Western assumptions that don't hold here. Concretely:

- Support **pseudonymous profiles** as a first-class option, not a workaround.
- **Location granularity is opt-in and coarse** (state/region, never precise); allow
  "not shown".
- Let members be **unlisted** in the directory while still posting.
- **Never** expose the OAuth email publicly.
- Think hard before showing "who liked/attended this" publicly — attendance at a
  political-adjacent event is not neutral metadata.

This is cheap to build in now and near-impossible to retrofit after a leak.

### Shan technical glossary

Agreed Shan terms for *database*, *API*, *deploy*, and so on. Useful with zero other
users, and it's the purest expression of the thesis — the thing no global platform
will ever build. Small table, outsized value. **Check first whether a Shan technical
vocabulary effort already exists to align with rather than fork.**

### Telegram bridge — the cold-start answer

Telegram is where Myanmar tech conversation already lives. A bot mirroring new
posts/projects/events into a community channel meets people where they are and
drives them back to permanent, indexable pages. This is the highest-leverage
mitigation for launching with posts and events on day one: **don't wait for people
to discover the site — push to where they already are.**

### Mobile-first, low-bandwidth as a hard constraint

Mid-range Android on mobile data, with intermittent connectivity. This should
discipline every choice: keep the RSC-by-default posture, be ruthless about client
JS, aggressive image optimization, and make pages readable before hydration.

### Moderation tooling + rate limits

Since anyone signed in can post, these are mandatory rather than optional, and they
are the *only* line of defense: report, hide/remove, ban, plus per-user and per-IP
rate limits on every write. Ship them *with* posts, not after the first incident.

### Search — with a Myanmar-script caveat 🔴

Search across people/posts/projects. **Warning:** Shan and Burmese are written
**without spaces between words**, so Postgres's default full-text tokenizer will
segment it badly or not at all. Naive `to_tsvector('simple', ...)` will disappoint.
Needs real investigation (ICU segmentation, n-grams, or a dedicated engine) — do not
assume standard FTS works.

### Smaller, cheap wins

- **RSS/Atom feeds** — developers still use them; near-free with App Router.
- **Timezone care for events** — Myanmar is **UTC+06:30**, a half-hour offset that
  naive timezone code routinely mangles. Store UTC, render local.
- **Code of conduct** — needed the day strangers can post.
- **Jobs board** — natural v2; makes the directory pay for itself.

## Architecture

### Current 🟢 (as built)

Next.js 16.2 App Router · React 19.2 · TypeScript strict · Tailwind v4 (CSS-first) ·
shadcn `base-nova` on **Base UI** (not Radix). Gotchas: [`AGENTS.md`](./AGENTS.md).

### Decided 🟢

- **Database: Neon** (Postgres). Better Auth needs a Postgres anyway.
- **Hosting: Vercel.** `main` deploys to production, `dev` to previews — see
  `AGENTS.md` and the `deploy-dev` / `deploy-prod` skills.
- **Content:** posts/projects/events/profiles in Postgres. Curated resources and the
  glossary can be MDX in-repo (free versioning and review via git). 🟡 — the MDX half
  is still a proposal.

Neon over Supabase means storage and image handling are **not** bundled and will need
a separate answer when profile avatars or post images arrive. Not urgent, but don't
assume it's covered.

### Data model sketch 🟡

Thin on purpose — enough to start, not a schema.

- **Member** — handle, display name (Shan + Latin), pronouns, bio (per-locale),
  coarse location (optional), skills, links, OAuth identities, `listed`,
  `pseudonymous`. *(No verification state — signing in is the gate.)*
- **Project** — owner, title, description, language tag, repo/demo links, tags.
- **Post** — author, body, **language tag**, tags, timestamps, moderation state.
- **Event** — host, title, description, **start UTC**, timezone, online/physical,
  join link, language tag.
- **GlossaryTerm** — English term, Shan term, definition, notes.
- **Report** — target, reporter, reason, state.

## Design system

Conventions live in [`AGENTS.md`](./AGENTS.md). Two decisions belong here:

### Brand color 🟢 (decided)

**Decided: monochrome — greyscale, dark only.** The greyscale palette in
`globals.css` is the intended one, not a placeholder: every token is zero-chroma
`oklch`, and that stays. The UI ships a single dark surface (see Theme below), so the
`.dark` block is the palette that actually renders.

Monochrome puts the emphasis on the typography, which is where this project's identity
actually lives — Shan script rendering correctly is the point, not a brand hue.

One consequence to design around: with no accent colour, **state has to be carried by
weight, size, spacing, and borders**. That constraint bites harder than usual here,
because the Shan fonts are Regular only — so no bold either. Contrast and layout do
all the work.

### Theme 🟢 (decided: dark only — reversed 2026-07-20)

**Decided: dark only.** The call has flipped twice: light-only
([PBI-003](docs/delivery/003/prd.md), `Won't Do`) → light + dark
([PBI-011](docs/delivery/011/prd.md), built with `next-themes` + a toggle) → **dark
only** ([PBI-013](docs/delivery/013/prd.md), which removed that machinery). Each
superseded PBI is kept as a record so the history stays readable.

The argument that carried it: a single opinionated dark surface matches the
developer-tool aesthetic, and the audience is on mid-range Android where OLED panels
make a reading-heavy dark feed the sensible default. Dropping the switcher also drops
a client provider, a pre-paint script, and the console-warning workaround that script
forced.

- The greyscale palette lives in **`:root`** in `globals.css`; there is no `.dark`
  block and no theme class. Nothing in React touches it, so the palette is invariant.
- The `dark` variant is deliberately **unconditional** (`@custom-variant dark (&)`),
  because `components/ui/*` is registry-managed and ships `dark:` utilities that must
  keep applying. Don't edit those files.
- No `next-themes`, no toggle, no OS-preference read, no persisted choice — every URL
  renders identically, which keeps pages statically prerendered.
- **404 pages render outside the locale layout**, but they still inherit `:root`, so
  they need no special handling here — unlike the font variables, which they do have
  to re-declare (see the 404 notes in `AGENTS.md`).

## Governance 🟡 (deferred)

**Deferred by the owner — not required for now.** Recorded rather than dropped,
because the underlying risk doesn't go away:

Sign-in is the only gate, so rate limiting and moderation remain the entire spam
defense. Deferring governance means the **technical** controls carry the whole load
until a human process exists — which makes the rate limits on write
endpoints load-bearing rather than routine.

Revisit before public launch, or the first time someone posts something that needs
removing and there's no answer for who removes it. Open at that point: who moderates
and how fast, who curates the glossary, who writes the code of conduct.

## Open questions

Still open:

1. **Is there a bold weight of A J Kunheing available?** Both fonts are
   `usWeightClass 400`, so all bold on Shan is faux-bold today. Worth asking AJ
   directly — see `public/fonts/CREDITS.md` for contact routes.
2. **Brand color.** Greyscale monochrome for now, on the dark surface. Whether to
   introduce a single accent hue is still open.
3. **Search on Myanmar script.** Shan and Burmese are written without spaces, so
   Postgres's default tokenizer will segment badly. Needs real investigation.
4. **Does a Shan technical-vocabulary effort already exist** to align the glossary
   with?
5. **Is there an existing community to seed from**, or is this cold-start from zero?
6. **Image and file storage.** Neon is Postgres only — unlike Supabase it doesn't
   bundle storage. Needed before avatars or post images.

### Resolved

| Question | Outcome |
| --- | --- |
| Missing Shan glyphs (SHAN THA, Council tones, SHAN RR) | **Resolved** — `aj12.ttf` carries all of them; verified from the `cmap` table. It leads the font stack. |
| Who authored the font, under what terms | **AJ (Jao Kunheing / Nawone Sai)**, built free for the Shan community. Sources: [ajfonts](https://ajfonts.netlify.app/), [Shan Font Library](https://shan-font-library.vercel.app/). Attribution recorded in `public/fonts/CREDITS.md`. |
| Locale-prefixed URLs? Default locale? | **Yes, prefixed. Shan (`shn`) is the default.** |
| Theme | **Dark only** (PBI-013, reversed 2026-07-20). Greyscale `.dark` pinned on, no toggle. Supersedes PBI-011 (light + dark), which superseded PBI-003 (light-only). |
| Zawgyi detection/conversion | **No.** Store Unicode, period. |
| Database | **Neon** (Postgres). |
| Hosting | **Vercel.** |
| Per-content language tagging | **Yes** — content language is independent of UI locale. |
| Who moderates, and how fast | **Deferred**, not answered. See Governance. |
| Data model | Deferred — revisit when the first feature needs a schema. |
