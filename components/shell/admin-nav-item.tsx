"use client";

import { useIsAdmin } from "@/components/auth/current-user";
import { NavItem } from "./nav-item";

// A client leaf so `LeftNav` stays a Server Component. Convenience, not a gate —
// `/admin` re-checks on the server.

export function AdminNavItem({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  if (!useIsAdmin()) return null;

  return <NavItem icon={icon} label={label} href="/admin" />;
}
