import "server-only";

import { db } from "@/lib/db";
import type { AuthProvider, CurrentUser } from "@/lib/current-user";

type SessionUser = { id: string; name?: string | null; image?: string | null };

export async function loadCurrentUser(
  user: SessionUser,
): Promise<CurrentUser | null> {
  const profile = await db.profile.findUnique({
    where: { id: user.id },
    select: { handle: true, role: true, moderator: true },
  });
  if (!profile) return null;

  const account = await db.account.findFirst({
    where: { userId: user.id },
    select: { providerId: true },
    orderBy: { createdAt: "asc" },
  });

  return {
    handle: profile.handle,
    displayName: user.name || undefined,
    role: profile.role,
    avatarUrl: user.image ?? undefined,
    provider: (account?.providerId === "google"
      ? "google"
      : "github") as AuthProvider,
    moderator: profile.moderator,
  };
}
