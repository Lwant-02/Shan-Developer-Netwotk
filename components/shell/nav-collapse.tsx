"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

// Holds only the open/closed flag. The nav itself stays a Server Component and
// arrives as children; collapsing is expressed in CSS off `data-collapsed`.
export function NavCollapse({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslations("Nav");

  return (
    <div
      data-collapsed={collapsed}
      className={cn(
        "group/nav relative transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Straddles the sidebar's right-hand rule, as in the reference design. */}
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-expanded={!collapsed}
        aria-label={t("toggleNav")}
        className="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground absolute -top-2 -right-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border transition-colors"
      >
        <Menu className="size-4" />
      </button>
      <div className="px-3 pt-10">{children}</div>
    </div>
  );
}
