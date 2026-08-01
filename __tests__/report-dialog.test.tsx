import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { PostMenu } from "@/components/feed/post-menu";
import en from "@/messages/en.json";

function openMenu() {
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <PostMenu />
    </NextIntlClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: en.Post.more }));
}

function openReport() {
  openMenu();
  fireEvent.click(screen.getByRole("menuitem", { name: en.Post.report }));
}

// Report has shipped in the `⋯` menu since PBI-010 with nothing behind it. It must now
// reach the reason dialog — and survive the menu closing, which is what unmounts a
// trigger placed inside the popup.
test("the report menu item opens the reason dialog", () => {
  openReport();

  expect(screen.getByRole("heading", { name: en.Report.title })).toBeDefined();
});

// The reporter's options must be exactly the set the admin queue displays, or the two
// halves of the moderation loop drift apart. Both read the same `Report` namespace.
test("the dialog offers the same fixed reasons the admin queue shows", () => {
  openReport();

  // Every `reason_*` string in the namespace must be offered — so adding a reason to the
  // messages without adding it to the dialog (or vice versa) fails here.
  const labels = Object.entries(en.Report)
    .filter(([key]) => key.startsWith("reason_"))
    .map(([, label]) => label);

  expect(labels.length).toBe(10);
  for (const label of labels) {
    expect(screen.getByRole("radio", { name: label })).toBeDefined();
  }

  // The two that exist for this product specifically rather than by convention:
  // doxxing (pseudonymity is a safety requirement here) and hostile links (a developer
  // community whose projects carry outbound URLs).
  expect(
    screen.getByRole("radio", { name: en.Report.reason_privateInfo }),
  ).toBeDefined();
  expect(
    screen.getByRole("radio", { name: en.Report.reason_malware }),
  ).toBeDefined();

  // No free-text field: free text in a moderation queue is itself somewhere abuse gets
  // written, and the admin surface has nowhere to show it.
  expect(screen.queryByRole("textbox")).toBeNull();
});

// A report with no reason tells a moderator nothing, so submitting is gated on choosing.
test("submitting is blocked until a reason is chosen", () => {
  openReport();

  const submit = () => screen.getByRole("button", { name: en.Report.submit });
  expect(submit()).toHaveProperty("disabled", true);

  fireEvent.click(screen.getByRole("radio", { name: en.Report.reason_spam }));

  expect(submit()).toHaveProperty("disabled", false);
});

// Filing a report is a write needing auth and a rate limit, so nothing is sent. A
// reporter must not be left believing help is coming.
test("submitting says plainly that nothing was sent", () => {
  openReport();

  fireEvent.click(screen.getByRole("radio", { name: en.Report.reason_spam }));
  fireEvent.click(screen.getByRole("button", { name: en.Report.submit }));

  expect(screen.getByText(en.Report.successBody)).toBeDefined();
});
