import { Star } from "lucide-react";

import type { Project } from "@/lib/projects";

// A project tile — reused by the developer profile now (PBI-017) and the Projects surface
// when it lands. Content carries its own language (`lang`), independent of the UI locale.
// The star count is display-only; the title links out to the repo/demo when public.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="border-border flex flex-col gap-2 rounded-lg border p-4">
      <div lang={project.lang} className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-foreground text-base leading-snug">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
            <Star className="size-3.5" />
            <span className="tabular-nums">{project.stars}</span>
          </span>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {project.description}
        </p>
      </div>

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
    </article>
  );
}
