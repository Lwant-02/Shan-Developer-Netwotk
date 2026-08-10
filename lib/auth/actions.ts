"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/config";
import type { AuthProvider } from "@/lib/current-user";

function safeNext(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function signIn(provider: AuthProvider, next?: string) {
  const destination = safeNext(next);

  const { url } = await auth.api.signInSocial({
    body: { provider, callbackURL: `${destination}?signed_in=1` },
  });

  redirect(url ?? `${destination}?auth_error=1`);
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
}
