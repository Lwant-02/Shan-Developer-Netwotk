import { NextResponse } from "next/server";

import { ensureProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

// Outside `app/[locale]` because the redirect URL is registered with the providers and
// must not vary by locale — `proxy.ts` excludes `/auth` from locale rewriting.
// Also the only place a profile row is created.

// Same-origin only, so a crafted `next` can't bounce someone off the site.
function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");

  const failure = new URL(next, origin);
  failure.searchParams.set("auth_error", "1");

  if (!code) return NextResponse.redirect(failure);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(failure);

  try {
    await ensureProfile(data.user);
  } catch {
    // A session with no profile is a broken half-state — undo the sign-in.
    await supabase.auth.signOut();
    return NextResponse.redirect(failure);
  }

  // Survives the round trip; `CurrentUserProvider` reads it and strips it.
  const success = new URL(next, origin);
  success.searchParams.set("signed_in", "1");
  return NextResponse.redirect(success);
}
