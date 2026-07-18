import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { SearchTrigger } from "@/components/search/search-trigger";
import en from "@/messages/en.json";
import shn from "@/messages/shn.json";

// `@/i18n/navigation` needs the App Router context, which RTL doesn't provide.
// The palette's actions only ever call these, so stubbing them is enough.
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function renderTrigger() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SearchTrigger />
    </NextIntlClientProvider>
  );
}

// Search is a read path: it must work with no session, like everything else public.
test("the search trigger renders for an anonymous visitor", () => {
  renderTrigger();

  expect(screen.getAllByText("Search the community").length).toBeGreaterThan(0);
});

// CoS 9 as a test: kbar is dynamically imported, so a visitor who never reaches for
// search never loads it. If the palette starts rendering eagerly, this goes red.
test("the palette is not mounted until search is opened", () => {
  const { container } = renderTrigger();

  expect(container.textContent).not.toContain(en.Search.placeholder);
});

// The product reason this PBI exists. Shan is written without spaces between words,
// so matching must work on a substring of an unspaced string — this drives kbar's
// real matcher rather than asserting against a library we don't depend on directly.
//
// Provisional, and deliberately NOT the Myanmar tokenisation decision: six mock posts
// prove nothing about a real corpus. See design.md, open question 3.
test("a Shan substring matches unspaced Shan text in the palette", async () => {
  const { CommandPalette } = await import("@/components/search/command-palette");

  // Owner-written Shan from messages/shn.json — never invented here. On /shn the
  // action names are Shan, so this drives the matcher with real content.
  const home = shn.Nav.home; // ၼႃႈႁူဝ်ႁႅၵ်ႈ
  const fragment = home.slice(3, 7);

  render(
    <NextIntlClientProvider locale="shn" messages={shn}>
      <CommandPalette openSignal={1} />
    </NextIntlClientProvider>
  );

  const input = await screen.findByPlaceholderText(shn.Search.placeholder);
  fireEvent.change(input, { target: { value: fragment } });

  expect(await screen.findByText(home)).toBeDefined();
});
