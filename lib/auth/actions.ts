"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";
import type { AuthProvider } from "@/lib/current-user";

// `siteUrl()` falls back to `VERCEL_PROJECT_PRODUCTION_URL`, so a preview sign-in would
// land on production. The request's own host is the only reliable origin.
async function requestOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return siteUrl();

  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

// Same-origin only, so a crafted `next` can't bounce someone off the site.
function safeNext(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function signIn(provider: AuthProvider, next?: string) {
  const supabase = await createClient();
  const origin = await requestOrigin();

  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", safeNext(next));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: callback.toString() },
  });

  if (error || !data.url) {
    redirect(`${safeNext(next)}?auth_error=1`);
  }

  redirect(data.url);
}

export async function signOut(next?: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(safeNext(next));
}
