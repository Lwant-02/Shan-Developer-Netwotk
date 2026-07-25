"use client";

import { useState } from "react";

import { SortTabs } from "@/components/content/sort-tabs";
import type { Post } from "@/lib/feed";
import { sortItems, type SortKey } from "@/lib/sort";
import { PostList } from "./post-list";

// The home feed with its sort control. `"use client"` is forced by the sort state; the posts
// arrive from the server page as a prop (not imported here), so swapping the mock for real
// data stays a server-side change. Sorting a small list on the client keeps the page
// statically prerendered — the same tradeoff the events browser already makes.
export function PostFeed({ posts }: { posts: Post[] }) {
  const [sort, setSort] = useState<SortKey>("newest");
  const sorted = sortItems(posts, sort, {
    createdAtISO: (post) => post.createdAtISO,
    score: (post) => post.likes,
  });

  return (
    <div className="flex flex-col">
      <SortTabs value={sort} onChange={setSort} className="mb-3" />
      <PostList posts={sorted} />
    </div>
  );
}
