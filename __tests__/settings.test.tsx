import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { SettingsForm } from "@/components/settings/settings-form";
import { getDeveloperByHandle } from "@/lib/developers";
import en from "@/messages/en.json";
import { mockViewer } from "@/lib/viewer";

const developer = getDeveloperByHandle(mockViewer.handle);

function renderForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SettingsForm viewer={mockViewer} developer={developer} />
    </NextIntlClientProvider>,
  );
}

// The point of the page: it edits what the public profile actually shows, so it starts
// from the current values rather than an empty form.
test("the form is prefilled from the public profile", () => {
  renderForm();

  expect(screen.getByLabelText(en.Settings.fieldRole)).toHaveProperty(
    "value",
    developer!.role,
  );
  expect(screen.getByLabelText(en.Settings.fieldBio)).toHaveProperty(
    "value",
    developer!.bio,
  );
  expect(screen.getByLabelText(en.Settings.fieldLocation)).toHaveProperty(
    "value",
    developer!.location,
  );
});

// Identity safety (AGENTS.md, design.md): OAuth emails are never public, and a settings
// form is the most likely place for an email field to creep in. There must not be one.
test("the form has no email field", () => {
  const { container } = renderForm();

  expect(screen.queryByLabelText(/e-?mail/i)).toBeNull();
  expect(container.querySelector('input[type="email"]')).toBeNull();
  expect(container.textContent).not.toMatch(/e-?mail/i);
});

// Location is coarse and optional by design — a settings form that doesn't say so
// invites someone to type a street address.
test("the location field says it is optional and coarse", () => {
  renderForm();

  expect(screen.getByText(en.Settings.hintLocation)).toBeDefined();
});

// Saving is a write over identity data: it needs auth and a rate-limited endpoint. Until
// then Save must not look like it works — silently discarding edits is worse than an
// honest disabled control.
test("save is disabled and says why", () => {
  renderForm();

  expect(screen.getByRole("button", { name: en.Settings.save })).toHaveProperty(
    "disabled",
    true,
  );
  expect(screen.getByText(en.Settings.notSaved)).toBeDefined();
});

// The AJ fonts are Regular-only, so any weight above 400 is faux-bold on Shan.
test("no localized text in the form carries a bold weight", () => {
  renderForm();

  const localized = [
    screen.getByText(en.Settings.fieldLinks),
    screen.getByText(en.Settings.notSaved),
    screen.getByRole("button", { name: en.Settings.save }),
  ];

  for (const element of localized) {
    expect(element.className).not.toMatch(/font-(bold|semibold|medium)/);
  }
});
