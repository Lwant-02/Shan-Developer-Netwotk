import type { Developer } from "./developers";

// The signed-in visitor — "who am I", as opposed to `Developer`, which is "who is this
// person" as the public directory sees them. The account menu is the only surface that
// renders it (PBI-024).
//
// There is no auth yet, so this is a **design preview, not a session**. `getViewer()`
// returns `null` in production, which is what the live site ships: an anonymous visitor
// who sees the signed-out menu. Better Auth replaces the body of `getViewer()` and
// nothing above it changes.

/** Which OAuth provider the account signed in through. The two `design.md` settles on. */
export type AuthProvider = "google" | "github";

export const PROVIDER: Record<
  AuthProvider,
  { label: string; icon: string; invert?: boolean }
> = {
  google: { label: "Google", icon: "/icons/google.svg" },
  // The supplied mark is near-black on a near-black surface — inverted here for the same
  // reason the sign-in dialog inverts it.
  github: { label: "GitHub", icon: "/icons/github.svg", invert: true },
};

export type Viewer = Pick<Developer, "handle" | "displayName" | "role"> & {
  provider: AuthProvider;
  /** Optional, and unset today: there is no image storage yet (backlog Open Questions),
   *  so every avatar in the UI falls back to initials. Typed now so the fallback has
   *  something to fall back *from* once storage lands. */
  avatarUrl?: string;
  /** Gates the admin surface (PBI-025). A **preview flag, not an authorization system** —
   *  it only ever reads true in the dev preview, because `getViewer()` is `null`
   *  everywhere else. Better Auth replaces it with a real role check. */
  moderator?: boolean;
};

// Keyed to a handle that exists in `mockDevelopers`, so "Your profile" leads somewhere
// real instead of a 404.
export const mockViewer: Viewer = {
  handle: "tai_builds",
  displayName: "Tai Builds",
  role: "Keyboard & Input Developer",
  provider: "github",
  moderator: true,
};

// On for `next dev`, off everywhere else, and forceable on a preview deploy with
// `NEXT_PUBLIC_PREVIEW_VIEWER=1` so the signed-in design can be reviewed on a shared URL.
// Deliberately `=== "development"` rather than `!== "production"`: under test this must
// be `null`, or every "renders for an anonymous visitor" test would quietly be asserting
// against a signed-in shell. Both reads are build-time constants, so pages stay
// statically prerendered.
const previewSignedIn =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_PREVIEW_VIEWER === "1";

export function getViewer(): Viewer | null {
  return previewSignedIn ? mockViewer : null;
}
