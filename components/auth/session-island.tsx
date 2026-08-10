"use client";

import { useEffect } from "react";

import { authClient } from "@/lib/auth/client";
import type { CurrentUser } from "@/lib/current-user";

export function SessionIsland({
  onResolved,
}: {
  onResolved: (user: CurrentUser | null) => void;
}) {
  const { data } = authClient.useSession();

  useEffect(() => {
    onResolved((data?.user as CurrentUser | undefined) ?? null);
  }, [data, onResolved]);

  return null;
}
