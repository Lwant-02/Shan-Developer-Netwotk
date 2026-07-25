import type { Metadata } from "next";
import { ArrowLeft, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CommentThread } from "@/components/feed/comment-thread";
import { LikeButton } from "@/components/feed/like-button";
import { PostMeta } from "@/components/feed/post-meta";
import { AppShell } from "@/components/shell/app-shell";
import { Link } from "@/i18n/navigation";
import { getCommentsFor } from "@/lib/comments";
import { getPostBySlug, mockPosts } from "@/lib/feed";
import { localeAlternates } from "@/lib/site";

// Prerender every known post at build time (one per slug, per locale from the parent
// layout). An unknown slug falls through to notFound() → the localised 404.
export function generateStaticParams() {
  return mockPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.body,
    alternates: localeAlternates(locale, `/post/${slug}`),
    openGraph: {
      type: "article",
      url: `/${locale}/post/${slug}`,
      title: post.title,
      description: post.body,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const comments = getCommentsFor(post.slug);
  const t = await getTranslations("Post");
  const tDetail = await getTranslations("PostDetail");

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {tDetail("backToFeed")}
        </Link>

        <article className="flex flex-col gap-4">
          <PostMeta post={post} />

          <div lang={post.lang} className="flex flex-col gap-3">
            <h1 className="text-foreground text-2xl leading-snug">
              {post.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
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
            <LikeButton likes={post.likes} />
            <span className="text-muted-foreground bg-muted flex items-center gap-1.5 rounded-lg px-2.5 py-1.5">
              <MessageSquare className="size-4" />
              <span className="tabular-nums">{comments.length}</span>
            </span>
            <button
              type="button"
              className="text-muted-foreground bg-muted hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <Share2 className="size-4" />
              <span>{t("share")}</span>
            </button>
          </footer>
        </article>

        <hr className="border-border" />

        <CommentThread comments={comments} />
      </div>
    </AppShell>
  );
}
