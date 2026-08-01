import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";

// What `CurrentUserProvider` fetches, so reading the session never touches a public page's
// render. Body is exactly `CurrentUser` — no email, no OAuth payload.

export async function GET() {
  const user = await getCurrentUser();

  // Per-session: a shared cache here would serve one member's identity to the next.
  return NextResponse.json(user, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
