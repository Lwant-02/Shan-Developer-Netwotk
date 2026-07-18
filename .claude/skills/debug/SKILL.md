---
name: debug
description: Systematically diagnose a bug, error, failing test, or unexpected UI behaviour in this repo. Use when something is broken, throwing, rendering wrong, or not behaving as expected — before attempting a fix.
---

# Debugging

The failure mode to avoid is **guess-patching**: changing something plausible, seeing
the symptom move, and calling it fixed. That buries the bug instead of removing it.
Find the mechanism first.

## The loop

**1. Reproduce it, exactly.**

Get a deterministic repro before changing any code. What command, what URL, what
input, what viewport? If you can't reproduce it, you cannot know you fixed it — say
so rather than guessing.

**2. Read the actual error.**

The full stack trace, not the last line. In Next the useful frame is often several
lines down, and the top frame is framework internals. For a build failure, read the
whole output — Next reports the offending file and often the exact export.

**3. Locate the mechanism before touching anything.**

State the causal chain out loud: *"the request hits X, which calls Y, which returns
undefined because Z."* If you can't fill that in, keep reading code. Add a temporary
`console.log` at the boundary you're unsure about — and remove it before finishing.

**4. Write a failing test if the bug is testable.**

`npm test`. A red test that captures the bug is the cheapest possible guarantee it
won't come back. Skip this only for genuinely visual bugs.

**5. Fix the cause, not the symptom.**

Suppressing an error, adding an optional chain, or wrapping in try/catch to make a
crash go away is not a fix unless the missing value is genuinely expected.

**6. Verify.**

Re-run the repro from step 1, plus `npm test`, `npm run lint`, and `npm run build`.
Then confirm you didn't just move the problem.

## Where bugs in this repo actually come from

Check these before deep investigation — they account for most surprises here:

- **Radix patterns on Base UI components.** shadcn here is Base UI. `asChild`,
  `forwardRef`, or a `@radix-ui/*` import will fail in confusing ways. Compare
  against `components/ui/button.tsx`.
- **Server/Client boundary.** "useState is not defined", "Event handlers cannot be
  passed to Client Component props", hydration mismatches — all mean a component
  needs `"use client"`, or that a Server Component is being passed a function.
- **Styling that silently does nothing.** A hardcoded colour won't theme. A class
  applied without `cn()` may be silently overridden by a conflicting utility. Tailwind
  v4 has no JS config — a token added to a nonexistent `tailwind.config.js` does
  nothing.
- **Dark mode looks broken because it *is* broken.** No `.dark` palette block exists
  yet. Don't debug it as if it were configured.
- **Shan text renders wrong.** Montserrat has no Myanmar coverage. Text renders in a
  fallback unless it opts into the Shan font. Bold on Shan is faux-bold and distorts
  marks — the fonts are Regular only.
- **`* { cursor: pointer }`** in `globals.css` affects every element. If cursor
  behaviour is the bug, that's why.
- **Stale `AGENTS.md`.** It has drifted from reality before. If a documented file or
  behaviour doesn't match what you find, **trust the code** and flag the doc.

## Diagnostic commands

```bash
npm test                  # unit tests, single run
npm run lint              # eslint
npx tsc --noEmit          # type errors alone, faster than a full build
npm run build             # catches Server Component + import errors
npm run dev               # reproduce in the browser
```

## When you're stuck

Say so, and report what you ruled out. Do not ship a speculative fix described as a
real one. If you have a hypothesis you can't confirm, label it a hypothesis.
