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
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";
import { NavItem } from "./nav-item";

// Home, Developers, Projects, Events, About, Terms, and Privacy have pages. The rest are disabled
// with a "soon" cue rather than shipping links that 404 (agreed at PBI-010 time).
const items = [
  { key: "home", icon: MessageSquareText, href: "/" },
  { key: "developers", icon: CodeXml, href: "/developers" },
  { key: "community", icon: Users },
  { key: "projects", icon: FolderGit2, href: "/projects" },
  { key: "events", icon: Calendar, href: "/events" },
] as const;

const secondary = [
  { key: "terms", icon: FileText, href: "/terms" },
  { key: "privacy", icon: Shield, href: "/privacy" },
  { key: "about", icon: Info, href: "/about" },
] as const;

// Sits with the secondary group rather than the content sections: it is not somewhere
// members browse. Rendered only for a moderator viewer, and `getViewer()` is `null` in
// production — so this never reaches the live site's HTML (PBI-025).
const adminItem = { key: "admin", icon: ShieldCheck, href: "/admin" } as const;

function icon(Icon: LucideIcon) {
  return <Icon className="size-5" />;
}

export function LeftNav({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const secondaryItems = getViewer()?.moderator
    ? [...secondary, adminItem]
    : secondary;

  return (
    <nav className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-0.5 pb-3">
        {items.map(({ key, icon: Icon, ...rest }) => (
          <NavItem
            key={key}
            icon={icon(Icon)}
            label={t(key)}
            href={"href" in rest ? rest.href : undefined}
            soon={t("comingSoon")}
          />
        ))}
      </div>

      <hr className="border-border my-3" />

      <div className="flex flex-col gap-0.5">
        {secondaryItems.map(({ key, icon: Icon, href }) => (
          <NavItem key={key} icon={icon(Icon)} label={t(key)} href={href} />
        ))}
      </div>

      <div className="text-muted-foreground/70 mt-6 flex flex-col items-center gap-2 px-3 text-center text-xs leading-relaxed group-data-[collapsed=true]/nav:hidden">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </nav>
  );
}
