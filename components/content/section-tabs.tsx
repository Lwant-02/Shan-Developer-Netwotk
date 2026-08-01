"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// The shared label + count + panel switcher: the profile's Posts / Projects / Events tabs
// (PBI-017) and the admin queue's type filter (PBI-025). `"use client"` is forced by one
// thing only — `useState` + the tab `onClick`. Each panel's content is rendered on the
// server and passed in as `content`, so the lists stay Server Components; only the toggle
// ships as client JS. No bold on the active tab (labels can be Shan) — a border and colour
// carry the selected state instead.
export type SectionTab = {
  key: string;
  label: string;
  count: number;
  content: ReactNode;
};

export function SectionTabs({ tabs }: { tabs: SectionTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" className="border-border flex gap-1 border-b">
        {tabs.map((tab) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.key)}
              className={cn(
                "-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors",
                selected
                  ? "border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              {tab.label}
              <span className="text-muted-foreground text-xs tabular-nums">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div key={tab.key} role="tabpanel" hidden={active !== tab.key}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
