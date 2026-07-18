# PBI-009 — Moderation policy and code of conduct

| | |
| --- | --- |
| **Status** | Deferred |
| **Created** | 2026-07-18 |
| **Deferred** | 2026-07-18 |

## Status

**Deferred by the owner.** Recorded rather than dropped, because the underlying risk
does not go away by not writing it down.

## Problem

`design.md` framed this as urgent and non-optional: who moderates, and how quickly?
Who curates the glossary? Who writes the code of conduct?

Since anyone signed in can post, moderation was one of the two lines of defense. With
it deferred, the **technical** controls carry the entire load — which is what makes
PBI-008 (rate limiting) load-bearing rather than routine.

The original framing, kept here because it's the argument for revisiting: this reads
as a non-engineering concern and is in fact what determines whether the site is alive
in a year.

## When to revisit

Whichever comes first:

1. **Before public launch.**
2. The first time someone posts something that needs removing and there is no answer
   for who removes it, under what rule, or how fast.
3. When a second person joins the project — moderation is unworkable as an
   undocumented solo instinct.
4. When PBI-011 (contributor onboarding) ships, since a code of conduct is part of
   what collaborators expect to find.

## What it would need to answer

- Who moderates, and what response time is realistic?
- What are the actual rules — what gets removed, what gets a warning?
- How does a user report something? (`design.md`'s data model sketch already
  anticipates a `Report` entity.)
- Is there an appeal?
- Who curates the glossary, which is a smaller version of the same question?

## Notes

- Rate limiting (PBI-008) slows bulk abuse. It does nothing about a single account
  posting one thing that has to come down. These are different problems.
- Identity is sensitive in this region — pseudonymity is supported, and moderation
  processes that require real identity to appeal would undermine that. Any policy
  written here has to hold that line.
