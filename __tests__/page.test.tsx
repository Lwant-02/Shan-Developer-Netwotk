import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { PostFeed } from "@/components/feed/post-feed";
import { RightRail } from "@/components/shell/right-rail";
import shn from "@/messages/shn.json";
import en from "@/messages/en.json";

function renderAt(
  locale: string,
  messages: Record<string, unknown>,
  node: React.ReactNode
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {node}
    </NextIntlClientProvider>
  );
}

// Anonymous read access is a product requirement: the feed renders with no session
// and no auth provider.
test("the feed renders for an anonymous visitor", () => {
  renderAt("en", en, <PostFeed />);

  expect(
    screen.getByText(/Shipped my first Shan keyboard/)
  ).toBeDefined();
});

// Shan script must survive on /shn even while new chrome strings are placeholders —
// the greeting in the welcome card is real Shan.
test("shn home renders Shan script content", () => {
  const { container } = renderAt("shn", shn, <RightRail />);

  // U+1000–U+109F is the Myanmar block, which Shan is written in.
  expect(container.textContent).toMatch(/[က-႟]/);
});

// Guards against the two locales silently rendering identical content.
test("en home renders English, not the Shan strings", () => {
  const { container } = renderAt("en", en, <RightRail />);

  expect(container.textContent).not.toMatch(/[က-႟]/);
});
