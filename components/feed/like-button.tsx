import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

// The like control — one appreciation signal, not up/down voting (design.md, decided in
// PBI-016). Display-only until auth: the count renders, but liking is a write and needs a
// signed-in user plus a rate limit. Shared by the feed card and the post detail page;
// `className` lets the card add its hover-group coupling.
export function LikeButton({
  likes,
  className,
}: {
  likes: number;
  className?: string;
}) {
  const t = useTranslations("Post");

  return (
    <button
      type="button"
      aria-label={t("like")}
      className={cn(
        "text-muted-foreground bg-muted hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors",
        className,
      )}
    >
      <Heart className="size-4" />
      <span className="tabular-nums">{likes}</span>
    </button>
  );
}
