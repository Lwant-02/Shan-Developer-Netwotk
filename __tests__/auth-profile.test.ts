import type { User } from "@supabase/supabase-js";
import { beforeEach, expect, test, vi } from "vitest";

const findUnique = vi.fn();
const create = vi.fn();

vi.mock("@/lib/db", () => ({
  db: { profile: { findUnique, create } },
}));

const { ensureProfile } = await import("@/lib/auth/profile");
const { Prisma } = await import("@/lib/generated/prisma/client");

// Two members signing in for the first time at the same moment is not a hypothetical —
// it is the launch-day case. `auth_user_id` and `handle` are both unique in the database,
// so the only question is whether this recovers or 500s. These pin the recovery.

function unique(target: string) {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002",
    clientVersion: "7.9.1",
    meta: { target },
  });
}

const githubUser = {
  id: "11111111-1111-1111-1111-111111111111",
  app_metadata: { provider: "github" },
  user_metadata: { user_name: "tai_builds" },
} as unknown as User;

beforeEach(() => {
  findUnique.mockReset();
  create.mockReset();
});

test("an existing member is returned rather than recreated", async () => {
  findUnique.mockResolvedValue({ handle: "tai_builds" });

  await ensureProfile(githubUser);

  expect(create).not.toHaveBeenCalled();
});

test("a taken handle moves to the next candidate", async () => {
  findUnique.mockResolvedValue(null);
  create
    .mockRejectedValueOnce(unique("handle"))
    .mockResolvedValueOnce({ handle: "tai_builds2" });

  const profile = await ensureProfile(githubUser);

  expect(profile.handle).toBe("tai_builds2");
  expect(create.mock.calls[1][0].data.handle).toBe("tai_builds2");
});

// The dangerous one: losing this race must not produce a second profile or an error page
// on someone's very first visit.
test("losing the race for the same account yields the winner's row", async () => {
  findUnique
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({ handle: "tai_builds" });
  create.mockRejectedValueOnce(unique("auth_user_id"));

  const profile = await ensureProfile(githubUser);

  expect(profile.handle).toBe("tai_builds");
  expect(create).toHaveBeenCalledTimes(1);
});

// The name and avatar are copied on purpose (owner's call), so a new member arrives
// recognisable. The **email is not, and has no column to go to** — that is the one part
// of `design.md`'s identity rule this must never trade away.
test("the name and avatar are copied, the email never is", async () => {
  findUnique.mockResolvedValue(null);
  create.mockResolvedValue({ handle: "sai_kham" });

  await ensureProfile({
    ...githubUser,
    user_metadata: {
      user_name: "tai_builds",
      full_name: "Sai Kham",
      email: "sai.kham@example.com",
      avatar_url: "https://avatars.githubusercontent.com/u/1",
    },
  } as unknown as User);

  const data = create.mock.calls[0][0].data;

  expect(data.handle).toBe("sai_kham");
  expect(data.displayName).toBe("Sai Kham");
  expect(data.avatarUrl).toBe("https://avatars.githubusercontent.com/u/1");
  expect(JSON.stringify(data)).not.toContain("sai.kham@example.com");
  expect(Object.keys(data)).not.toContain("email");
});

// Reaching this function means the sign-in dialog's consent gate was satisfied, so the
// acceptance is recorded — that record is what lets a returning member skip the checkbox.
test("accepting the terms is recorded at creation", async () => {
  findUnique.mockResolvedValue(null);
  create.mockResolvedValue({ handle: "sai_kham" });

  await ensureProfile(githubUser);

  expect(create.mock.calls[0][0].data.termsAcceptedAt).toBeInstanceOf(Date);
});
