import { afterEach, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { FeedbackDialog } from "@/components/feedback/feedback-dialog";
import { FeedbackLauncher } from "@/components/feedback/feedback-launcher";
import en from "@/messages/en.json";

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

afterEach(() => {
  vi.unstubAllGlobals();
});

// Feedback needs no account: the floating launcher renders with no session.
test("the feedback launcher renders for an anonymous visitor", () => {
  renderAt("en", en, <FeedbackLauncher />);

  expect(
    screen.getByRole("button", { name: en.Feedback.launch }),
  ).toBeDefined();
});

// The load-bearing guarantee (CoS 4): submitting the form sends nothing over the network.
// This is frontend-only — the GitHub write path is a later PBI.
test("submitting the feedback form performs no network request", () => {
  const fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);

  renderAt(
    "en",
    en,
    <FeedbackDialog>
      <button type="button">Feedback</button>
    </FeedbackDialog>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Feedback" }));
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Something broke" },
  });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Here is what happened." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  // The mock success shows, and no request was made.
  expect(screen.getByText(en.Feedback.successTitle)).toBeDefined();
  expect(fetchSpy).not.toHaveBeenCalled();
});
