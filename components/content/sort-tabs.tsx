"use client";

import { useTranslations } from "next-intl";

import { type SortKey } from "@/lib/sort";
import { cn } from "@/lib/utils";

// The shared sort control for the feed, projects, and events directories — a segmented pill
// group matching the app's other tab controls, so all three surfaces sort identically. The
// three keys are fixed and the same everywhere, so they live here rather than as props.
// `"use client"` comes from the click handlers; the parent browser owns the state.
const ORDER: SortKey[] = ["newest", "popular", "oldest"];

export function SortTabs({
  value,
  onChange,
  className,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
  className?: string;
}) {
  const t = useTranslations("Sort");

  return (
    <div
      className={cn(
        "bg-muted flex w-fit items-center gap-1 rounded-lg p-1 text-sm",
        className,
      )}
    >
      {ORDER.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={value === key}
          className={cn(
            "cursor-pointer rounded-lg px-3 py-1.5 transition-colors",
            value === key
              ? "bg-background text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(key)}
        </button>
      ))}
    </div>
  );
}
