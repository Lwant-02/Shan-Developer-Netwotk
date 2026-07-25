import { MessageSquare } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// The comment control on a card — shaped like the feed card's LikeButton, but a link: it
// routes to the item's detail page, where the comment thread lives (mirroring how the feed
// card's comment count links through to the post). `label` (the caller's namespace) names it
// for assistive tech; `className` lets a card add its hover-group coupling.
export function CommentButton({
  href,
  count,
  label,
  className,
}: {
  href: string;
  count: number;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "text-muted-foreground bg-muted hover:text-foreground relative z-10 flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors",
        className,
      )}
    >
      <MessageSquare className="size-4" />
      <span className="tabular-nums">{count}</span>
    </Link>
  );
}
