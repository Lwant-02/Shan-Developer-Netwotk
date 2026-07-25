import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { CreateForm } from "@/components/create/create-form";
import en from "@/messages/en.json";

function renderComposer(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {node}
    </NextIntlClientProvider>,
  );
}

// Anyone can open the composer — creating is gated at Publish, not at the page, so the
// form itself renders with no session or auth provider.
test("the composer renders for an anonymous visitor", () => {
  renderComposer(<CreateForm type="post" />);

  expect(screen.getByText("Title")).toBeDefined();
  expect(screen.getByText("Body")).toBeDefined();
  expect(screen.getByRole("button", { name: "Publish" })).toBeDefined();
});

// Publish persists nothing and asserts no identity — it opens the sign-in gate (CoS 6).
test("Publish opens the sign-in gate rather than posting", () => {
  renderComposer(<CreateForm type="post" />);

  expect(screen.queryByText("Continue with Google")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Publish" }));

  expect(screen.getByText("Continue with Google")).toBeDefined();
});

// Event-specific: the start field shows its value stored as a UTC instant, per PBI-021.
test("the event composer surfaces the UTC-stored start time", () => {
  renderComposer(<CreateForm type="event" />);

  const start = screen.getByLabelText("Start time");
  fireEvent.change(start, { target: { value: "2026-08-02T13:00" } });

  expect(screen.getByText(/Stored as UTC: .*Z/)).toBeDefined();
});
