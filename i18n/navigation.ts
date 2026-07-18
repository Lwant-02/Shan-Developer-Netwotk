import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Locale-aware navigation APIs. Link/usePathname/useRouter here keep the active
// locale prefix, so the locale switcher can swap /shn <-> /en on the same path.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
