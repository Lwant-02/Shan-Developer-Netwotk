import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectLinks } from "@/components/projects/project-links";
import { ProjectList } from "@/components/projects/project-list";
import { getProjectBySlug, mockProjects } from "@/lib/projects";
import en from "@/messages/en.json";

// The async pages can't be rendered by Vitest (per the Next testing guide), so the
// synchronous list/card/links pieces stand in for the anonymous-read and redesign
// guarantees.
function renderAt(
  locale: string,
  messages: Record<string, unknown>,
  node: React.ReactNode,
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {node}
    </NextIntlClientProvider>,
  );
}

// Anonymous read access is a product requirement: the directory list renders with no session.
test("the project list renders for an anonymous visitor", () => {
  renderAt("en", en, <ProjectList projects={mockProjects} />);

  expect(screen.getByText("shan-dates")).toBeDefined();
});

// The redesign's load-bearing rule (CoS 4): the card links to its DETAIL page, and no longer
// straight out to the repo. Guards the provisional card's title→repo link from creeping back.
test("a project card links to its detail page, not the repo", () => {
  const project = getProjectBySlug("shan-gboard-layout")!;
  expect(project.repo).toBeDefined();

  const { container } = renderAt("en", en, <ProjectCard project={project} />);

  expect(
    container.querySelector('a[href$="/projects/shan-gboard-layout"]'),
  ).not.toBeNull();
  expect(
    container.querySelector(`a[href="${project.repo}"]`),
  ).toBeNull();
});

// Outbound links render only when present, and every one is a safe external link.
test("project links render only present links, safely", () => {
  const withOne = getProjectBySlug("shan-dates")!; // repo only
  const { container } = renderAt("en", en, <ProjectLinks project={withOne} />);

  const repoLink = container.querySelector(`a[href="${withOne.repo}"]`);
  expect(repoLink).not.toBeNull();
  expect(repoLink?.getAttribute("target")).toBe("_blank");
  expect(repoLink?.getAttribute("rel")).toBe("noopener noreferrer");

  // No App Store / Play Store / website on this project — those buttons must not appear.
  expect(screen.queryByText(en.Projects.linkAppStore)).toBeNull();
  expect(screen.queryByText(en.Projects.linkPlayStore)).toBeNull();
  expect(screen.queryByText(en.Projects.linkLive)).toBeNull();
});

// A project with no links at all renders nothing (no empty links row).
test("project links render nothing when a project has no links", () => {
  const noLinks = {
    ...getProjectBySlug("shan-dates")!,
    repo: undefined,
    website: undefined,
    appStore: undefined,
    playStore: undefined,
  };

  const { container } = renderAt("en", en, <ProjectLinks project={noLinks} />);
  expect(container.querySelector("a")).toBeNull();
});
