import { Fragment } from "react";

import type { Project } from "@/lib/projects";
import { ProjectCard } from "./project-card";

// A hairline-separated single-column list of project cards (PBI-020), matching the home
// feed's column. The /projects directory renders it from the full mock set.
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-1">
      {projects.map((project, index) => (
        <Fragment key={project.id}>
          {index > 0 && <hr className="border-border mx-2 my-1" />}
          <ProjectCard project={project} />
        </Fragment>
      ))}
    </div>
  );
}
