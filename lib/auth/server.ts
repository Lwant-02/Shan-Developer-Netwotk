import "server-only";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import type { AuthProvider, CurrentUser } from "@/lib/current-user";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  const profile = await db.profile.findUnique({
    where: { authUserId: data.claims.sub },
    select: {
      handle: true,
      displayName: true,
      role: true,
      avatarUrl: true,
      moderator: true,
    },
  });
  if (!profile) return null;

  return {
    handle: profile.handle,
    displayName: profile.displayName ?? undefined,
    role: profile.role,
    avatarUrl: profile.avatarUrl ?? undefined,
    provider: (data.claims.app_metadata?.provider === "google"
      ? "google"
      : "github") as AuthProvider,
    moderator: profile.moderator,
  };
}
