import { Share2 } from "lucide-react";

import { cn } from "@/lib/utils";

// The share control, shaped like the feed card's LikeButton — one shared display-only
// button reused by the project and event surfaces so they don't fork a near-copy. Sharing
// is not wired yet; `label` comes from the caller's namespace, and `className` lets a card
// add its hover-group coupling.
export function ShareButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "text-muted-foreground bg-muted hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors",
        className,
      )}
    >
      <Share2 className="size-4" />
      <span>{label}</span>
    </button>
  );
}
