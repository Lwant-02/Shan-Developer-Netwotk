import { describe, expect, test } from "vitest";

import { cn } from "@/lib/utils";

// AGENTS.md requires every class list to go through cn() rather than template
// strings, specifically because cn() resolves conflicting Tailwind utilities.
// These tests pin that behaviour — it's the reason the convention exists.
describe("cn", () => {
  test("later utilities win over conflicting earlier ones", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("a caller-supplied className can override component defaults", () => {
    expect(cn("rounded-md bg-primary", "bg-secondary")).toBe(
      "rounded-md bg-secondary"
    );
  });

  test("conditional and falsy values are dropped", () => {
    expect(cn("flex", false && "hidden", undefined, "gap-2")).toBe("flex gap-2");
  });
});
