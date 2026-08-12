"use client";

import { useIsAdmin } from "@/components/auth/current-user";
import { NavItem } from "./nav-item";

export function AdminNavItem({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  const isAdmin = useIsAdmin();

  if (!isAdmin) return null;

  return <NavItem icon={icon} label={label} href="/admin" />;
}
