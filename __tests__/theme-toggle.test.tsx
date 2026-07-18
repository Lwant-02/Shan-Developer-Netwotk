import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

import { ThemeToggle } from "@/components/shell/theme-toggle";
import en from "@/messages/en.json";

function renderToggle() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

// Theming is not gated: an anonymous visitor gets the control, like everything else
// that is readable without a session.
test("the theme control renders for an anonymous visitor", () => {
  renderToggle();

  expect(screen.getByRole("button", { name: "Light" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Dark" })).toBeDefined();
});

// Both options are always in the DOM and the active one is highlighted by CSS off
// `.dark`. A state-driven highlight would mismatch on hydration, since the server
// cannot know the visitor's theme.
test("the active option is highlighted by a dark: variant, not state", () => {
  const { container } = renderToggle();

  expect(container.innerHTML).toContain("dark:bg-muted");
});

// The AJ fonts are Regular-only, so any bold on Shan is faux-bold.
test("the toggle uses no bold weight", () => {
  const { container } = renderToggle();

  expect(container.innerHTML).not.toMatch(/font-(bold|semibold|medium)/);
});
