import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["shn", "en"],
  defaultLocale: "shn",
  localePrefix: "always",
  // No Accept-Language negotiation: every visitor lands on Shan by default,
  // which also keeps responses invariant per URL so pages stay static.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
