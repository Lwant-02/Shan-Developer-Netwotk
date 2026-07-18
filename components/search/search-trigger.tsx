"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const importPalette = () => import("./command-palette");

// kbar is only fetched once someone actually reaches for search. Mounting its provider
// app-wide would put the whole library on every page, including for the anonymous
// reader on mobile data who never opens it (PBI-012, CoS 9).
const CommandPalette = dynamic(
  () => importPalette().then((m) => m.CommandPalette),
  { ssr: false },
);

export function SearchTrigger() {
  const t = useTranslations("Nav");

  // A counter, not a boolean. The palette stays mounted once loaded, so re-opening it
  // needs a value that actually changes — a boolean is already `true` on the second
  // click, nothing re-renders, and the palette never reopens.
  const [openCount, setOpenCount] = useState(0);

  const open = useCallback(() => setOpenCount((count) => count + 1), []);

  // Fetch the chunk on hover/focus so the click doesn't wait on the network. The
  // module cache makes repeat calls free.
  const prefetch = useCallback(() => {
    void importPalette();
  }, []);

  // Until kbar is mounted nothing is listening for the shortcut, so the trigger owns
  // it. Once mounted, kbar's own binding takes over and this steps aside.
  useEffect(() => {
    if (openCount > 0) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        open();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openCount, open]);

  return (
    <>
      <button
        type="button"
        onClick={open}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className={cn(
          "text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors sm:hidden",
        )}
        aria-label={t("search")}
      >
        <Search className="size-5" />
      </button>

      <button
        type="button"
        onClick={open}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className="bg-muted text-muted-foreground hover:text-foreground mx-auto hidden h-10 w-full max-w-lg flex-1 cursor-text items-center gap-2 rounded-lg px-3 text-left text-sm transition-colors sm:flex"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">{t("search")}</span>
        <kbd className="border-border text-muted-foreground ml-auto hidden rounded-sm border px-1.5 py-0.5 text-[10px] md:inline">
          ⌘K
        </kbd>
      </button>

      {openCount > 0 && <CommandPalette openSignal={openCount} />}
    </>
  );
}
