import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { mockPosts } from "@/lib/feed";
import { siteUrl } from "@/lib/site";

// Routes are listed once, without a locale; every locale is expanded from
// routing.locales so adding one cannot silently omit it from the sitemap. Post detail
// pages are public content and part of the recruiting reach, so they are indexed too;
// they come from the same mock source that renders them (PBI-016).
const staticRoutes = ["", "/about", "/terms", "/privacy"];
const postRoutes = mockPosts.map((post) => `/post/${post.slug}`);
const routes = [...staticRoutes, ...postRoutes];

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
