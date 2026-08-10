import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { AUTH_SESSION_COOKIE, SESSION_HINT_COOKIE } from "@/lib/current-user";

const handleLocale = createMiddleware(routing);

const hasSession = (request: NextRequest) =>
  request.cookies.getAll().some(({ name }) => name.endsWith(AUTH_SESSION_COOKIE));

export function proxy(request: NextRequest) {
  const response = handleLocale(request);

  const signedIn = hasSession(request);
  const hinted = request.cookies.has(SESSION_HINT_COOKIE);

  if (signedIn && !hinted) {
    response.cookies.set(SESSION_HINT_COOKIE, "1", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
  }

  if (!signedIn && hinted) {
    response.cookies.delete(SESSION_HINT_COOKIE);
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
