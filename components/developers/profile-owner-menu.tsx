"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Owner-only controls on a profile: **Edit** routes to `/settings` (PBI-024, which already
// edits exactly the fields this page renders), **Delete account** is destructive and
// confirms first.
//
// Rendered only when the viewer is looking at their *own* profile — the page decides that.
// `getViewer()` is `null` in production, so this ships nowhere on the live site; when
// Better Auth lands the same comparison becomes a real ownership check.
//
// FRONTEND ONLY: deleting does nothing. Account deletion is the most destructive write in
// the product and needs auth, a rate limit, and a decision about what happens to the
// member's posts, projects, and events — none of which exist yet. The dialog says so
// rather than leaving an admin-looking button that silently no-ops.
export function ProfileOwnerMenu() {
  const t = useTranslations("Profile");
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("manage")}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-8 shrink-0 cursor-pointer p-0 font-normal",
          )}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="cursor-pointer"
          >
            <Pencil />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setConfirming(true)}
          >
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle className="font-normal">
              {t("confirmDeleteTitle")}
            </DialogTitle>
            <DialogDescription>{t("confirmDeleteBody")}</DialogDescription>
          </DialogHeader>

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
              disabled
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "h-9 font-normal disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              {t("delete")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
