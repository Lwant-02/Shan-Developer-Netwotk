import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";

import {
  CurrentUserProvider,
  useCurrentUser,
} from "@/components/auth/current-user";
import en from "@/messages/en.json";

function mount() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <CurrentUserProvider>
        <Probe />
      </CurrentUserProvider>
    </NextIntlClientProvider>,
  );
}

function Probe() {
  const user = useCurrentUser();
  return <span>{user ? user.handle : "anonymous"}</span>;
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.cookie = "sb-test-auth-token=; max-age=0; path=/";
});

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

  expect(screen.getByText("anonymous")).toBeDefined();

  await waitFor(() => expect(screen.getByText("tai_builds")).toBeDefined());
});

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
