# PBI-026 — Tasks

Breakdown of [PBI-026](./prd.md).

| # | Task | Status |
| --- | --- | --- |
| 1 | Add `react-share` | Done |
| 2 | Add `components/content/share-dialog.tsx` — Facebook / Telegram / Viber / LINE / X / LinkedIn buttons; no copy link — each button already carries the URL | Done |
| 3 | Turn `ShareButton` into the client trigger that lazy-loads the dialog (the `search-trigger.tsx` kbar pattern), prefetching on hover/focus | Done |
| 4 | Wire post, project, and event cards — build the canonical absolute URL server-side and drop the feed card's inline share button | Done |
| 5 | Add the `Share` message namespace — English in `en.json`, Shan in `shn.json` with key parity | Done |
| 6 | Add `__tests__/share-dialog.test.tsx` — the dialog opens anonymously, offers the locality-first networks, and carries no copy field | Done |
| 7 | Verify against CoS: `lint`, `build`, `test`, and confirm `react-share` is absent from the initial bundle of a card-rendering page | Done |

## Notes

- **Lazy-loading is a condition, not an optimisation** — the Share button is on every feed
  card, and the target user is on a mid-range Android on mobile data.
- **No share counts:** a third-party request per card, and a zero beside a member's post
  is discouraging.
- Network choice is a locality decision (Facebook / Telegram / Viber / LINE first), not
  the library's defaults.
