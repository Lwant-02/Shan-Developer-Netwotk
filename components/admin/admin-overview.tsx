import { Calendar, FileText, FolderGit2, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { formatDateEn } from "@/lib/datetime";
import { listDevelopers } from "@/lib/developers";
import { listEvents } from "@/lib/events";
import { mockPosts } from "@/lib/feed";
import { listProjects } from "@/lib/projects";

// The cold-start instrument: how much is actually here, at a glance. `design.md`'s
// *Seeding* concern is that a small Shan community either reaches critical mass or drifts
// back to the Facebook group, and until now answering that meant browsing four public
// pages. Server Component — counts are derived, nothing is interactive.
//
// Join dates render month + year only, via the `en` helper: an exact join date is a
// correlation handle, and coarse is the house style for anything identifying.
export function AdminOverview() {
  const t = useTranslations("Admin");

  const developers = listDevelopers();

  const stats = [
    { key: "members", icon: Users, count: developers.length },
    { key: "posts", icon: FileText, count: mockPosts.length },
    { key: "projects", icon: FolderGit2, count: listProjects().length },
    { key: "events", icon: Calendar, count: listEvents().length },
  ] as const;

  const recent = [...developers]
    .sort(
      (a, b) =>
        new Date(b.joinedAtISO).getTime() - new Date(a.joinedAtISO).getTime(),
    )
    .slice(0, 4);

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ key, icon: Icon, count }) => (
          <div
            key={key}
            className="border-border flex flex-col gap-1 rounded-lg border p-4"
          >
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Icon className="size-3.5" />
              {t(key)}
            </span>
            <span className="text-foreground text-2xl tabular-nums">
              {count}
            </span>
          </div>
        ))}
      </div>

      <div className="border-border flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="text-muted-foreground text-xs tracking-wide uppercase">
          {t("recentJoins")}
        </h2>
        <ul className="flex flex-col">
          {recent.map((developer) => (
            <li
              key={developer.handle}
              className="border-border flex items-center justify-between gap-3 border-b py-2 first:pt-0 last:border-0 last:pb-0"
            >
              <Link
                href={`/developers/${developer.handle}`}
                className="text-foreground hover:text-muted-foreground truncate text-sm transition-colors"
              >
                {developer.displayName ?? developer.handle}
              </Link>
              <span className="text-muted-foreground shrink-0 text-xs">
                {formatDateEn(developer.joinedAtISO, {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
