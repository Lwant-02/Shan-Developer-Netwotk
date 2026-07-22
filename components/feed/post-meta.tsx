import { useFormatter } from "next-intl";

import type { Post } from "@/lib/feed";
import { cn } from "@/lib/utils";
import { PostMenu } from "./post-menu";

// Author avatar + handle + relative time, with the post's ⋯ menu. Shared by the feed
// card and the post detail header so the two stay identical. The avatar is initials
// only — never a real identity or presence (the identity-safety rule).
export function PostMeta({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const format = useFormatter();

  return (
    <header
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-xs",
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full text-[10px] uppercase"
      >
        {post.author.slice(0, 2)}
      </span>
      <span className="text-foreground">{post.author}</span>
      <span aria-hidden className="opacity-50">
        ·
      </span>
      <time dateTime={post.createdAtISO}>
        {format.relativeTime(new Date(post.createdAtISO))}
      </time>
      {/* z-10 keeps the menu clickable above the card's stretched title link. */}
      <div className="relative z-10 ml-auto">
        <PostMenu />
      </div>
    </header>
  );
}
