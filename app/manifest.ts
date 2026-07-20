import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

// Installable PWA manifest (PBI-009). Manifest + icons only — no service worker,
// so no offline and no new client JS; that is a later PBI. Colors mirror `--background`
// from the dark-only palette (PBI-013); white here would flash a white splash screen
// before a dark app, and clash with the dark icons. start_url is /shn, the Shan-first
// entry point.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/shn",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
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
