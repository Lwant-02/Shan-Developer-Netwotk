import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";

import { CurrentUserProvider, useCurrentUser } from "@/components/auth/current-user";
import en from "@/messages/en.json";

// The provider reads translations for its sign-in toast, so it needs the intl context.
function mount() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <CurrentUserProvider>
        <Probe />
      </CurrentUserProvider>
    </NextIntlClientProvider>,
  );
}

// The nav's account state is fetched client-side so that public pages stay statically
// prerendered (PBI-028). Two things have to hold for that trade to be worth anything:
// an anonymous reader must make no request at all, and the shell must render the
// signed-out state until the server says otherwise.

function Probe() {
  const user = useCurrentUser();
  return <span>{user ? user.handle : "anonymous"}</span>;
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.cookie = "sb-test-auth-token=; max-age=0; path=/";
});

// The whole point of the island. If this regresses, every anonymous reader on mobile data
// pays for a request that can only ever answer "nobody".
test("an anonymous visitor never asks the server who they are", async () => {
  const fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);

  mount();

  expect(screen.getByText("anonymous")).toBeDefined();
  expect(fetchSpy).not.toHaveBeenCalled();
});

test("a visitor carrying an auth cookie is resolved from the server", async () => {
  document.cookie = "sb-test-auth-token=abc; path=/";

  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        handle: "tai_builds",
        role: "",
        provider: "github",
      }),
    })),
  );

  mount();

  // Signed out until the server answers — the served HTML is static and knows nothing
  // about sessions, so understating is the only safe first paint.
  expect(screen.getByText("anonymous")).toBeDefined();

  await waitFor(() => expect(screen.getByText("tai_builds")).toBeDefined());
});

// A failed lookup must not leave the UI asserting a session it could not confirm.
test("a failed lookup leaves the signed-out nav in place", async () => {
  document.cookie = "sb-test-auth-token=abc; path=/";

  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("offline");
    }),
  );

  mount();

  await waitFor(() => expect(screen.getByText("anonymous")).toBeDefined());
});
