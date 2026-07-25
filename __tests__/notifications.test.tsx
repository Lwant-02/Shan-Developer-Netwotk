import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { NotificationList } from "@/components/notifications/notification-list";
import { listNotifications } from "@/lib/notifications";
import en from "@/messages/en.json";
import shn from "@/messages/shn.json";

// A fixed reference time keeps the relative-time render independent of the wall clock.
const now = new Date("2026-07-25T12:00:00Z");

function renderList(locale: string, messages: Record<string, unknown>) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages} now={now}>
      <NotificationList notifications={listNotifications()} now={now} />
    </NextIntlClientProvider>,
  );
}

// Anonymous read access is a product requirement: the notifications surface renders with
// no session and no auth provider.
test("the notifications list renders for an anonymous visitor", () => {
  renderList("en", en);

  expect(screen.getByText("starred your project")).toBeDefined();
  expect(screen.getByText("started following you")).toBeDefined();
});

// Each notification is a destination — it links to the thing it's about, not a dead row.
test("a notification links to its target", () => {
  const { container } = renderList("en", en);

  expect(
    container.querySelector('a[href$="/post/shan-keyboard-layout-gboard"]'),
  ).not.toBeNull();
});

// "Mark all as read" is frontend-only: it clears the unread markers in local state,
// persisting nothing. (A real, persistent read-state needs auth + a rate limit.)
test("mark all as read clears the unread markers", () => {
  renderList("en", en);

  expect(screen.getAllByLabelText("Unread").length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole("button", { name: /Mark all as read/ }));

  expect(screen.queryAllByLabelText("Unread")).toHaveLength(0);
});

// Key parity: the surface renders in Shan without a missing-message crash, and every
// notification produces a row.
test("the notifications list renders in Shan", () => {
  const { container } = renderList("shn", shn);

  expect(container.querySelectorAll("article").length).toBe(
    listNotifications().length,
  );
});
