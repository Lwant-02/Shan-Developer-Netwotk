import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProfileHeader } from "@/components/developers/profile-header";
import { ProfileTabs } from "@/components/developers/profile-tabs";
import { EventCard } from "@/components/events/event-card";
import { PostList } from "@/components/feed/post-list";
import { ProjectCard } from "@/components/projects/project-card";
import { AppShell } from "@/components/shell/app-shell";
import { Link } from "@/i18n/navigation";
import { getDeveloperByHandle, listDevelopers } from "@/lib/developers";
import { getEventsByHost } from "@/lib/events";
import { postsByAuthor } from "@/lib/feed";
import { getProjectsByAuthor } from "@/lib/projects";
import { localeAlternates } from "@/lib/site";

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
        <Link
          href="/developers"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("backToDirectory")}
        </Link>

        <ProfileHeader developer={developer} />

        <hr className="border-border" />

        <ProfileTabs
          tabs={[
            {
              key: "posts",
              label: t("posts"),
              count: posts.length,
              content:
                posts.length > 0 ? (
                  <PostList posts={posts} />
                ) : (
                  <p className="text-muted-foreground text-sm">{t("noPosts")}</p>
                ),
            },
            {
              key: "projects",
              label: t("projects"),
              count: projects.length,
              content:
                projects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
