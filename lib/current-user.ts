import type { Developer } from "./developers";

export type AuthProvider = "google" | "github";

export const AUTH_SESSION_COOKIE = "better-auth.session_token";

export const SESSION_HINT_COOKIE = "sdn.session";

export const PROVIDER: Record<
  AuthProvider,
  { label: string; icon: string; invert?: boolean }
> = {
  google: { label: "Google", icon: "/icons/google.svg" },
  github: { label: "GitHub", icon: "/icons/github.svg", invert: true },
};

export type CurrentUser = Pick<Developer, "handle" | "displayName" | "role"> & {
  provider: AuthProvider;
  avatarUrl?: string;
  moderator?: boolean;
};

export function isAuthenticated(user: CurrentUser | null): boolean {
  return user !== null;
}

export function isAdmin(user: CurrentUser | null): boolean {
  return user?.moderator === true;
}

export function isOwner(user: CurrentUser | null, handle: string): boolean {
  return user?.handle === handle;
}
