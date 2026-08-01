"use client";

import { Check, MoreHorizontal, Trash2, UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Report } from "@/lib/reports";
import { cn } from "@/lib/utils";

// The `⋯` menu on a report row, matching `post-menu.tsx`. Dismiss resolves immediately;
// the two destructive actions confirm first, because deleting someone's work and banning
// a member are not things to do on a mis-click.
//
// **Nothing is persisted.** Resolving removes the row from the queue in local state and
// that is all — the real actions are writes needing Better Auth and a rate limit, and an
// agreed moderation policy (PBI-005, Deferred). The confirm dialog says so in as many
// words, so an admin is never left believing a takedown happened.

export type ReportAction = "dismiss" | "delete" | "ban";

export function ReportActions({
  report,
  onResolve,
}: {
  report: Report;
  onResolve: (action: ReportAction) => void;
}) {
  const t = useTranslations("Admin");
  const [confirming, setConfirming] = useState<"delete" | "ban" | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("actions")}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onResolve("dismiss")}
          >
            <Check />
            {t("actionDismiss")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setConfirming("delete")}
          >
            <Trash2 />
            {t("actionDelete")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setConfirming("ban")}
          >
            <UserX />
            {t("actionBan")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle className="font-normal">
              {confirming === "ban"
                ? t("confirmBanTitle")
                : t("confirmDeleteTitle")}
            </DialogTitle>
            <DialogDescription>
              {confirming === "ban"
                ? t("confirmBanBody", { handle: report.targetAuthor })
                : t("confirmDeleteBody", { title: report.targetTitle })}
            </DialogDescription>
          </DialogHeader>

          {/* The honest part: an admin must not walk away believing content came down. */}
          <p className="text-muted-foreground text-xs leading-relaxed">
            {t("notWired")}
          </p>

          <DialogFooter>
            <DialogClose
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-9 cursor-pointer font-normal",
              )}
            >
              {t("cancel")}
            </DialogClose>
            <button
              type="button"
              onClick={() => {
                onResolve(confirming === "ban" ? "ban" : "delete");
                setConfirming(null);
              }}
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "h-9 cursor-pointer font-normal",
              )}
            >
              {confirming === "ban" ? t("actionBan") : t("actionDelete")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
