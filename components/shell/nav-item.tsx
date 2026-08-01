"use client";

import type { ReactNode } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CollapsedNavTooltip } from "./collapsed-nav-tooltip";

// `"use client"` is forced by `usePathname`: the active item is whichever link
// matches the current route, and that can only be read on the client. `usePathname`
// here is locale-stripped ("/", "/about"), so it compares directly against `href`.
//
// The icon arrives as a rendered element, not a component, because a component
// reference can't cross the server→client boundary — LeftNav stays a Server Component
// and passes `<Icon />` down.

const base =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors group-data-[collapsed=true]/nav:justify-center group-data-[collapsed=true]/nav:px-0";
const hideOnCollapse = "group-data-[collapsed=true]/nav:hidden";

export function NavItem({
  icon,
  label,
  href,
}: {
  icon: ReactNode;
  label: string;
  href: string;
}) {
  const pathname = usePathname();

  const active = pathname === href;
  return (
    <CollapsedNavTooltip label={label}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        className={cn(
          base,
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <span className="shrink-0">{icon}</span>
        <span className={hideOnCollapse}>{label}</span>
      </Link>
    </CollapsedNavTooltip>
  );
}
