"use client";

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  VisualState,
  type Action,
} from "kbar";
import {
  Calendar,
  CodeXml,
  FileText,
  FolderGit2,
  Languages,
  MessageSquareText,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { mockPosts } from "@/lib/feed";
import { cn } from "@/lib/utils";

const icon = "size-4 shrink-0 opacity-70";

function Results() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      maxHeight={320}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="text-muted-foreground px-4 py-2 text-xs uppercase">
            {item}
          </div>
        ) : (
          <div
            className={cn(
              "mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
              active ? "bg-muted text-foreground" : "text-muted-foreground",
            )}
          >
            {item.icon}
            <span className="flex-1 truncate">{item.name}</span>
            {item.subtitle && (
              <span className="text-muted-foreground shrink-0 text-xs">
                {item.subtitle}
              </span>
            )}
          </div>
        )
      }
    />
  );
}

// Opens itself as soon as it mounts: it is only ever mounted because the visitor
// already asked for search, so making them press again would be a bug.
//
// Two traps here, both hit on the way in:
//
// `query.toggle()` flips, and React runs effects twice in dev StrictMode — the palette
// opened and instantly closed. So the state is set explicitly, which is idempotent.
//
// It must be `animatingIn`, not `showing`. KBarAnimator renders at `opacity: 0` and
// only animates to 1 while `animatingIn`; jumping straight to `showing` skips the
// animation and leaves an invisible dialog behind a visible backdrop. kbar moves it
// on to `showing` itself once the animation finishes.
// `openSignal` increments on every activation. The palette stays mounted after it is
// dismissed, so re-opening has to be driven by a changing value rather than by mount.
function OpenOnSignal({ openSignal }: { openSignal: number }) {
  const { query } = useKBar();

  useEffect(() => {
    query.setVisualState(VisualState.animatingIn);
  }, [query, openSignal]);

  return null;
}

function Palette() {
  const t = useTranslations("Search");

  return (
    <KBarPortal>
      <KBarPositioner className="bg-background/80 z-50 flex items-start justify-center p-4 backdrop-blur-sm">
        <KBarAnimator className="bg-card border-border w-full max-w-lg overflow-hidden rounded-lg border shadow-lg">
          <KBarSearch
            defaultPlaceholder={t("placeholder")}
            className="text-foreground placeholder:text-muted-foreground w-full bg-transparent px-4 py-4 text-sm outline-none"
          />
          {/* The `::-webkit-scrollbar` rules in globals.css are global, so the result
              list picks them up; this is the Firefox half, which is per-element. */}
          <div className="border-border scrollbar-thin [scrollbar-color:var(--border)_transparent] border-t py-2">
            <Results />
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

export function CommandPalette({ openSignal }: { openSignal: number }) {
  const t = useTranslations("Search");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Only destinations that exist — a palette of dead ends is worse than a short one.
  const actions: Action[] = [
    {
      id: "home",
      name: tNav("home"),
      section: t("sectionGo"),
      keywords: "home feed",
      icon: <MessageSquareText className={icon} />,
      perform: () => router.push("/"),
    },
    {
      id: "developers",
      name: tNav("developers"),
      section: t("sectionGo"),
      keywords: "developers people profiles",
      icon: <CodeXml className={icon} />,
      perform: () => router.push("/developers"),
    },
    {
      id: "projects",
      name: tNav("projects"),
      section: t("sectionGo"),
      keywords: "projects apps repos",
      icon: <FolderGit2 className={icon} />,
      perform: () => router.push("/projects"),
    },
    {
      id: "events",
      name: tNav("events"),
      section: t("sectionGo"),
      keywords: "events meetups sessions",
      icon: <Calendar className={icon} />,
      perform: () => router.push("/events"),
    },
    ...routing.locales
      .filter((it) => it !== locale)
      .map((it) => ({
        id: `locale-${it}`,
        name: t("switchTo", { locale: it.toUpperCase() }),
        section: t("sectionSettings"),
        icon: <Languages className={icon} />,
        perform: () => router.replace(pathname, { locale: it }),
      })),
    // Mock posts. `keywords` carries the author so a handle matches too. Matching is
    // substring-based, which is provisional — it is NOT the Myanmar tokenisation
    // decision, which needs a real corpus (design.md, open question 3).
    ...mockPosts.map((post) => ({
      id: `post-${post.id}`,
      name: post.title,
      subtitle: post.author,
      keywords: `${post.author} ${post.title}`,
      section: t("sectionPosts"),
      icon: <FileText className={icon} />,
      perform: () => router.push("/"),
    })),
  ];

  return (
    <KBarProvider
      actions={actions}
      options={{ animations: { enterMs: 150, exitMs: 100 } }}
    >
      <OpenOnSignal openSignal={openSignal} />
      <Palette />
    </KBarProvider>
  );
}
