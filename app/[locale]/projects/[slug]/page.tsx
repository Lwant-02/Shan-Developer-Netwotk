import type { Metadata } from "next";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNow, getTranslations, setRequestLocale } from "next-intl/server";

import { ShareButton } from "@/components/content/share-button";
import { CommentThread } from "@/components/feed/comment-thread";
import { HandleLink } from "@/components/feed/handle-link";
import { ProjectLinks } from "@/components/projects/project-links";
import { ProjectMenu } from "@/components/projects/project-menu";
import { StarButton } from "@/components/projects/star-button";
import { AppShell } from "@/components/shell/app-shell";
import { Link } from "@/i18n/navigation";
import { getCommentsFor } from "@/lib/comments";
import { relativeTimeEn } from "@/lib/datetime";
import { getProjectBySlug, mockProjects } from "@/lib/projects";
import { localeAlternates } from "@/lib/site";

// Prerender every known project at build time (one per slug, per locale from the parent
// layout). An unknown slug falls through to notFound() → the localised 404.
export function generateStaticParams() {
  return mockProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: localeAlternates(locale, `/projects/${slug}`),
    openGraph: {
      type: "article",
      url: `/${locale}/projects/${slug}`,
      title: project.title,
      description: project.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations("Projects");
  const now = await getNow();
  const comments = getCommentsFor(project.slug);
  const hasLinks = Boolean(
    project.repo || project.website || project.appStore || project.playStore,
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("backToProjects")}
        </Link>

        <article className="flex flex-col gap-4">
          <div lang={project.lang} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-foreground text-2xl leading-snug">
                {project.title}
              </h1>
              <div className="shrink-0">
                <ProjectMenu />
              </div>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
              <span>
                {t.rich("by", {
                  handle: () => (
                    <HandleLink
                      handle={project.author}
                      className="text-foreground hover:text-muted-foreground transition-colors"
                    />
                  ),
                })}
              </span>
              <StarButton stars={project.stars} />
              <span
                aria-label={t("comments")}
                className="text-muted-foreground bg-muted flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              >
                <MessageSquare className="size-4" />
                <span className="tabular-nums">{comments.length}</span>
              </span>
              <ShareButton label={t("share")} />
              <time dateTime={project.createdAtISO}>
                {t("posted", {
                  time: relativeTimeEn(project.createdAtISO, now),
                })}
              </time>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.image && (
            <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={project.image}
                alt=""
                fill
                sizes="(min-width: 768px) 42rem, 100vw"
                className="object-contain"
              />
            </div>
          )}

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {hasLinks && (
            <div className="flex flex-col gap-2">
              <h2 className="text-muted-foreground text-sm">{t("links")}</h2>
              <ProjectLinks project={project} />
            </div>
          )}
        </article>

        <hr className="border-border" />

        <CommentThread comments={comments} />
      </div>
    </AppShell>
  );
}
