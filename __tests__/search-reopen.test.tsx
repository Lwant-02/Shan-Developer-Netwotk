import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { SearchTrigger } from "@/components/search/search-trigger";
import en from "@/messages/en.json";

const signals: number[] = [];

// Stands in for the real palette so the assertion is about what the trigger sends,
// not about kbar's internals.
vi.mock("@/components/search/command-palette", () => ({
  CommandPalette: ({ openSignal }: { openSignal: number }) => {
    signals.push(openSignal);
    return null;
  },
}));

// Regression test. The trigger first used a boolean: after the palette was dismissed
// it stayed mounted, so a second click set `true` over `true`, nothing re-rendered,
// and the palette never reopened. A counter changes on every activation.
test("every activation sends a new open signal", async () => {
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SearchTrigger />
    </NextIntlClientProvider>
  );

  const trigger = screen.getByLabelText("Search the community");

  fireEvent.click(trigger);
  await screen.findByLabelText("Search the community");
  fireEvent.click(trigger);
  fireEvent.click(trigger);

  // The last signal must be greater than the first, or reopening is impossible.
  expect(signals.at(-1)).toBeGreaterThan(signals[0]);
  expect(signals.at(-1)).toBe(3);
});
