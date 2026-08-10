import { expect, test } from "vitest";

import {
  deriveHandle,
  nextCandidate,
  normalizeHandle,
} from "@/lib/auth/derive-profile";

test("the handle is the provider name, lowercased and underscored", () => {
  expect(deriveHandle("Test User")).toBe("test_user");
  expect(deriveHandle("Sai Kham")).toBe("sai_kham");
});

test("a handle is safe to put in a URL", () => {
  expect(deriveHandle("Nang  Mo!! Hom")).toBe("nang_mo_hom");
  expect(deriveHandle("  Leading & trailing  ")).toBe("leading_trailing");
});

test("an unusable name falls back to a generated handle, never a blank one", () => {
  expect(deriveHandle(null)).toMatch(/^member_[a-z0-9]{6}$/);
  expect(deriveHandle("")).toMatch(/^member_/);
  expect(deriveHandle("--")).toMatch(/^member_/);
  expect(deriveHandle("ab")).toMatch(/^member_/);
});

test("handles that impersonate the platform are rejected", () => {
  expect(normalizeHandle("admin")).toBeNull();
  expect(normalizeHandle("Moderator")).toBeNull();
  expect(normalizeHandle("support")).toBeNull();
  expect(deriveHandle("Admin")).toMatch(/^member_/);
});

test("a long name is truncated rather than producing an unbounded handle", () => {
  const handle = deriveHandle("a".repeat(80));
  expect(handle.length).toBeLessThanOrEqual(30);
});

test("collision candidates stay within the length limit", () => {
  const base = "a".repeat(30);
  const candidate = nextCandidate(base, 1);

  expect(candidate.length).toBeLessThanOrEqual(30);
  expect(candidate.endsWith("2")).toBe(true);
});
