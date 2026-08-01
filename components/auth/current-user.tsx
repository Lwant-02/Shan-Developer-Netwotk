"use client";

import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { isAdmin, isOwner, type CurrentUser } from "@/lib/current-user";

const CurrentUserContext = createContext<CurrentUser | null>(null);

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useIsAuthenticated = () => useCurrentUser() !== null;
export const useIsAdmin = () => isAdmin(useCurrentUser());
export const useIsOwner = (handle: string) => isOwner(useCurrentUser(), handle);

export function AuthedOnly({ children }: { children: React.ReactNode }) {
  return useIsAuthenticated() ? <>{children}</> : null;
}

export function AnonymousOnly({ children }: { children: React.ReactNode }) {
  return useIsAuthenticated() ? null : <>{children}</>;
}

const hasAuthCookie = () =>
  document.cookie.split(";").some((c) => c.trimStart().startsWith("sb-"));

function announceReturn(t: (key: string) => string) {
  const url = new URL(window.location.href);
  const signedIn = url.searchParams.has("signed_in");
  const failed = url.searchParams.has("auth_error");
  if (!signedIn && !failed) return;

  if (signedIn) toast.success(t("signedInToast"));
  else toast.error(t("signInFailedToast"));

  url.searchParams.delete("signed_in");
  url.searchParams.delete("auth_error");
  window.history.replaceState(null, "", url.toString());
}

export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const t = useTranslations("Auth");

  useEffect(() => {
    announceReturn(t);

    if (!hasAuthCookie()) return;

    const controller = new AbortController();

    fetch("/api/me", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: CurrentUser | null) => setUser(data))
      .catch(() => {});

    return () => controller.abort();
  }, [t]);

  return <CurrentUserContext value={user}>{children}</CurrentUserContext>;
}
