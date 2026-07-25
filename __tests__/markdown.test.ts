import { expect, test } from "vitest";

import { toUtcISO } from "@/lib/datetime";
import { applyMarkdown } from "@/lib/markdown";

// The toolbar's whole job (PBI-022 CoS 3): each control inserts the right markdown.

test("inline code wraps the selection in backticks", () => {
  // "hello world", select "world" (6..11)
  const r = applyMarkdown("hello world", 6, 11, "inline-code");
  expect(r.value).toBe("hello `world`");
  // selection stays on the wrapped word
  expect(r.value.slice(r.selectionStart, r.selectionEnd)).toBe("world");
});

test("code block fences the selection on its own lines", () => {
  const r = applyMarkdown("const x = 1", 0, 11, "code-block");
  expect(r.value).toBe("```\nconst x = 1\n```");
  expect(r.value.slice(r.selectionStart, r.selectionEnd)).toBe("const x = 1");
});

test("bullet list prefixes every selected line", () => {
  const r = applyMarkdown("one\ntwo\nthree", 0, 13, "bullet-list");
  expect(r.value).toBe("- one\n- two\n- three");
});

test("ordered list numbers each selected line", () => {
  const r = applyMarkdown("one\ntwo\nthree", 0, 13, "ordered-list");
  expect(r.value).toBe("1. one\n2. two\n3. three");
});

test("quote prefixes the line the caret sits on", () => {
  // empty selection inside "two"
  const r = applyMarkdown("one\ntwo\nthree", 5, 5, "quote");
  expect(r.value).toBe("one\n> two\nthree");
});

// PBI-021's store-UTC rule, carried into the event composer (CoS 5): a local input becomes
// an explicit UTC instant, never a naive local string.
test("toUtcISO normalises a local datetime to a UTC instant", () => {
  const iso = toUtcISO("2026-08-02T13:00");
  expect(iso).toMatch(/Z$/);
  expect(new Date(iso).getTime()).toBe(new Date("2026-08-02T13:00").getTime());
});

test("toUtcISO returns empty string for empty or invalid input", () => {
  expect(toUtcISO("")).toBe("");
  expect(toUtcISO("not-a-date")).toBe("");
});
