import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth/config";
import type { CurrentUser } from "@/lib/current-user";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });

  return (session?.user as CurrentUser | null) ?? null;
}
