import { useFormatter } from "next-intl";

import type { Comment } from "@/lib/comments";

// One comment: initials avatar, pseudonymous handle, relative time, and the body in its
// own content language (`lang`), independent of the UI locale. Display-only — replying,
// liking, and reporting need auth and a write path (later PBIs).
export function CommentCard({ comment }: { comment: Comment }) {
  const format = useFormatter();

  return (
    <article className="flex flex-col gap-1.5">
      <header className="text-muted-foreground flex items-center gap-2 text-xs">
        <span
          aria-hidden
          className="bg-muted text-muted-foreground flex size-6 items-center justify-center rounded-full text-[10px] uppercase"
        >
          {comment.author.slice(0, 2)}
        </span>
        <span className="text-foreground">{comment.author}</span>
        <span aria-hidden className="opacity-50">
          ·
        </span>
        <time dateTime={comment.createdAtISO}>
          {format.relativeTime(new Date(comment.createdAtISO))}
        </time>
      </header>
      <p
        lang={comment.lang}
        className="text-foreground pl-8 text-sm leading-relaxed"
      >
        {comment.body}
      </p>
    </article>
  );
}
