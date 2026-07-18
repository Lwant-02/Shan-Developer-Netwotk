import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

// `middleware.ts` is deprecated and renamed to `proxy.ts` in this Next version,
// though next-intl still ships its handler from `next-intl/middleware`.
export const proxy = createMiddleware(routing);

export const config = {
  // Excluding dotted paths keeps /favicon.ico and font requests from being
  // redirected to /shn/favicon.ico.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
