"use client";

import { Flag, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// The event's ⋯ menu, mirroring the feed's PostMenu. Display only, like the rest of the
// controls — report needs moderation (PBI-005, deferred) and edit/delete need auth plus
// ownership (owner-only when auth lands). The menu exists so the affordance is designed;
// nothing is wired.
export function EventMenu() {
  const t = useTranslations("Events");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("more")}
        className="text-muted-foreground hover:bg-background hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>
          <Flag />
          {t("report")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
