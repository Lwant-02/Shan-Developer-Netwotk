import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { listDevelopers } from "@/lib/developers";
import { mockPosts } from "@/lib/feed";
import { listProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

// Routes are listed once, without a locale; every locale is expanded from
// routing.locales so adding one cannot silently omit it from the sitemap. Post detail
// pages (PBI-016), the developer directory + profiles (PBI-017), and the projects
// directory + detail (PBI-020) are public content and part of the recruiting reach, so
// they are indexed too — from the same mock sources that render them.
const staticRoutes = [
  "",
  "/about",
  "/terms",
  "/privacy",
  "/developers",
  "/projects",
];
const postRoutes = mockPosts.map((post) => `/post/${post.slug}`);
const developerRoutes = listDevelopers().map(
  (developer) => `/developers/${developer.handle}`,
);
const projectRoutes = listProjects().map(
  (project) => `/projects/${project.slug}`,
);
const routes = [
  ...staticRoutes,
  ...postRoutes,
  ...developerRoutes,
  ...projectRoutes,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  const href = (locale: string, route: string) =>
    `${base}/${locale}${route}`;

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: href(locale, route),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, href(l, route)])
        ),
      },
    }))
  );
}
