"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const option =
  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1.5";

// Which option reads as active is decided in CSS off the `.dark` class, not in React
// state. The server can't know the visitor's theme, so a state-driven highlight would
// either mismatch on hydration or need a mounted guard that flashes the wrong one —
// and the repo's lint rejects the guard (`react-hooks/set-state-in-effect`).
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const { setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label={t("theme")}
      className={cn(
        "border-border flex w-full items-center rounded-lg border p-0.5 text-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          option,
          "bg-muted text-foreground dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground",
        )}
      >
        <Sun className="size-4 shrink-0 opacity-70" />
        {t("themeLight")}
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          option,
          "text-muted-foreground hover:text-foreground dark:bg-muted dark:text-foreground",
        )}
      >
        <Moon className="size-4 shrink-0 opacity-70" />
        {t("themeDark")}
      </button>
    </div>
  );
}
