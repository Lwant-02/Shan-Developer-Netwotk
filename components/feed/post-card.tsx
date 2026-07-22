import { MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Post } from "@/lib/feed";
import { LikeButton } from "./like-button";
import { PostMeta } from "./post-meta";

// Controls sit on `bg-muted` at rest; the card's own hover is also muted, so they
// invert to `bg-background` to stay legible once the row lights up.
const action =
  "relative z-10 flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors bg-muted group-hover/post:bg-background hover:text-foreground";

export function PostCard({ post }: { post: Post }) {
  const t = useTranslations("Post");
  const href = `/post/${post.slug}`;

  return (
    // `relative` anchors the title's stretched link, which makes the whole card a link
    // to the post while the vote/menu/share controls stay clickable above it (z-10).
    <article className="group/post hover:bg-muted/60 relative flex cursor-pointer flex-col gap-3 rounded-lg p-4 transition-colors">
      <PostMeta post={post} />

      {/* Post content carries its own language, independent of the UI locale. */}
      <div lang={post.lang} className="flex flex-col gap-1.5">
        <h2 className="text-foreground text-lg leading-snug">
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
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
        <LikeButton
          likes={post.likes}
          className="group-hover/post:bg-background relative z-10"
        />
        <Link href={href} aria-label={t("comments")} className={action}>
          <MessageSquare className="size-4" />
          <span className="tabular-nums">{post.comments}</span>
        </Link>
        <button type="button" className={action}>
          <Share2 className="size-4" />
          <span>{t("share")}</span>
        </button>
      </footer>
    </article>
  );
}
