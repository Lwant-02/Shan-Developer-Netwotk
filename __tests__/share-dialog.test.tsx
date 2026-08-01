import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { ShareDialog } from "@/components/content/share-dialog";
import en from "@/messages/en.json";

const url = "https://example.com/shn/post/shan-keyboard-layout-gboard";

function renderDialog() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <ShareDialog
        url={url}
        title="Shipped my first Shan keyboard layout"
        open
        onOpenChange={() => {}}
      />
    </NextIntlClientProvider>,
  );
}

// Sharing is how a member reaches the people search never will, so it must work with no
// session — the same anonymous-first rule as every read surface.
test("the dialog renders for an anonymous visitor", () => {
  renderDialog();

  expect(screen.getByRole("heading", { name: en.Share.title })).toBeDefined();
});

// Network choice here is a locality decision, not the library's defaults: Facebook,
// Telegram, Viber, and LINE are where this audience already is. This pins that against a
// future "tidy-up" that swaps them for the usual Western set.
test("it offers the networks this audience actually uses", () => {
  renderDialog();

  for (const label of [
    en.Share.network_facebook,
    en.Share.network_telegram,
    en.Share.network_viber,
    en.Share.network_line,
  ]) {
    expect(screen.getByLabelText(label)).toBeDefined();
  }
});

// A share that points at the page the visitor happens to be on — or at localhost — is
// worse than no share button. Each network button carries the item's own canonical URL,
// which is also why the dialog needs no copy field.
test("every network shares the item, and nothing leaks a localhost URL", () => {
  renderDialog();

  // The dialog renders in a portal, so query the document rather than the container.
  const dialog = screen.getByRole("dialog");

  // Six networks, and no seventh control: the copy field was dropped once it was clear
  // each button already carries the URL (owner's call, matching PBI-018's profile share).
  const labels = Object.keys(en.Share).filter((key) =>
    key.startsWith("network_"),
  );
  expect(labels.length).toBe(6);
  expect(within(dialog).getAllByRole("button")).toHaveLength(
    labels.length + 1, // + the dialog's own close button
  );

  expect(dialog.textContent).not.toMatch(/localhost/);
  expect(within(dialog).queryByRole("textbox")).toBeNull();
});
