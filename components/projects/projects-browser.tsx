"use client";

import { useState } from "react";

import { SortTabs } from "@/components/content/sort-tabs";
import type { Project } from "@/lib/projects";
import { sortItems, type SortKey } from "@/lib/sort";
import { ProjectList } from "./project-list";

// The /projects directory with its sort control. `"use client"` is forced by the sort state;
// projects arrive from the server page as a prop. Popularity here sorts by the star count.
export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [sort, setSort] = useState<SortKey>("newest");
  const sorted = sortItems(projects, sort, {
    createdAtISO: (project) => project.createdAtISO,
    score: (project) => project.stars,
  });

  return (
    <div className="flex flex-col gap-4">
      <SortTabs value={sort} onChange={setSort} />
      <ProjectList projects={sorted} />
    </div>
  );
}
