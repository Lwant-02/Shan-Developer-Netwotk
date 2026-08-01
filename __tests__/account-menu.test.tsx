import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { AccountMenu } from "@/components/shell/account-menu";
import en from "@/messages/en.json";
import { mockViewer, type Viewer } from "@/lib/viewer";

function open(viewer: Viewer | null) {
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <AccountMenu viewer={viewer} />
    </NextIntlClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: en.Nav.account }));
}

// Anonymous read access is a product requirement, and the account control is the most
// account-looking thing on the screen: it has to work with no session behind it.
test("the account menu opens for an anonymous visitor", () => {
  open(null);

  expect(screen.getByText(en.Account.signedOut)).toBeDefined();
});

// Sign-in is the only gate in the product, so the menu's one live action must reach it.
test("the sign-in item opens the sign-in dialog", () => {
  open(null);

  fireEvent.click(screen.getByRole("menuitem", { name: en.Nav.signIn }));

  expect(screen.getByRole("heading", { name: en.Auth.title })).toBeDefined();
  expect(screen.getByRole("button", { name: en.Auth.google })).toBeDefined();
});

// Identity safety (AGENTS.md): with no viewer — which is what production ships, since
// `getViewer()` returns null there — the menu may assert the *absence* of a session and
// nothing more. A handle, a name, or a photo leaking into the signed-out state would be
// a pseudonymity failure, not a cosmetic one.
test("the signed-out menu asserts no logged-in identity", () => {
  open(null);

  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.queryByText(/@/)).toBeNull();
  expect(screen.queryByText(mockViewer.handle)).toBeNull();
  expect(screen.queryByText(en.Account.signOut)).toBeNull();
});

// A destination that needs an identity to mean anything is disabled with a "soon" cue
// rather than shipped as a link that 404s — the left-nav convention. "Your profile" is
// that case while signed out: there is no *your* profile without a session.
test("the signed-out menu disables the profile item rather than linking it", () => {
  open(null);

  const item = screen.getByText(en.Account.profile).closest('[role="menuitem"]');
  expect(item).not.toBeNull();
  expect(item?.getAttribute("data-disabled")).not.toBeNull();
});

// Settings links in both states: the page itself handles a visitor with no account, so
// there is no reason to make the route unreachable from the menu.
test("settings links to the settings page in both states", () => {
  open(null);
  expect(
    screen
      .getByRole("menuitem", { name: en.Account.settings })
      .getAttribute("href"),
  ).toBe("/settings");
});

// The signed-in design (a preview until Better Auth lands): who you are, and which
// provider you came in through, so an account reachable by two sign-in routes is
// unambiguous.
test("the signed-in menu shows the identity and the sign-in provider", () => {
  open(mockViewer);

  expect(screen.getByText(mockViewer.displayName!)).toBeDefined();
  expect(screen.getByText(`@${mockViewer.handle}`)).toBeDefined();
  expect(screen.getByText("Signed in with GitHub")).toBeDefined();
});

// OAuth emails are never public (AGENTS.md) — including to their own owner in a menu
// that could be shoulder-surfed or screenshotted.
test("the signed-in menu never shows an email", () => {
  open(mockViewer);

  expect(screen.queryByText(/@[\w-]+\.\w{2,}/)).toBeNull();
});

// Profile is the one destination that already exists (PBI-017), so signed in it is a
// real link rather than another "soon".
test("the signed-in menu links to the viewer's own profile", () => {
  open(mockViewer);

  expect(
    screen.getByRole("menuitem", { name: en.Account.profile }).getAttribute("href"),
  ).toBe(`/developers/${mockViewer.handle}`);
});

// The AJ fonts are Regular-only, so any weight above 400 synthesizes faux-bold and
// distorts Myanmar tone marks. Every string here can render in Shan.
test("no localized text in the menu carries a bold weight", () => {
  open(null);

  const localized = [
    screen.getByText(en.Account.signedOut),
    screen.getByText(en.Account.signedOutHint),
    screen.getByText(en.Account.settings),
  ];

  for (const element of localized) {
    expect(element.className).not.toMatch(/font-(bold|semibold|medium)/);
  }
});
