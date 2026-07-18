import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

// Installable PWA manifest (PBI-009). Manifest + icons only — no service worker,
// so no offline and no new client JS; that is a later PBI. Colors mirror the light
// --background (oklch(1 0 0) = white), and there is no dark theme, so one color is
// correct. start_url is /shn, the Shan-first entry point.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/shn",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "shn",
    dir: "ltr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
