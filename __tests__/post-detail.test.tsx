import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { CommentThread } from "@/components/feed/comment-thread";
import { getCommentsFor } from "@/lib/comments";
import en from "@/messages/en.json";
import shn from "@/messages/shn.json";

// The async post page can't be rendered by Vitest (per the Next testing guide), so the
// synchronous comment section stands in for the detail view's anonymous-read guarantees.
function renderAt(
  locale: string,
  messages: Record<string, unknown>,
  node: React.ReactNode,
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {node}
    </NextIntlClientProvider>,
  );
}

const thread = getCommentsFor("shan-word-segmentation-search");

// Anonymous read access is a product requirement: the thread renders with no session
// and no auth provider.
test("the comment thread renders for an anonymous visitor", () => {
  renderAt("en", en, <CommentThread comments={thread} />);

  expect(screen.getByText(/custom dictionary/)).toBeDefined();
});

// Shan script must survive on /shn — the count heading reuses the translated "comments"
// label, so the section carries Myanmar-block script even while comment bodies are English.
test("shn post detail renders Shan script", () => {
  const { container } = renderAt("shn", shn, <CommentThread comments={thread} />);

  // U+1000–U+109F is the Myanmar block, which Shan is written in.
  expect(container.textContent).toMatch(/[က-႟]/);
});

// Guards against the two locales silently rendering identical content.
test("en post detail renders English, not the Shan strings", () => {
  const { container } = renderAt("en", en, <CommentThread comments={thread} />);

  expect(container.textContent).not.toMatch(/[က-႟]/);
});

// Commenting is gated behind sign-in: the composer is present but never asserts a
// logged-in identity — it opens the sign-in dialog.
test("the comment composer is a sign-in gate", () => {
  renderAt("en", en, <CommentThread comments={[]} />);

  expect(screen.getByText("Sign in to comment")).toBeDefined();
});
