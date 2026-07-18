import { setRequestLocale } from "next-intl/server";

import { PostFeed } from "@/components/feed/post-feed";
import { LeftNav } from "@/components/shell/left-nav";
import { NavCollapse } from "@/components/shell/nav-collapse";
import { RightRail } from "@/components/shell/right-rail";
import { TopNav } from "@/components/shell/top-nav";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TopNav />
      {/* Full-bleed shell: the sidebar is flush to the viewport edge and divided by a
          rule, rather than a centred container with gutters on both sides. */}
      <div className="flex flex-1">
        <aside className="border-border sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 border-r py-6 lg:block">
          <NavCollapse>
            <LeftNav />
          </NavCollapse>
        </aside>

        <div className="flex min-w-0 flex-1 justify-center gap-8 px-4 py-6 sm:px-6 xl:px-8">
          <main className="w-full max-w-3xl min-w-0">
            <PostFeed />
          </main>

          <aside className="hidden w-84 shrink-0 xl:block">
            <div className="sticky top-22">
              <RightRail />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
