"use client";

import { useEffect } from "react";

// Development-only. next-themes renders an inline <script> to set the theme before
// paint. On a locale switch, `app/[locale]/layout.tsx` re-delivers its subtree and
// React 19 re-reconciles that script on the client, logging "Encountered a script
// tag while rendering React component". The script already ran server-side and
// theming works, so the message is cosmetic — but it fires on every language toggle.
// Silence only that one message. Rendered only in development (gated in the layout),
// so production ships nothing.
const SUPPRESSED = "Encountered a script tag while rendering React component";

export function DevConsoleFilter() {
  useEffect(() => {
    const original = console.error;
    console.error = (...args: unknown[]) => {
      if (args.some((arg) => typeof arg === "string" && arg.includes(SUPPRESSED))) {
        return;
      }
      original(...args);
    };
    return () => {
      console.error = original;
    };
  }, []);

  return null;
}
