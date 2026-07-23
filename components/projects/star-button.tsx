import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

// The star control — a single appreciation signal, mirroring the feed's LikeButton.
// Display-only until auth: the count renders, but starring is a write and needs a signed-in
// user plus a rate limit. Shared by the project card and the detail page; `className` lets
// the card add its hover-group coupling.
export function StarButton({
  stars,
  className,
}: {
  stars: number;
  className?: string;
}) {
  const t = useTranslations("Projects");

  return (
    <button
      type="button"
      aria-label={t("star")}
      className={cn(
        "text-muted-foreground bg-muted hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors",
        className,
      )}
    >
      <Star className="size-4" />
      <span className="tabular-nums">{stars}</span>
    </button>
  );
}
