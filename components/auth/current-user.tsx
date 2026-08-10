"use client";

import { createContext, useContext, useMemo, useState } from "react";

import {
  isAdmin,
  isOwner,
  mockCurrentUser,
  type AuthProvider,
  type CurrentUser,
} from "@/lib/current-user";

type AuthActions = {
  signIn: (provider: AuthProvider) => void;
  signOut: () => void;
};

const CurrentUserContext = createContext<CurrentUser | null>(null);

const AuthActionsContext = createContext<AuthActions>({
  signIn: () => {},
  signOut: () => {},
});

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useAuthActions = () => useContext(AuthActionsContext);
export const useIsAuthenticated = () => useCurrentUser() !== null;
export const useIsAdmin = () => isAdmin(useCurrentUser());
export const useIsOwner = (handle: string) => isOwner(useCurrentUser(), handle);

export function AuthedOnly({ children }: { children: React.ReactNode }) {
  return useIsAuthenticated() ? <>{children}</> : null;
}

export function AnonymousOnly({ children }: { children: React.ReactNode }) {
  return useIsAuthenticated() ? null : <>{children}</>;
}

export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(mockCurrentUser);

  const actions = useMemo<AuthActions>(
    () => ({
      signIn: (provider) => setUser({ ...mockCurrentUser, provider }),
      signOut: () => setUser(null),
    }),
    [],
  );

  return (
    <AuthActionsContext value={actions}>
      <CurrentUserContext value={user}>{children}</CurrentUserContext>
    </AuthActionsContext>
  );
}
