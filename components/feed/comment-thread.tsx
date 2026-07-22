import { useTranslations } from "next-intl";

import type { Comment } from "@/lib/comments";
import { CommentCard } from "./comment-card";
import { CommentComposer } from "./comment-composer";

// The comment section under a post: a count heading, the sign-in-gated composer, and the
// thread. Replies are one level deep (mock), rendered indented under their parent. A
// Server Component using `useTranslations` — no client trigger here, so it stays on the
// server and is renderable under Vitest (unlike the async detail page).
export function CommentThread({ comments }: { comments: Comment[] }) {
  const t = useTranslations("Post");

  const roots = comments.filter((comment) => !comment.parentId);
  const repliesOf = (id: string) =>
    comments.filter((comment) => comment.parentId === id);

  return (
    <section className="flex flex-col gap-5">
      {/* Reuse the card's already-translated "comments" label rather than a new string. */}
      <h2 className="text-foreground text-base">
        {comments.length} {t("comments")}
      </h2>

      <CommentComposer />

      <ul className="flex flex-col gap-5">
        {roots.map((comment) => {
          const replies = repliesOf(comment.id);
          return (
            <li key={comment.id} className="flex flex-col gap-4">
              <CommentCard comment={comment} />
              {replies.length > 0 && (
                <ul className="border-border ml-3 flex flex-col gap-4 border-l pl-4">
                  {replies.map((reply) => (
                    <li key={reply.id}>
                      <CommentCard comment={reply} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
