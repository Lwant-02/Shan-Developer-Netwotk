# PBI-006 — Decide locale routing

| | |
| --- | --- |
| **Status** | Done |
| **Created** | 2026-07-18 |
| **Decided** | 2026-07-18 |
| **Implemented by** | PBI-012 |

## Problem

`design.md` flagged locale routing as blocking: **retrofitting locale routing touches
every route**, so it had to be decided before routes were written. Two questions were
open — whether URLs carry a locale prefix, and what an anonymous visitor with no
stated preference gets.

## Decision

**Locale-prefixed URLs, with Shan (`shn`) as the default locale.**

- Both locales are prefixed: `/shn/...` and `/en/...`.
- `/` redirects to `/shn`.
- An anonymous visitor with no preference gets **Shan**.
- Launch locales are `shn` and `en`. Burmese (`my`) is deferred.

## Why this and not the alternative

The alternative — leaving the default locale unprefixed, so Shan lives at `/` and
only English is prefixed — produces shorter URLs for the default case. It was
rejected because an explicit prefix makes the language visible in **every shared
link**, which matters for a community that shares links in mixed-language contexts.
A URL that states its language is itself an expression of the thesis.

Defaulting to Shan rather than English follows directly: a Shan speaker should land on
Shan without configuring anything. English-first with Shan as an option would be the
afterthought treatment the project exists to avoid.

## Scope boundary

This decision covers **UI locale** only. It does not govern the **content** language
tag that posts, projects, and events each carry — that is a separate field on the
data model, and a user reading the UI in English must still be able to see
Shan-language content. Do not conflate the two.

## Notes

- Implementation is **PBI-012** (`next-intl`), deliberately split so the decision
  could be recorded without waiting on the build.
- Consequence to watch during implementation: `app/layout.tsx` currently hardcodes
  `<html lang="en">` while rendering Shan, which is wrong for both screen readers and
  search engines. PBI-012 fixes it.
