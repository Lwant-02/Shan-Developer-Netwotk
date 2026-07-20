import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import en from "@/messages/en.json";

function renderDialog() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SignInDialog>
        <button type="button">{en.Nav.signIn}</button>
      </SignInDialog>
    </NextIntlClientProvider>
  );
}

function open() {
  renderDialog();
  fireEvent.click(screen.getByRole("button", { name: en.Nav.signIn }));
}

// Sign-in is the only gate in the product, so the way in has to be reachable without
// a session — the trigger renders for a visitor who has none.
test("the sign-in trigger renders for an anonymous visitor", () => {
  renderDialog();

  expect(screen.getByRole("button", { name: en.Nav.signIn })).toBeDefined();
});

// design.md settles OAuth-only, with exactly these two providers. A third option
// appearing here would mean a second, weaker verification tier the product doesn't have.
test("the dialog offers Google and GitHub, and nothing else", () => {
  open();

  expect(screen.getByRole("button", { name: en.Auth.google })).toBeDefined();
  expect(screen.getByRole("button", { name: en.Auth.github })).toBeDefined();
  expect(screen.queryByLabelText(/password/i)).toBeNull();
});

// Identity is sensitive here: pseudonymity is supported and the OAuth email is never
// public. The visitor has to be told that before handing over an identity, not after.
test("the dialog states that the email stays private", () => {
  open();

  expect(screen.getByText(en.Auth.privacy)).toBeDefined();
});

// The consent the visitor agrees to must point at the real documents, not 404s
// (PBI-015). Both links resolve to their locale-aware routes.
test("the consent line links to the Terms and Privacy pages", () => {
  open();

  expect(
    screen.getByRole("link", { name: /Terms of Service/ }).getAttribute("href")
  ).toBe("/terms");
  expect(
    screen.getByRole("link", { name: /Privacy Policy/ }).getAttribute("href")
  ).toBe("/privacy");
});

// Consent is a precondition, not a footnote: neither provider can be used until the
// visitor has actively agreed.
test("both providers stay disabled until consent is given", () => {
  open();

  const google = screen.getByRole("button", { name: en.Auth.google });
  const github = screen.getByRole("button", { name: en.Auth.github });

  expect(google).toHaveProperty("disabled", true);
  expect(github).toHaveProperty("disabled", true);

  fireEvent.click(screen.getByRole("checkbox"));

  expect(google).toHaveProperty("disabled", false);
  expect(github).toHaveProperty("disabled", false);
});

// The AJ fonts are Regular-only, so any weight above 400 is faux-bold and distorts
// Myanmar tone marks. Both `buttonVariants` and the registry `DialogTitle` ship
// `font-medium`, so every localized element here overrides it at the call site — this
// pins those overrides. Scoped to the strings we author: the registry close button
// keeps `font-medium` but renders only an English `sr-only` label, never Shan.
test("no localized text in the dialog carries a bold weight", () => {
  open();

  const localized = [
    // By role, not text: the trigger label and the dialog title are both "Sign in".
    screen.getByRole("heading", { name: en.Auth.title }),
    screen.getByText(en.Auth.description),
    screen.getByRole("button", { name: en.Auth.google }),
    screen.getByRole("button", { name: en.Auth.github }),
    // Consent renders as rich text (links), so match its leading run, not the raw
    // string with tags.
    screen.getByText(/I agree to the/),
    screen.getByText(en.Auth.privacy),
  ];

  for (const element of localized) {
    expect(element.className).not.toMatch(/font-(bold|semibold|medium)/);
  }
});
