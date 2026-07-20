import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProseSection } from "@/components/content/prose-page";
import { localeAlternates } from "@/lib/site";

// The section renderer must not drop content, and Shan (Myanmar-block) script must
// survive a refactor — any content string on these pages can be Shan.
test("ProseSection renders heading and body, preserving Shan script", () => {
  render(<ProseSection heading="ၶေႃႈတူၵ်းလွင်ႈ" body="လွင်ႈသုၼ်ႇတူဝ်" />);

  expect(screen.getByText("ၶေႃႈတူၵ်းလွင်ႈ")).toBeDefined();
  const body = screen.getByText("လွင်ႈသုၼ်ႇတူဝ်");
  // U+1000–U+109F is the Myanmar block, which Shan is written in.
  expect(body.textContent).toMatch(/[က-႟]/);
});

// Each content page sets its own canonical + hreflang for its own path. A page that
// inherited the layout's alternates would wrongly claim the home URL as canonical
// (AGENTS.md), so this pins the per-path behaviour.
test("localeAlternates targets the page's own path, not the home root", () => {
  const alt = localeAlternates("en", "/about");

  expect(alt?.canonical).toBe("/en/about");
  expect(alt?.languages).toMatchObject({
    en: "/en/about",
    shn: "/shn/about",
    "x-default": "/shn/about",
  });
});
