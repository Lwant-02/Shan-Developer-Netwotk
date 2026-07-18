import { Calendar, FileText, FolderGit2, House, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

// Projects/Posts/Events/People pages don't exist yet, so those items are disabled
// with a "soon" cue rather than shipping links that 404 (agreed at PBI-010 time).
const items = [
  { key: "home", icon: House, href: "/" },
  { key: "projects", icon: FolderGit2 },
  { key: "posts", icon: FileText },
  { key: "events", icon: Calendar },
  { key: "people", icon: Users },
] as const;

// Collapsed styling is driven by the `group/nav` set on NavCollapse, so it is inert
// wherever LeftNav is used without it (the mobile drawer).
const item =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors group-data-[collapsed=true]/nav:justify-center group-data-[collapsed=true]/nav:px-0";
const hideOnCollapse = "group-data-[collapsed=true]/nav:hidden";

export function LeftNav({ className }: { className?: string }) {
  const t = useTranslations("Nav");

  return (
    <nav className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-0.5 pb-3">
        {items.map(({ key, icon: Icon, ...rest }) => {
          const label = t(key);

          if ("href" in rest) {
            return (
              <Link
                key={key}
                href={rest.href}
                aria-current="page"
                title={label}
                className={cn(item, "bg-muted text-foreground")}
              >
                <Icon className="size-5 shrink-0" />
                <span className={hideOnCollapse}>{label}</span>
              </Link>
            );
          }

          return (
            <span
              key={key}
              aria-disabled="true"
              title={label}
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
                {t("comingSoon")}
              </span>
            </span>
          );
        })}
      </div>

      <hr className="border-border my-3" />

      {/* Secondary group — About, Help and the rest land here as they exist. The
          segmented control has no room in the collapsed rail. */}
      <div className={cn("flex flex-col gap-0.5 px-3", hideOnCollapse)}>
        <ThemeToggle />
      </div>

      <p
        className={cn(
          "text-muted-foreground/70 mt-6 px-3 text-center text-xs leading-relaxed",
          hideOnCollapse,
        )}
      >
        © {new Date().getFullYear()} {siteConfig.name}
      </p>
    </nav>
  );
}
