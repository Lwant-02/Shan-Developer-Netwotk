import { ArrowBigDown, ArrowBigUp, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import type { Post } from "@/lib/feed";
import { PostMenu } from "./post-menu";

// Controls sit on `bg-muted` at rest; the card's own hover is also muted, so they
// invert to `bg-background` to stay legible once the row lights up.
const action =
  "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors bg-muted group-hover/post:bg-background hover:text-foreground";

export function PostCard({ post }: { post: Post }) {
  const t = useTranslations("Post");
  const format = useFormatter();

  return (
    <article className="group/post hover:bg-muted/60 flex cursor-pointer flex-col gap-3 rounded-lg p-4 transition-colors">
      <header className="text-muted-foreground flex items-center gap-2 text-xs">
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
        <div className="ml-auto">
          <PostMenu />
        </div>
      </header>

      {/* Post content carries its own language, independent of the UI locale. */}
      <div lang={post.lang} className="flex flex-col gap-1.5">
        <h2 className="text-foreground text-lg leading-snug">{post.title}</h2>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {post.body}
        </p>
      </div>

      {post.image && (
        <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(min-width: 768px) 42rem, 100vw"
            className="object-contain"
          />
        </div>
      )}

      <footer className="flex flex-wrap items-center gap-1 text-xs">
        {/* Vote slot — display only. The voting mechanic is an undecided call. */}
        <div className="bg-muted group-hover/post:bg-background flex items-center gap-0.5 rounded-lg p-0.5 transition-colors">
          <button
            type="button"
            aria-label={t("upvote")}
            className="hover:bg-background/70 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1 transition-colors"
          >
            <ArrowBigUp className="size-4" />
          </button>
          <span className="text-foreground min-w-6 text-center tabular-nums">
            {post.score}
          </span>
          <button
            type="button"
            aria-label={t("downvote")}
            className="hover:bg-background/70 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1 transition-colors"
          >
            <ArrowBigDown className="size-4" />
          </button>
        </div>
        <button type="button" aria-label={t("comments")} className={action}>
          <MessageSquare className="size-4" />
          <span className="tabular-nums">{post.comments}</span>
        </button>
        <button type="button" className={action}>
          <Share2 className="size-4" />
          <span>{t("share")}</span>
        </button>
      </footer>
    </article>
  );
}
