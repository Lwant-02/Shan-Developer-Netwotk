import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { CommentButton } from "@/components/content/comment-button";
import { ShareButton } from "@/components/content/share-button";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { ProjectMenu } from "./project-menu";
import { StarButton } from "./star-button";

// A project tile shaped like the feed's post card (PBI-020): title / body / image, with a
// display-only star count and tags. The whole card links to the detail page — the outbound
// repo/store links live there, not on the card. Reused by the /projects directory and the
// developer profile's projects tab. Content carries its own language (`lang`).
export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const format = useFormatter();
  const t = useTranslations("Projects");
  const href = `/projects/${project.slug}`;

  return (
    // `relative` anchors the title's stretched link so the whole card routes to the detail
    // page; nothing else in the card is interactive.
    <article
      className={cn(
        "group/project hover:bg-muted/60 relative flex cursor-pointer flex-col gap-3 rounded-lg p-4 transition-colors",
        className,
      )}
    >
      <div lang={project.lang} className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-foreground text-lg leading-snug">
            <Link href={href} className="after:absolute after:inset-0">
              {project.title}
            </Link>
          </h2>
          {/* z-10 keeps the menu clickable above the card's stretched title link. */}
          <div className="relative z-10 shrink-0">
            <ProjectMenu />
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
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

      <footer className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
        <StarButton
          stars={project.stars}
          className="group-hover/project:bg-background relative z-10"
        />
        <CommentButton
          href={href}
          count={project.comments}
          label={t("comments")}
          className="group-hover/project:bg-background"
        />
        <ShareButton
          label={t("share")}
          className="group-hover/project:bg-background relative z-10"
        />
        <time className="ml-1.5" dateTime={project.createdAtISO}>
          {t("posted", {
            time: format.relativeTime(new Date(project.createdAtISO)),
          })}
        </time>
      </footer>
    </article>
  );
}
