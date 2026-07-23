import { MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { FeedbackDialog } from "./feedback-dialog";

// The site-wide entry point for the feedback dialog: a fixed icon button pinned to the
// bottom-right, mounted once in the shell. Stays a Server Component — the trigger is
// plain markup handed to the client dialog as `children` (the PBI-014 pattern).
export function FeedbackLauncher() {
  const t = useTranslations("Feedback");

  return (
    <FeedbackDialog>
      <button
        type="button"
        aria-label={t("launch")}
        className={cn(
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "fixed right-4 bottom-10 z-40 flex size-12 cursor-pointer items-center",
          "justify-center rounded-lg shadow-lg transition-colors sm:right-6",
        )}
      >
        <MessageSquarePlus className="size-5" />
      </button>
    </FeedbackDialog>
  );
}
