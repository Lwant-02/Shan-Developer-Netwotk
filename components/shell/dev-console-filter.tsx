"use client";

import { useEffect } from "react";

// Development-only. next-themes renders an inline <script> to set the theme before
// paint. React 19 re-reconciles that script on the client whenever the subtree that
// holds it is re-delivered — a locale switch, or navigating to a 404 (which unmounts
// `app/[locale]/layout.tsx` entirely) — logging "Encountered a script tag while
// rendering React component". The script already ran server-side and theming works,
// so the message is cosmetic. Silence only that one string.
const SUPPRESSED = "Encountered a script tag while rendering React component";

// Installed once per session and never torn down: the warning fires *during* the
// navigation that unmounts whichever component rendered this, so restoring
// console.error on unmount would re-expose exactly the 404/locale transitions we mean
// to cover. The module-level guard keeps remounts (and a second copy on the 404 page)
// from stacking wrappers.
let installed = false;

export function DevConsoleFilter() {
  useEffect(() => {
    if (installed) {
      return;
    }
    installed = true;

    const original = console.error;
    console.error = (...args: unknown[]) => {
      if (args.some((arg) => typeof arg === "string" && arg.includes(SUPPRESSED))) {
        return;
      }
      original(...args);
    };
  }, []);

  return null;
}
