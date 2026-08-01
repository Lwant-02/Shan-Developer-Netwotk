"use client";

import { useIsOwner } from "@/components/auth/current-user";
import { ProfileOwnerMenu } from "./profile-owner-menu";

export function ProfileOwnerSlot({ handle }: { handle: string }) {
  if (!useIsOwner(handle)) return null;

  return <ProfileOwnerMenu />;
}
