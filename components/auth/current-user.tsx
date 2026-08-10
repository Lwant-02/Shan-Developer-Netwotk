"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentType,
} from "react";
import { toast } from "sonner";

import {
  SESSION_HINT_COOKIE,
  isAdmin,
  isOwner,
  type CurrentUser,
} from "@/lib/current-user";

type IslandProps = { onResolved: (user: CurrentUser | null) => void };

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

const hasSessionHint = () =>
  document.cookie
    .split(";")
    .some((c) => c.split("=")[0].trim() === SESSION_HINT_COOKIE);

function announceReturn(messages: {
  signedIn: string;
  signedOut: string;
  failed: string;
}) {
  const url = new URL(window.location.href);
  const signedIn = url.searchParams.has("signed_in");
  const signedOut = url.searchParams.has("signed_out");
  const failed = url.searchParams.has("auth_error");
  if (!signedIn && !signedOut && !failed) return;

  if (signedIn) toast.success(messages.signedIn);
  else if (signedOut) toast.success(messages.signedOut);
  else toast.error(messages.failed);

  url.searchParams.delete("signed_in");
  url.searchParams.delete("signed_out");
  url.searchParams.delete("auth_error");
  window.history.replaceState(null, "", url.toString());
}

export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [Island, setIsland] = useState<ComponentType<IslandProps> | null>(null);
  const t = useTranslations("Auth");
  const tAccount = useTranslations("Account");

  const onResolved = useCallback(
    (resolved: CurrentUser | null) => setUser(resolved),
    [],
  );

  useEffect(() => {
    announceReturn({
      signedIn: t("signedInToast"),
      signedOut: tAccount("signedOutToast"),
      failed: t("signInFailedToast"),
    });

    if (!hasSessionHint()) return;

    let active = true;

    import("./session-island").then(({ SessionIsland }) => {
      if (active) setIsland(() => SessionIsland);
    });

    return () => {
      active = false;
    };
  }, [t, tAccount]);

  return (
    <CurrentUserContext value={user}>
      {Island ? <Island onResolved={onResolved} /> : null}
      {children}
    </CurrentUserContext>
  );
}
