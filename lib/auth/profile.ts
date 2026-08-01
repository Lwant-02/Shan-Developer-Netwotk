import type { User } from "@supabase/supabase-js";

import { db } from "@/lib/db";
import { Prisma, type Profile } from "@/lib/generated/prisma/client";
import {
  deriveAvatarUrl,
  deriveDisplayName,
  deriveHandle,
  generateHandle,
  nextCandidate,
} from "./handle";

// Creates the public profile for a Supabase auth user. Name and avatar are copied from
// the provider; the email is not, and has no column to go to.
//
// `termsAcceptedAt` is stamped here because the sign-in dialog gates on that consent —
// reaching this function means it was given.

const MAX_ATTEMPTS = 6;

function uniqueViolation(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

// `meta.target` is a field list on some drivers and a constraint name on others.
function violatedAuthUserId(error: Prisma.PrismaClientKnownRequestError) {
  const target = error.meta?.target;
  const text = Array.isArray(target) ? target.join(",") : String(target ?? "");
  return text.includes("auth_user_id") || text.includes("authUserId");
}

/**
 * The caller's profile row, created on first sign-in. Safe to call concurrently:
 * `auth_user_id` and `handle` are both unique, and both violations are recovered from.
 */
export async function ensureProfile(user: User): Promise<Profile> {
  const existing = await db.profile.findUnique({
    where: { authUserId: user.id },
  });
  if (existing) return existing;

  const base = deriveHandle(user);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const handle = attempt === 0 ? base : nextCandidate(base, attempt);

    try {
      return await db.profile.create({
        data: {
          authUserId: user.id,
          handle,
          displayName: deriveDisplayName(user),
          avatarUrl: deriveAvatarUrl(user),
          termsAcceptedAt: new Date(),
        },
      });
    } catch (error) {
      if (!uniqueViolation(error)) throw error;

      if (violatedAuthUserId(error as Prisma.PrismaClientKnownRequestError)) {
        // Another request for this user won. Take theirs.
        const raced = await db.profile.findUnique({
          where: { authUserId: user.id },
        });
        if (raced) return raced;
      }
      // Otherwise the handle was taken — try the next candidate.
    }
  }

  // Contested base. An ugly handle they can change beats a failed sign-in.
  return db.profile.create({
    data: {
      authUserId: user.id,
      handle: generateHandle(),
      displayName: deriveDisplayName(user),
      avatarUrl: deriveAvatarUrl(user),
      termsAcceptedAt: new Date(),
    },
  });
}
