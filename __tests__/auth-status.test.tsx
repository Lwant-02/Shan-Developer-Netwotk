import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";

import {
  AnonymousOnly,
  AuthedOnly,
  CurrentUserProvider,
  ResolvingOnly,
  useAuthStatus,
} from "@/components/auth/current-user";
import en from "@/messages/en.json";

const resolve = vi.hoisted(() => ({ current: null as ((u: unknown) => void) | null }));

vi.mock("@/components/auth/session-island", () => ({
  SessionIsland: ({ onResolved }: { onResolved: (u: unknown) => void }) => {
    resolve.current = onResolved;
    return null;
  },
}));

function Probe() {
  return (
    <>
      <span>status:{useAuthStatus()}</span>
      <AnonymousOnly>
        <span>anonymous-slot</span>
      </AnonymousOnly>
      <ResolvingOnly>
        <span>skeleton-slot</span>
      </ResolvingOnly>
      <AuthedOnly>
        <span>authed-slot</span>
      </AuthedOnly>
    </>
  );
}

function mount() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <CurrentUserProvider>
        <Probe />
      </CurrentUserProvider>
    </NextIntlClientProvider>,
  );
}

afterEach(() => {
  document.cookie = "sdn.session=; max-age=0; path=/";
  resolve.current = null;
});

test("an anonymous visitor never sees a skeleton", () => {
  mount();

  expect(screen.getByText("status:anonymous")).toBeDefined();
  expect(screen.getByText("anonymous-slot")).toBeDefined();
  expect(screen.queryByText("skeleton-slot")).toBeNull();
});

test("a visitor carrying the session hint gets the skeleton, not the signed-out shell", () => {
  document.cookie = "sdn.session=1; path=/";

  mount();

  expect(screen.getByText("status:resolving")).toBeDefined();
  expect(screen.getByText("skeleton-slot")).toBeDefined();
  expect(screen.queryByText("anonymous-slot")).toBeNull();
});

test("the skeleton is replaced once the session resolves", async () => {
  document.cookie = "sdn.session=1; path=/";

  mount();
  expect(screen.getByText("skeleton-slot")).toBeDefined();

  await waitFor(() => expect(resolve.current).not.toBeNull());
  resolve.current?.({ handle: "lwant", role: "", provider: "google" });

  await waitFor(() => expect(screen.getByText("authed-slot")).toBeDefined());
  expect(screen.queryByText("skeleton-slot")).toBeNull();
});

test("a hint with no real session falls back to the signed-out shell", async () => {
  document.cookie = "sdn.session=1; path=/";

  mount();

  await waitFor(() => expect(resolve.current).not.toBeNull());
  resolve.current?.(null);

  await waitFor(() => expect(screen.getByText("anonymous-slot")).toBeDefined());
  expect(screen.queryByText("skeleton-slot")).toBeNull();
});
