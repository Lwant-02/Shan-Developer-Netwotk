import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

// Routes are listed once, without a locale; every locale is expanded from
// routing.locales so adding one cannot silently omit it from the sitemap.
const routes = [""] as const;

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
