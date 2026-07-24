# PBI-021 — Tasks

Breakdown of [PBI-021](./prd.md). Mirrors PBI-020 (Projects surface) closely.

| # | Task | Status |
| --- | --- | --- |
| 1 | Extend `lib/events.ts`: add optional `joinUrl`, `listEvents()` + `getEventBySlug()` helpers, join URLs on online events, and one **past** event so upcoming/past both render | Done |
| 2 | Redesign `EventCard` to link to `/events/[slug]` (stretched title link + hover), keeping the profile use working | Done |
| 3 | Add `EventList` — single column, ordered by start time, **upcoming vs past** split | Done |
| 4 | Add `/events` directory route (`app/[locale]/events/page.tsx`) — header + list + empty state + `generateMetadata` | Done |
| 5 | Add `/events/[slug]` detail route — host (`HandleLink`), full description, local-rendered time **with timezone**, online/physical, coarse location, Join link for online, back link, `generateStaticParams`/`generateMetadata` | Done |
| 6 | Enable the "Events" nav item in `left-nav.tsx` (`href: "/events"`) | Done |
| 7 | Add `Events` message namespace — English in `en.json`, `TODO(shn)` placeholders in `shn.json` for owner/Gemini review (`npm run i18n:prompt`) | Done |
| 8 | Add `__tests__/events.test.tsx` — surface renders for an anonymous visitor; Shan chrome survives | Done |
| 9 | Verify against CoS: `lint`, `build`, `test`, run app logged out; close out PBI | Done |
| 10 | Follow-up (owner): upcoming/past **badge** on the card + an interactive **filter** (`EventsBrowser`, replacing the static section split) | Done |
| 11 | Follow-up (owner): add a **posted date** (`createdAtISO`) to events **and** projects — shown on both cards and detail pages | Done |

## Notes

- The only new mock field is `joinUrl` (online events). Upcoming/past is **derived** from
  `startsAtISO`, not stored.
- Timezone: store UTC ISO, render local via `Intl` (`useFormatter`/`getFormatter`); the
  detail page shows the timezone name so the offset (Myanmar UTC+06:30) is legible.
- Shan chrome ships as `TODO(shn)` placeholders pending owner review — English is wired.
