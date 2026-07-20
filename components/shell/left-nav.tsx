import {
  Calendar,
  CodeXml,
  FolderGit2,
  House,
  Info,
  type LucideIcon,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CollapsedNavTooltip } from "./collapsed-nav-tooltip";

// Only Home exists. Everything else is disabled with a "soon" cue rather than shipping
// links that 404 (agreed at PBI-010 time).
const items = [
  { key: "home", icon: House, href: "/" },
  { key: "developers", icon: CodeXml },
  { key: "community", icon: Users },
  { key: "projects", icon: FolderGit2 },
  { key: "events", icon: Calendar },
] as const;

const secondary = [{ key: "about", icon: Info }] as const;

// Collapsed styling is driven by the `group/nav` set on NavCollapse, so it is inert
// wherever LeftNav is used without it (the mobile drawer).
const item =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors group-data-[collapsed=true]/nav:justify-center group-data-[collapsed=true]/nav:px-0";
const hideOnCollapse = "group-data-[collapsed=true]/nav:hidden";

// `aria-label` carries the accessible name because the visible label is display:none in
// the collapsed rail, which removes it from the accessibility tree.
function NavItem({
  icon: Icon,
  label,
  href,
  soon,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  soon?: string;
}) {
  if (href) {
    return (
      <CollapsedNavTooltip label={label}>
        <Link
          href={href}
          aria-current="page"
          aria-label={label}
          className={cn(item, "bg-muted text-foreground")}
        >
          <Icon className="size-5 shrink-0" />
          <span className={hideOnCollapse}>{label}</span>
        </Link>
      </CollapsedNavTooltip>
    );
  }

  return (
    <CollapsedNavTooltip label={label}>
      <span
        aria-disabled="true"
        aria-label={label}
        className={cn(item, "text-muted-foreground hover:bg-muted/60")}
      >
        <Icon className="size-5 shrink-0 opacity-70" />
        <span className={hideOnCollapse}>{label}</span>
        <span
          className={cn(
            "text-muted-foreground/80 ml-auto text-[10px]",
            hideOnCollapse,
          )}
        >
          {soon}
        </span>
      </span>
    </CollapsedNavTooltip>
  );
}

export function LeftNav({ className }: { className?: string }) {
  const t = useTranslations("Nav");

  return (
    <nav className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-0.5 pb-3">
        {items.map(({ key, icon, ...rest }) => (
          <NavItem
            key={key}
            icon={icon}
            label={t(key)}
            href={"href" in rest ? rest.href : undefined}
            soon={t("comingSoon")}
          />
        ))}
      </div>

      <hr className="border-border my-3" />

      <div className="flex flex-col gap-0.5">
        {secondary.map(({ key, icon }) => (
          <NavItem
            key={key}
            icon={icon}
            label={t(key)}
            soon={t("comingSoon")}
          />
        ))}
      </div>

      <div
        className={cn(
          "text-muted-foreground/70 mt-6 flex flex-col items-center gap-1 px-3 text-center text-xs leading-relaxed",
          hideOnCollapse,
        )}
      >
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        {/* Inert, not links: neither document exists yet, and this repo does not ship
            links that 404. They become real links when the pages are written — along
            with the same two names in the sign-in dialog's consent line. */}
        <p aria-disabled="true">
          <span>{t("terms")}</span>
          <span aria-hidden="true"> · </span>
          <span>{t("privacy")}</span>
        </p>
      </div>
    </nav>
  );
}
