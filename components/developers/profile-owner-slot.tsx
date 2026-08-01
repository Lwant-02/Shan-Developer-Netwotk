"use client";

import { useIsOwner } from "@/components/auth/current-user";
import { ProfileOwnerMenu } from "./profile-owner-menu";

// Decided in the browser: the profile page is public and statically prerendered.
// Safe — the menu only links to `/settings`, which gates on the server.

export function ProfileOwnerSlot({ handle }: { handle: string }) {
  if (!useIsOwner(handle)) return null;

  return <ProfileOwnerMenu />;
}
