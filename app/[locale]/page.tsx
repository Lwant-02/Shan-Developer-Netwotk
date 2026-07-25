import { setRequestLocale } from "next-intl/server";

import { PostFeed } from "@/components/feed/post-feed";
import { AppShell } from "@/components/shell/app-shell";
import { mockPosts } from "@/lib/feed";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AppShell>
      <PostFeed posts={mockPosts} />
    </AppShell>
  );
}
