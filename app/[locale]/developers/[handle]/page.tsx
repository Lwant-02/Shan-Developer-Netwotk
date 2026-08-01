import type { Metadata } from "next";
import { ArrowLeft, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProfileHeader } from "@/components/developers/profile-header";
import { SectionTabs } from "@/components/content/section-tabs";
import { ProfileOwnerMenu } from "@/components/developers/profile-owner-menu";
import { ShareProfileDialog } from "@/components/developers/share-profile-dialog";
import { buttonVariants } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { PostList } from "@/components/feed/post-list";
import { ProjectCard } from "@/components/projects/project-card";
import { AppShell } from "@/components/shell/app-shell";
import { Link } from "@/i18n/navigation";
import { getDeveloperByHandle, listDevelopers } from "@/lib/developers";
import { getEventsByHost } from "@/lib/events";
import { postsByAuthor } from "@/lib/feed";
import { getProjectsByAuthor } from "@/lib/projects";
import { localeAlternates, siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

// Prerender every known member at build time (one per handle, per locale from the parent
// layout). An unknown handle falls through to notFound() → the localised 404.
export function generateStaticParams() {
  return listDevelopers().map((developer) => ({ handle: developer.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const developer = getDeveloperByHandle(handle);
  if (!developer) return {};

  const name = developer.displayName ?? developer.handle;
  return {
    title: name,
    description: developer.bio,
    alternates: localeAlternates(locale, `/developers/${handle}`),
    openGraph: {
      type: "profile",
      url: `/${locale}/developers/${handle}`,
      title: name,
      description: developer.bio,
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  setRequestLocale(locale);

  const developer = getDeveloperByHandle(handle);
  if (!developer) notFound();

  const posts = postsByAuthor(developer.handle);
  const projects = getProjectsByAuthor(developer.handle);
  const events = getEventsByHost(developer.handle);
  const t = await getTranslations("Developers");

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/developers"
            className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t("backToDirectory")}
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {/* The absolute URL is built here, server-side, so it matches the page's
              canonical rather than being reassembled on the client. */}
            <ShareProfileDialog
              developer={developer}
              profileUrl={`${siteUrl()}/${locale}/developers/${developer.handle}`}
              stats={{
                posts: posts.length,
                projects: projects.length,
                events: events.length,
              }}
            >
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "shrink-0 cursor-pointer gap-2 font-normal",
                )}
              >
                <Share2 className="size-4" />
                {t("share")}
              </button>
            </ShareProfileDialog>

            {/* Owner-only. `getViewer()` is null in production, so this ships nowhere on
              the live site; when auth lands the comparison becomes a real ownership
              check rather than a preview one. */}
            {getViewer()?.handle === developer.handle && <ProfileOwnerMenu />}
          </div>
        </div>

        <ProfileHeader developer={developer} />

        <hr className="border-border" />

        <SectionTabs
          tabs={[
            {
              key: "posts",
              label: t("posts"),
              count: posts.length,
              content:
                posts.length > 0 ? (
                  <PostList posts={posts} />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t("noPosts")}
                  </p>
                ),
            },
            {
              key: "projects",
              label: t("projects"),
              count: projects.length,
              content:
                projects.length > 0 ? (
                  // Single column, matching the /projects directory (PBI-020) and the
                  // events tab below — a project card is a feed-style card, not a tile.
                  <div className="flex flex-col gap-3">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t("noProjects")}
                  </p>
                ),
            },
            {
              key: "events",
              label: t("events"),
              count: events.length,
              content:
                events.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t("noEvents")}
                  </p>
                ),
            },
          ]}
        />
      </div>
    </AppShell>
  );
}
