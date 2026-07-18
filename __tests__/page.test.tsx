import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { Home } from "@/app/[locale]/page";
import shn from "@/messages/shn.json";
import en from "@/messages/en.json";

function renderAt(locale: string, messages: Record<string, unknown>) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Home />
    </NextIntlClientProvider>
  );
}

// Anonymous read access is a product requirement: no session, no auth provider.
test("home page renders for an anonymous visitor", () => {
  renderAt("shn", shn);

  expect(screen.getByText(/မႂ်ႇသုင်ၶႃႈ/)).toBeDefined();
});

test("shn locale renders Shan script content", () => {
  const { container } = renderAt("shn", shn);

  // U+1000–U+109F is the Myanmar block, which Shan is written in.
  expect(container.textContent).toMatch(/[က-႟]/);
});

// Guards against both locales silently rendering the same strings.
test("en locale renders English, not the Shan strings", () => {
  const { container } = renderAt("en", en);

  expect(container.textContent).toMatch(/Shan Developer Network/);
  expect(container.textContent).not.toMatch(/[က-႟]/);
});
