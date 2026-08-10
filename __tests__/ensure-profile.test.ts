import { beforeEach, expect, test, vi } from "vitest";

const findUnique = vi.fn();
const create = vi.fn();

vi.mock("@/lib/db", () => ({
  db: { profile: { findUnique, create } },
}));

const { ensureProfile } = await import("@/lib/auth/ensure-profile");
const { Prisma } = await import("@/lib/generated/prisma/client");

function unique(target: string) {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002",
    clientVersion: "7.9.1",
    meta: { target },
  });
}

const newUser = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Tai Builds",
};

beforeEach(() => {
  findUnique.mockReset();
  create.mockReset();
});

test("an existing member is returned rather than recreated", async () => {
  findUnique.mockResolvedValue({ handle: "tai_builds" });

  await ensureProfile(newUser);

  expect(create).not.toHaveBeenCalled();
});

test("the profile is keyed to the auth user id", async () => {
  findUnique.mockResolvedValue(null);
  create.mockResolvedValue({ handle: "tai_builds" });

  await ensureProfile(newUser);

  expect(create.mock.calls[0][0].data.id).toBe(newUser.id);
});

test("a taken handle moves to the next candidate", async () => {
  findUnique.mockResolvedValue(null);
  create
    .mockRejectedValueOnce(unique("handle"))
    .mockResolvedValueOnce({ handle: "tai_builds2" });

  const profile = await ensureProfile(newUser);

  expect(profile.handle).toBe("tai_builds2");
  expect(create.mock.calls[1][0].data.handle).toBe("tai_builds2");
});

test("losing the race for the same account yields the winner's row", async () => {
  findUnique
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({ handle: "tai_builds" });
  create.mockRejectedValueOnce(unique("id"));

  const profile = await ensureProfile(newUser);

  expect(profile.handle).toBe("tai_builds");
  expect(create).toHaveBeenCalledTimes(1);
});

test("no email is ever written to the profile, even if one is passed", async () => {
  findUnique.mockResolvedValue(null);
  create.mockResolvedValue({ handle: "sai_kham" });

  await ensureProfile({
    ...newUser,
    name: "Sai Kham",
    email: "sai.kham@example.com",
  } as { id: string; name: string });

  const data = create.mock.calls[0][0].data;

  expect(data.handle).toBe("sai_kham");
  expect(JSON.stringify(data)).not.toContain("sai.kham@example.com");
  expect(Object.keys(data)).not.toContain("email");
});

test("accepting the terms is recorded at creation", async () => {
  findUnique.mockResolvedValue(null);
  create.mockResolvedValue({ handle: "tai_builds" });

  await ensureProfile(newUser);

  expect(create.mock.calls[0][0].data.termsAcceptedAt).toBeInstanceOf(Date);
});
