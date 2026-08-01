import type { User } from "@supabase/supabase-js";
import { expect, test } from "vitest";

import {
  deriveAvatarUrl,
  deriveDisplayName,
  deriveHandle,
  normalizeHandle,
} from "@/lib/auth/handle";

// The handle and display name are seeded from the OAuth profile name (owner's call,
// PBI-028), so a new member arrives recognisable. What must never leak is the **email** —
// `design.md` forbids exposing it, and addresses are so often `firstname.lastname` that
// using one as a fallback would publish the address itself.

function user(provider: string, metadata: Record<string, unknown> = {}) {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    app_metadata: { provider },
    user_metadata: metadata,
  } as unknown as User;
}

test("the handle comes from the provider's profile name", () => {
  expect(deriveHandle(user("google", { full_name: "Sai Kham" }))).toBe(
    "sai_kham",
  );
});

// The load-bearing one. With no name to work from, the email is sitting right there in
// the payload and must still never be reached for.
test("the email is never used for a handle, even as a last resort", () => {
  const handle = deriveHandle(
    user("google", { email: "sai.kham@example.com" }),
  );

  expect(handle).toMatch(/^member_[a-z0-9]{6}$/);
  expect(handle).not.toContain("sai");
  expect(handle).not.toContain("kham");
});

// GitHub's login is the fallback when no name is set — it is already public there.
test("a GitHub login is used when the provider gives no name", () => {
  expect(deriveHandle(user("github", { user_name: "Lwant-02" }))).toBe(
    "lwant_02",
  );
});

test("an unusable claim falls back to a generated handle", () => {
  expect(deriveHandle(user("github", {}))).toMatch(/^member_/);
  expect(deriveHandle(user("github", { user_name: "--" }))).toMatch(/^member_/);
});

test("the display name is the provider's name, never the email", () => {
  expect(deriveDisplayName(user("google", { full_name: "Sai Kham" }))).toBe(
    "Sai Kham",
  );
  expect(
    deriveDisplayName(user("google", { email: "sai.kham@example.com" })),
  ).toBeNull();
});

// The avatar URL is rendered straight into an <img>. A provider-supplied `javascript:` or
// `data:` string has no business getting there, so anything not plainly https is dropped.
test("only an https avatar URL is accepted", () => {
  expect(
    deriveAvatarUrl(user("github", { avatar_url: "https://example.com/a.png" })),
  ).toBe("https://example.com/a.png");

  expect(
    deriveAvatarUrl(user("github", { avatar_url: "javascript:alert(1)" })),
  ).toBeNull();
  expect(
    deriveAvatarUrl(user("google", { picture: "http://example.com/a.png" })),
  ).toBeNull();
});

// A handle that reads as the platform itself is impossible to claw back once held.
test("handles that impersonate the platform are rejected", () => {
  expect(normalizeHandle("admin")).toBeNull();
  expect(normalizeHandle("Moderator")).toBeNull();
  expect(normalizeHandle("support")).toBeNull();
});
