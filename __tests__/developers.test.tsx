import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { DeveloperDirectory } from "@/components/developers/developer-directory";
import { ProfileHeader } from "@/components/developers/profile-header";
import { getDeveloperByHandle, mockDevelopers } from "@/lib/developers";
import en from "@/messages/en.json";
import shn from "@/messages/shn.json";

// The async pages can't be rendered by Vitest (per the Next testing guide), so the
// synchronous directory and profile-header pieces stand in for the anonymous-read and
// identity-safety guarantees.
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

// Anonymous read access is a product requirement: the directory renders with no session.
test("the directory renders for an anonymous visitor", () => {
  renderAt("en", en, <DeveloperDirectory developers={mockDevelopers} />);

  expect(screen.getByText("tai_builds")).toBeDefined();
});

// Shan script must survive on /shn — the heading reuses the translated Nav.developers.
test("shn directory renders Shan script", () => {
  const { container } = renderAt(
    "shn",
    shn,
    <DeveloperDirectory developers={mockDevelopers} />,
  );

  // U+1000–U+109F is the Myanmar block, which Shan is written in.
  expect(container.textContent).toMatch(/[က-႟]/);
});

// Identity safety: a profile must never render an email address. The mock has no email
// field; this guards against one being introduced and surfaced later.
test("a profile never renders an email address", () => {
  const developer = getDeveloperByHandle("tai_builds")!;
  const { container } = renderAt("en", en, <ProfileHeader developer={developer} />);

  expect(container.textContent).not.toMatch(/\S+@\S+\.\S+/);
});

// Location is coarse and optional: a member who shares none must still render.
test("a member with no location still renders", () => {
  const developer = getDeveloperByHandle("mongla_dev")!;
  expect(developer.location).toBeUndefined();

  renderAt("en", en, <ProfileHeader developer={developer} />);

  // A bio-only phrase (avoids colliding with the "Open-Source Developer" role).
  expect(screen.getByText(/odds and ends/i)).toBeDefined();
});
