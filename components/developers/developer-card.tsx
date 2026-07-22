import { Calendar, FileText, FolderGit2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Developer } from "@/lib/developers";
import { getEventsByHost } from "@/lib/events";
import { postsByAuthor } from "@/lib/feed";
import { getProjectsByAuthor } from "@/lib/projects";

// A directory tile: the whole card links to the profile. Stacked (flex-col) — avatar and
// name up top, bio, then a location + activity-count footer. Contains only text/icons, so
// a plain wrapping Link is fine. Avatar is initials only — never a photo, presence, or
// verified/real identity (the identity-safety rule).
export function DeveloperCard({ developer }: { developer: Developer }) {
  const t = useTranslations("Developers");
  const name = developer.displayName ?? developer.handle;

  const stats = [
    { icon: FileText, label: t("posts"), count: postsByAuthor(developer.handle).length },
    {
      icon: FolderGit2,
      label: t("projects"),
      count: getProjectsByAuthor(developer.handle).length,
    },
    {
      icon: Calendar,
      label: t("events"),
      count: getEventsByHost(developer.handle).length,
    },
  ];

  return (
    <Link
      href={`/developers/${developer.handle}`}
      className="border-border hover:bg-muted/60 flex h-full flex-col gap-3 rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center rounded-full text-sm uppercase"
        >
          {developer.handle.slice(0, 2)}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm">{name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {developer.role}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
        {developer.bio}
      </p>

      <div className="mt-auto flex flex-col gap-2">
        {developer.location && (
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <MapPin className="size-3" />
            {developer.location}
          </span>
        )}
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          {stats.map(({ icon: Icon, label, count }) => (
            <span
              key={label}
              className="flex items-center gap-1"
              aria-label={`${count} ${label}`}
            >
              <Icon className="size-3.5" />
              <span className="tabular-nums">{count}</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
