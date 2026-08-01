import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { ProfileOwnerMenu } from "@/components/developers/profile-owner-menu";
import en from "@/messages/en.json";

function openMenu() {
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <ProfileOwnerMenu />
    </NextIntlClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: en.Profile.manage }));
}

// Editing a profile already has a home: /settings edits exactly the fields the profile
// renders (PBI-024). Edit must route there rather than growing a second editor.
test("edit routes to the settings page", () => {
  openMenu();

  expect(
    screen.getByRole("menuitem", { name: en.Profile.edit }).getAttribute("href"),
  ).toBe("/settings");
});

// Account deletion is the most destructive action in the product — it must confirm, and
// the confirmation must say nothing is wired, so nobody believes their account is gone.
test("delete confirms first and admits it does nothing yet", () => {
  openMenu();

  fireEvent.click(screen.getByRole("menuitem", { name: en.Profile.delete }));

  expect(
    screen.getByRole("heading", { name: en.Profile.confirmDeleteTitle }),
  ).toBeDefined();
  expect(screen.getByText(en.Profile.notWired)).toBeDefined();
  // The confirm button itself stays disabled: there is no endpoint to call, and a live
  // "Delete account" that silently no-ops is worse than one that is visibly not ready.
  expect(
    screen.getByRole("button", { name: en.Profile.delete }),
  ).toHaveProperty("disabled", true);
});
