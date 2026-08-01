import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { supabaseEnv } from "@/lib/supabase/env";

// `middleware.ts` is deprecated and renamed to `proxy.ts` in this Next version,
// though next-intl still ships its handler from `next-intl/middleware`.
//
// Two jobs: locale routing, then refreshing the Supabase session onto that response.
// Supabase's docs put the refresh in `middleware.ts` — wrong file here, and it would
// compete with next-intl's handler.

const handleLocale = createMiddleware(routing);

// Skipped without an auth cookie, so anonymous requests stay as cheap as before.
const hasAuthCookie = (request: NextRequest) =>
  request.cookies.getAll().some(({ name }) => name.startsWith("sb-"));

export async function proxy(request: NextRequest) {
  const response = handleLocale(request);

  if (!hasAuthCookie(request)) return response;

  const { url, key } = supabaseEnv();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // `no-store` and friends: a response carrying a refreshed auth cookie must
        // never be CDN-cached. Only set when cookies are written.
        for (const [header, value] of Object.entries(headers)) {
          response.headers.set(header, value);
        }
      },
    },
  });

  // `getClaims()`, not `getSession()`, which doesn't reliably revalidate.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  // Excluding dotted paths keeps /favicon.ico and font requests from being
  // redirected to /shn/favicon.ico.
  //
  // `auth` is excluded so next-intl doesn't rewrite the OAuth callback path.
  matcher: "/((?!api|auth|_next|_vercel|.*\\..*).*)",
};
