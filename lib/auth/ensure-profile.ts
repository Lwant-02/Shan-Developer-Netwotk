import type { User } from "@supabase/supabase-js";

import { db } from "@/lib/db";
import { Prisma, type Profile } from "@/lib/generated/prisma/client";
import {
  deriveAvatarUrl,
  deriveDisplayName,
  deriveHandle,
  generateHandle,
  nextCandidate,
} from "./derive-profile";

const MAX_ATTEMPTS = 6;

function uniqueViolation(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function violatedAuthUserId(error: Prisma.PrismaClientKnownRequestError) {
  const target = error.meta?.target;
  const text = Array.isArray(target) ? target.join(",") : String(target ?? "");
  return text.includes("auth_user_id") || text.includes("authUserId");
}

export async function ensureProfile(user: User): Promise<Profile> {
  const existing = await db.profile.findUnique({
    where: { authUserId: user.id },
  });
  if (existing) return existing;

  const fields = {
    authUserId: user.id,
    displayName: deriveDisplayName(user),
    avatarUrl: deriveAvatarUrl(user),
    termsAcceptedAt: new Date(),
  };

  const base = deriveHandle(user);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const handle = attempt === 0 ? base : nextCandidate(base, attempt);

    try {
      return await db.profile.create({ data: { ...fields, handle } });
    } catch (error) {
      if (!uniqueViolation(error)) throw error;

      if (violatedAuthUserId(error as Prisma.PrismaClientKnownRequestError)) {
        const raced = await db.profile.findUnique({
          where: { authUserId: user.id },
        });
        if (raced) return raced;
      }
    }
  }

  return db.profile.create({
    data: { ...fields, handle: generateHandle() },
  });
}
