import type { Developer } from "./developers";

// Types and pure helpers only — no database or Supabase imports, or the client
// components that read `PROVIDER` would pull Prisma into the browser bundle.
// `getCurrentUser()` lives in `lib/auth/current-user.ts`.

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

export function isAuthenticated(user: CurrentUser | null): boolean {
  return user !== null;
}

export function isAdmin(user: CurrentUser | null): boolean {
  return user?.moderator === true;
}

export function isOwner(user: CurrentUser | null, handle: string): boolean {
  return user?.handle === handle;
}
