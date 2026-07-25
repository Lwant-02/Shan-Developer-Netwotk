import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { EventsBrowser } from "@/components/events/events-browser";
import { mockEvents, partitionEventsByTime } from "@/lib/events";
import en from "@/messages/en.json";

// Treat every mock event as upcoming so the render is independent of the wall clock.
const asUpcoming = { upcoming: mockEvents, past: [] };

function renderAt(
  locale: string,
  messages: Record<string, unknown>,
  node: React.ReactNode,
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {node}
    </NextIntlClientProvider>,
  );
}

// Anonymous read access is a product requirement: the events surface renders with no
// session and no auth provider.
test("the events list renders for an anonymous visitor", () => {
  renderAt("en", en, <EventsBrowser {...asUpcoming} />);

  expect(screen.getByText(/Intro to React, taught in Shan/)).toBeDefined();
});

// Each event links to its own detail page — the card is a destination, not a dead tile.
test("an event card links to its detail page", () => {
  const { container } = renderAt("en", en, <EventsBrowser {...asUpcoming} />);

  const link = container.querySelector(
    'a[href$="/events/intro-to-react-in-shan"]',
  );
  expect(link).not.toBeNull();
});

// There is no upcoming/past tab any more — both render together in one sorted list, the
// same control the feed and projects use.
test("upcoming and past events render together", () => {
  renderAt(
    "en",
    en,
    <EventsBrowser upcoming={[mockEvents[0]]} past={[mockEvents[4]]} />,
  );

  expect(screen.getByText(/Intro to React, taught in Shan/)).toBeDefined();
  expect(screen.getByText(/Shan Unicode clinic/)).toBeDefined();
});

// The sort control reorders the list. mockEvents[0] was posted after mockEvents[4], so the
// default "Newest" leads with it and "Oldest" flips the two.
test("the sort control reorders the list", () => {
  const { container } = renderAt(
    "en",
    en,
    <EventsBrowser upcoming={[mockEvents[0]]} past={[mockEvents[4]]} />,
  );
  const titles = () =>
    [...container.querySelectorAll("h2")].map((h) => h.textContent);

  expect(titles()[0]).toMatch(/Intro to React/);

  fireEvent.click(screen.getByRole("button", { name: /Oldest/ }));

  expect(titles()[0]).toMatch(/Shan Unicode clinic/);
});

// Upcoming/past split is derived from the start time, ordered soonest- and most-recent-first.
test("partitionEventsByTime splits and orders relative to now", () => {
  const now = new Date("2026-07-24T00:00:00Z").getTime();
  const { upcoming, past } = partitionEventsByTime(mockEvents, now);

  expect(upcoming.map((e) => e.slug)).toEqual([
    "intro-to-react-in-shan",
    "keyboard-testing-sprint",
    "beginner-git-workshop",
    "shan-dev-meetup-kengtung",
  ]);
  expect(past.map((e) => e.slug)).toEqual(["shan-unicode-clinic"]);
});
