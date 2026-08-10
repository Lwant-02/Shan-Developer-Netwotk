import type { Developer } from "./developers";

export type AuthProvider = "google" | "github";

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

export const mockCurrentUser: CurrentUser = {
  handle: "tai_builds",
  displayName: "Tai Builds",
  role: "Keyboard & Input Developer",
  provider: "github",
  moderator: true,
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
