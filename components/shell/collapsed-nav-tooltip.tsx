"use client";

import { useContext, type ReactElement } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavCollapseContext } from "./nav-collapse";

// Wraps a nav item in a hover tooltip only while the rail is collapsed; expanded, the
// item's text label is visible so the tooltip would be redundant. `children` is the
// item's own element (Link or span), used as the tooltip anchor when collapsed.
export function CollapsedNavTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  const collapsed = useContext(NavCollapseContext);

  if (!collapsed) {
    return children;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
