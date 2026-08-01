import type { CurrentUser } from "@/lib/current-user";

// A signed-in visitor for tests. This used to be `mockUser` in `lib/user.ts`, which
// shipped in the app bundle to drive the `next dev` design preview; PBI-028 replaced that
// with a real session, so the fixture belongs to the tests now and nowhere else.
//
// The handle matches one in `mockDevelopers`, so a test that follows "Your profile"
// reaches a real page rather than a 404.
export const testUser: CurrentUser = {
  handle: "tai_builds",
  displayName: "Tai Builds",
  role: "Keyboard & Input Developer",
  provider: "github",
  moderator: true,
};
