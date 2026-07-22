import { Fragment } from "react";

import type { Post } from "@/lib/feed";
import { PostCard } from "./post-card";

// A hairline-separated list of post cards. Extracted from PostFeed so the home feed and a
// developer's profile (PBI-017) render the same list from different post sets.
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col gap-1">
      {posts.map((post, index) => (
        <Fragment key={post.id}>
          {index > 0 && <hr className="border-border mx-2 my-1" />}
          <PostCard post={post} />
        </Fragment>
      ))}
    </div>
  );
}
