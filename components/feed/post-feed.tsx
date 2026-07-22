import { useTranslations } from "next-intl";

import { mockPosts } from "@/lib/feed";
import { PostList } from "./post-list";

// Renders the mock feed. Swapping `mockPosts` for real data is the only change the
// feed needs when a posts backend exists — the card is data-shaped, not hand-written.
export function PostFeed() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col">
      {/* Sort tabs are display-only for now — no ranking is wired. */}
      <div className="bg-muted mb-2 flex w-fit items-center gap-1 rounded-lg p-1 text-sm">
        <span className="bg-background text-foreground rounded-lg px-3 py-1.5">
          {t("sortBest")}
        </span>
        <span className="text-muted-foreground rounded-lg px-3 py-1.5">
          {t("sortNew")}
        </span>
      </div>

      <PostList posts={mockPosts} />
    </div>
  );
}
