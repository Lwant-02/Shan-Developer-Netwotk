"use client";

import { Flag, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ReportDialog } from "@/components/content/report-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Report opens the reason dialog (PBI-025); it still sends nothing, since filing a report
// is a write needing auth and a rate limit. Edit and delete stay display-only — they need
// auth plus ownership (owner-only when auth lands).
//
// The dialog is driven by state rather than a `DialogTrigger` inside the popup: the menu
// unmounts its items on close, which would take the trigger — and the dialog — with it.
export function PostMenu() {
  const [reporting, setReporting] = useState(false);
  const t = useTranslations("Post");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("more")}
          className="text-muted-foreground hover:bg-background hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setReporting(true)}
          >
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
      <ReportDialog open={reporting} onOpenChange={setReporting} />
    </>
  );
}
