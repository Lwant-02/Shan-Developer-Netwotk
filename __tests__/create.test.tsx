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

// Event-specific: the start field stores its value as a UTC instant, per PBI-021. The
// field is now a calendar + time picker, so drive it the way a user would — open it,
// pick a day, set the time — and assert the UTC hint surfaces.
test("the event composer surfaces the UTC-stored start time", () => {
  renderComposer(<CreateForm type="event" />);

  fireEvent.click(screen.getByLabelText("Start time"));

  const day = screen
    .getAllByRole("button")
    .find((button) => button.hasAttribute("data-day"));
  if (!day) throw new Error("calendar rendered no day buttons");
  fireEvent.click(day);

  fireEvent.change(screen.getByLabelText("Time of day"), {
    target: { value: "13:00" },
  });

  expect(screen.getByText(/Stored as UTC: .*Z/)).toBeDefined();
});
