"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Shares the collapsed flag with the nav items (server-rendered in LeftNav), which
// gate their hover tooltips on it: expanded, each item's text label is already
// visible, so a tooltip would just be noise.
export const NavCollapseContext = createContext(false);

// Holds only the open/closed flag. The nav itself stays a Server Component and
// arrives as children; collapsing is expressed in CSS off `data-collapsed`.
export function NavCollapse({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslations("Nav");

  return (
    <NavCollapseContext.Provider value={collapsed}>
      <TooltipProvider delay={100}>
        <div
          data-collapsed={collapsed}
          className={cn(
            "group/nav relative transition-[width] duration-200",
            collapsed ? "w-16" : "w-60",
          )}
        >
          {/* Straddles the sidebar's right-hand rule, as in the reference design. The
              tooltip stays whether open or collapsed — this control never gains a label. */}
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => setCollapsed((value) => !value)}
                  aria-expanded={!collapsed}
                  aria-label={t("toggleNav")}
                  className="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground absolute -top-2 -right-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border transition-colors"
                />
              }
            >
              <Menu className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="right">{t("toggleNav")}</TooltipContent>
          </Tooltip>
          <div className="px-3 pt-10">{children}</div>
        </div>
      </TooltipProvider>
    </NavCollapseContext.Provider>
  );
}
