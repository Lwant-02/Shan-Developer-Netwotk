import {
  Calendar,
  CodeXml,
  FileText,
  FolderGit2,
  Info,
  type LucideIcon,
  MessageSquareText,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AdminNavItem } from "./admin-nav-item";
import { NavItem } from "./nav-item";

// Every entry here resolves to a real page. "Community" sat here disabled with a "soon"
// cue from PBI-010 until it was dropped — it was a slot held by an undecided idea, and
// everything it might have meant is already Feed, Developers, and Events.
const items = [
  { key: "home", icon: MessageSquareText, href: "/" },
  { key: "developers", icon: CodeXml, href: "/developers" },
  { key: "projects", icon: FolderGit2, href: "/projects" },
  { key: "events", icon: Calendar, href: "/events" },
] as const;

const secondary = [
  { key: "terms", icon: FileText, href: "/terms" },
  { key: "privacy", icon: Shield, href: "/privacy" },
  { key: "about", icon: Info, href: "/about" },
] as const;

function icon(Icon: LucideIcon) {
  return <Icon className="size-5" />;
}

export function LeftNav({ className }: { className?: string }) {
  const t = useTranslations("Nav");

  return (
    <nav className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-0.5 pb-3">
        {items.map(({ key, icon: Icon, href }) => (
          <NavItem key={key} icon={icon(Icon)} label={t(key)} href={href} />
        ))}
      </div>

      <hr className="border-border my-3" />

      <div className="flex flex-col gap-0.5">
        {secondary.map(({ key, icon: Icon, href }) => (
          <NavItem key={key} icon={icon(Icon)} label={t(key)} href={href} />
        ))}
        <AdminNavItem label={t("admin")} icon={icon(ShieldCheck)} />
      </div>

      <div className="text-muted-foreground/70 mt-6 flex flex-col items-center gap-2 px-3 text-center text-xs leading-relaxed group-data-[collapsed=true]/nav:hidden">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </nav>
  );
}
