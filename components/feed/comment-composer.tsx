import { useTranslations } from "next-intl";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The "add a comment" affordance. Reading is open; commenting is not — so this is a
// sign-in gate: a short prompt and a CTA, nothing more. It never asserts a logged-in
// identity. A real composer needs auth plus a rate-limited write endpoint (later PBIs).
// The dialog trigger arrives as `children`, so this stays a Server Component and only the
// dialog leaf is client JS.
export function CommentComposer() {
  const t = useTranslations("PostDetail");

  return (
    <div className="border-border bg-card flex flex-col items-center text-center justify-center gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-sm leading-relaxed">
        {t("composerHint")}
      </p>
      <SignInDialog>
        <button
          type="button"
          className={cn(
            buttonVariants({ size: "default" }),
            "shrink-0 cursor-pointer font-normal h-9",
          )}
        >
          {t("signInToComment")}
        </button>
      </SignInDialog>
    </div>
  );
}
