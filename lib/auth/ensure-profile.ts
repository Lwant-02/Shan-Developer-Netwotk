import "server-only";

import { db } from "@/lib/db";
import { Prisma, type Profile } from "@/lib/generated/prisma/client";
import { deriveHandle, generateHandle, nextCandidate } from "./derive-profile";

const MAX_ATTEMPTS = 6;

type NewUser = { id: string; name?: string | null };

function uniqueViolation(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function violatedId(error: Prisma.PrismaClientKnownRequestError) {
  const target = error.meta?.target;
  const text = Array.isArray(target) ? target.join(",") : String(target ?? "");
  return text.includes("pkey") || text.includes("id");
}

export async function ensureProfile(user: NewUser): Promise<Profile> {
  const existing = await db.profile.findUnique({ where: { id: user.id } });
  if (existing) return existing;

  const fields = { id: user.id, termsAcceptedAt: new Date() };
  const base = deriveHandle(user.name);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const handle = attempt === 0 ? base : nextCandidate(base, attempt);

    try {
      return await db.profile.create({ data: { ...fields, handle } });
    } catch (error) {
      if (!uniqueViolation(error)) throw error;

      if (violatedId(error as Prisma.PrismaClientKnownRequestError)) {
        const raced = await db.profile.findUnique({ where: { id: user.id } });
        if (raced) return raced;
      }
    }
  }

  return db.profile.create({ data: { ...fields, handle: generateHandle() } });
}
