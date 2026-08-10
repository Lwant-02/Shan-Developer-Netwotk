"use client";

import { useAuthStatus, useIsAdmin } from "@/components/auth/current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { NavItem } from "./nav-item";

export function AdminNavItem({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  const status = useAuthStatus();
  const isAdmin = useIsAdmin();

  if (status === "resolving")
    return <Skeleton className="h-9 w-full rounded-lg" />;
  if (!isAdmin) return null;

  return <NavItem icon={icon} label={label} href="/admin" />;
}
