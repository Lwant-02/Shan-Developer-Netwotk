import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { AccountMenu } from "@/components/shell/account-menu";
import { AccountMenuSlot } from "@/components/shell/nav-account";
import en from "@/messages/en.json";
import { testUser } from "./fixtures/current-user";

function open() {
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <AccountMenu user={testUser} />
    </NextIntlClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: en.Nav.account }));
}

test("nothing renders for a visitor with no session", () => {
  const { container } = render(
    <NextIntlClientProvider locale="en" messages={en}>
      <AccountMenuSlot />
    </NextIntlClientProvider>,
  );

  expect(container.innerHTML).toBe("");
});

test("the menu shows the identity and the sign-in provider", () => {
  open();

  expect(screen.getByText(testUser.displayName!)).toBeDefined();
  expect(screen.getByText(`@${testUser.handle}`)).toBeDefined();
  expect(screen.getByText("Signed in with GitHub")).toBeDefined();
});

// OAuth emails are never public (AGENTS.md) — including to their own owner in a menu
// that could be shoulder-surfed or screenshotted.
test("the menu never shows an email", () => {
  open();

  expect(screen.queryByText(/@[\w-]+\.\w{2,}/)).toBeNull();
});

test("the menu links to the user's own profile", () => {
  open();

  expect(
    screen
      .getByRole("menuitem", { name: en.Account.profile })
      .getAttribute("href"),
  ).toBe(`/developers/${testUser.handle}`);
});

test("settings links to the settings page", () => {
  open();

  expect(
    screen
      .getByRole("menuitem", { name: en.Account.settings })
      .getAttribute("href"),
  ).toBe("/settings");
});

test("sign out is a live control, not a placeholder", () => {
  open();

  const item = screen
    .getByText(en.Account.signOut)
    .closest('[role="menuitem"]');

  expect(item).not.toBeNull();
  expect(item?.getAttribute("data-disabled")).toBeNull();
});

// The AJ fonts are Regular-only, so any weight above 400 synthesizes faux-bold and
// distorts Myanmar tone marks. Every string here can render in Shan.
test("no localized text in the menu carries a bold weight", () => {
  open();

  const localized = [
    screen.getByText(en.Account.profile),
    screen.getByText(en.Account.settings),
    screen.getByText(en.Account.signOut),
  ];

  for (const element of localized) {
    expect(element.className).not.toMatch(/font-(bold|semibold|medium)/);
  }
});
