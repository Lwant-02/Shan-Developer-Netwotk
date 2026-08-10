"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
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

type AuthStatus = "anonymous" | "resolving" | "authenticated";

const CurrentUserContext = createContext<CurrentUser | null>(null);
const AuthStatusContext = createContext<AuthStatus>("anonymous");

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useAuthStatus = () => useContext(AuthStatusContext);
export const useIsAuthenticated = () => useAuthStatus() === "authenticated";
export const useIsAdmin = () => isAdmin(useCurrentUser());
export const useIsOwner = (handle: string) => isOwner(useCurrentUser(), handle);

export function AuthedOnly({ children }: { children: React.ReactNode }) {
  return useAuthStatus() === "authenticated" ? <>{children}</> : null;
}

export function AnonymousOnly({ children }: { children: React.ReactNode }) {
  return useAuthStatus() === "anonymous" ? <>{children}</> : null;
}

export function ResolvingOnly({ children }: { children: React.ReactNode }) {
  return useAuthStatus() === "resolving" ? <>{children}</> : null;
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
  const [resolved, setResolved] = useState(false);
  const [Island, setIsland] = useState<ComponentType<IslandProps> | null>(null);
  const t = useTranslations("Auth");
  const tAccount = useTranslations("Account");

  const expectsSession = useSyncExternalStore(
    () => () => {},
    hasSessionHint,
    () => false,
  );

  const status: AuthStatus = user
    ? "authenticated"
    : expectsSession && !resolved
      ? "resolving"
      : "anonymous";

  const onResolved = useCallback((next: CurrentUser | null) => {
    setUser(next);
    setResolved(true);
  }, []);

  useEffect(() => {
    announceReturn({
      signedIn: t("signedInToast"),
      signedOut: tAccount("signedOutToast"),
      failed: t("signInFailedToast"),
    });
  }, [t, tAccount]);

  useEffect(() => {
    if (!expectsSession) return;

    let active = true;

    import("./session-island").then(({ SessionIsland }) => {
      if (active) setIsland(() => SessionIsland);
    });

    return () => {
      active = false;
    };
  }, [expectsSession]);

  return (
    <AuthStatusContext value={status}>
      <CurrentUserContext value={user}>
        {Island ? <Island onResolved={onResolved} /> : null}
        {children}
      </CurrentUserContext>
    </AuthStatusContext>
  );
}
