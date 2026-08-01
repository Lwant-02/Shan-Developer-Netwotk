"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactElement } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReportReason } from "@/lib/reports";
import { cn } from "@/lib/utils";

// The reporter's half of the moderation loop (PBI-025). The `⋯` menu on posts, projects,
// and events has offered **Report** since PBI-010/020/021 with no dialog behind it.
//
// FRONTEND ONLY — the submit sends nothing. Filing a report is a write: it needs Better
// Auth (to know who reported) and a rate limit, because an unlimited report button is
// itself a harassment vector. Do not add a fetch here without both. The success state says
// plainly that nothing was submitted, so a reporter is never left believing help is coming.
//
// The reasons are the same fixed set the admin queue displays (`ReportReason`), read from
// the same `Report` message namespace — the reporter's options and the moderator's view
// cannot drift apart. Deliberately no free-text field: free text in a moderation queue is
// itself somewhere abuse gets written.
//
// `children` is the trigger, and is omitted when a caller drives the dialog with
// `open`/`onOpenChange` — the `⋯` menus do, because a `DialogTrigger` inside a menu popup
// is unmounted the moment the menu closes (the same reason the account menu is controlled).

// Roughly by severity, with the most-reported first and the catch-all last, so the common
// case is one glance away and nobody picks "Something else" out of impatience.
const REASONS: ReportReason[] = [
  "spam",
  "harassment",
  "hate",
  "violence",
  "privateInfo",
  "impersonation",
  "malware",
  "sexual",
  "offTopic",
  "other",
];

export function ReportDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("Report");
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setSubmitted(false);
          setReason(null);
        }
        onOpenChange?.(next);
      }}
    >
      {children ? <DialogTrigger render={children} /> : null}

      <DialogContent className="rounded-lg">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-normal">
                {t("successTitle")}
              </DialogTitle>
              <DialogDescription>{t("successBody")}</DialogDescription>
            </DialogHeader>
            <DialogClose
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full cursor-pointer font-normal",
              )}
            >
              {t("done")}
            </DialogClose>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-normal">{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>

            {/* One column, not a grid: the labels are sentences now, and a two-column
                grid wraps them into ragged two-line cells. Scrolls rather than pushing
                the actions off a short phone viewport. */}
            <div
              role="radiogroup"
              aria-label={t("reasonLabel")}
              className="-mx-1 flex max-h-[45vh] flex-col gap-1.5 overflow-y-auto px-1"
            >
              {REASONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={reason === value}
                  onClick={() => setReason(value)}
                  className={cn(
                    buttonVariants({
                      variant: reason === value ? "default" : "outline",
                    }),
                    "h-9 w-full cursor-pointer justify-start font-normal",
                  )}
                >
                  {t(`reason_${value}`)}
                </button>
              ))}
            </div>

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
                disabled={reason === null}
                onClick={() => setSubmitted(true)}
                className={cn(
                  buttonVariants(),
                  "h-9 font-normal disabled:pointer-events-none disabled:opacity-50",
                  reason !== null && "cursor-pointer",
                )}
              >
                {t("submit")}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
