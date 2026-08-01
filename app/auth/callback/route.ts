import { NextResponse } from "next/server";

import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createClient } from "@/lib/supabase/server";

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
    await supabase.auth.signOut();
    return NextResponse.redirect(failure);
  }

  const success = new URL(next, origin);
  success.searchParams.set("signed_in", "1");
  return NextResponse.redirect(success);
}
