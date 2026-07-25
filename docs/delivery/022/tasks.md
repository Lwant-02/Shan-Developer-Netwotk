# PBI-022 — Tasks

Derived from the PRD's Conditions of Satisfaction. Frontend-only: no persistence,
no endpoint. Owner agreed the markdown-toolbar approach (not a WYSIWYG library).

| # | Task | CoS | Status |
| --- | --- | --- | --- |
| 1 | `lib/markdown.ts` — pure `applyMarkdown(value, start, end, action)` for the toolbar (inline code, code block, bullet/ordered list, blockquote), plus `toUtcISO(local)` for event times. Unit-tested. | 3, 5 | Done |
| 2 | `MarkdownEditor` client leaf — textarea + formatting toolbar; buttons call `applyMarkdown` and restore selection. Shan renders in the AJ font; no faux-bold. | 3, 7 | Done |
| 3 | Shared `CreateForm` client component — one shell (title, body via MarkdownEditor, language tag, publish/cancel) rendering type-specific fields for post / project / event. Publish wrapped in the sign-in gate. | 2, 4, 6 | Done |
| 4 | Type-specific fields mapped to the models: post (title/body/lang); project (title/description/links/tags/lang); event (title/description/start-UTC/online/location/join/register/lang). | 4, 5 | Done |
| 5 | Routes `app/[locale]/create/[type]/page.tsx` (post\|project\|event, else 404) + bare `/create` → post; server shell renders `CreateForm`. Prerendered per type. | 1, 7 | Done |
| 6 | Wire the top-nav Create control → dropdown menu (New post / project / event) routing to the create routes; it is no longer a dead affordance. | 1 | Done |
| 7 | `Create` messages in `en.json` + `shn.json` with key parity; Shan translated or flagged. | 8 | Done |
| 8 | Tests: `applyMarkdown` inserts each markdown form; `toUtcISO` is not naive; the composer renders for an anonymous visitor and Publish routes to the sign-in gate. | 3, 5, 6 | Done |
| 9 | Verify CoS one by one — `npm test`, `npm run lint`, `npm run build`; confirm frontend-only (Publish persists nothing) and Shan/anonymous behaviour. | all | Done |

## Notes / decisions taken at implementation

- **Markdown does not yet render on the read pages.** Frontend-only means nothing the
  composer emits reaches a detail page (those still show plain mock text), so a markdown
  renderer is deliberately out of scope here — deferred to when real content persists
  (a sibling of the future write-endpoint PBI). Recorded in the PRD.
- **Optional photo is a client-side picker only** (preview + remove, 5 MB cap), mirroring
  the feedback dialog — nothing is uploaded, because server-side image storage is an Open
  Question. Each model already carries an optional `image` for when storage exists.
- **The rate-limit dependency** for the eventual write endpoint is carried in the PRD,
  not implemented (no endpoint here).
