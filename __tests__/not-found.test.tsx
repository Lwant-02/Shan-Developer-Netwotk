import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import NotFound from "@/app/[locale]/not-found";
import shn from "@/messages/shn.json";
import en from "@/messages/en.json";

function renderAt(locale: string, messages: Record<string, unknown>) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NotFound />
    </NextIntlClientProvider>
  );
}

// Anonymous read access is a product requirement, and a 404 is a page a visitor
// reaches without a session more often than any other.
test("404 renders for an anonymous visitor", () => {
  renderAt("en", en);

  expect(screen.getByText(en.NotFound.title)).toBeDefined();
});

// The way back must keep the visitor in the locale they arrived in; falling back
// to the default would silently move an English reader to Shan.
test("the home link preserves the active locale", () => {
  renderAt("en", en);
  expect(screen.getByRole("link").getAttribute("href")).toBe("/en");

  renderAt("shn", shn);
  const links = screen.getAllByRole("link");
  expect(links[links.length - 1].getAttribute("href")).toBe("/shn");
});

// notFound() renders outside the locale layout, so the font variables and lang
// have to come from the page itself or Shan silently loses its face.
test("carries the font variables and a lang attribute itself", () => {
  const { container } = renderAt("shn", shn);
  const root = container.firstElementChild;

  expect(root?.getAttribute("lang")).toBe("shn");
  expect(root?.className).toMatch(/aj12/);
});

// The AJ fonts are Regular only; bold is synthesized and distorts Myanmar marks.
test("uses no bold weight", () => {
  const { container } = renderAt("shn", shn);

  expect(container.innerHTML).not.toMatch(/font-bold|font-semibold/);
});

test("shn 404 renders Shan script", () => {
  renderAt("shn", shn);

  expect(screen.getByText(shn.NotFound.title)).toBeDefined();
  expect(screen.getByText(shn.NotFound.description)).toBeDefined();
  expect(screen.getByText(shn.NotFound.home)).toBeDefined();
});

