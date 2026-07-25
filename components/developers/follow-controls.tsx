"use client";

import { Check, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Follower / following counts and a follow toggle. Frontend-only (PBI-less, owner-approved):
// following is a write that needs auth plus a rate limit, and a public follower graph is
// identity-sensitive (design.md) — so this holds local state only and persists nothing. The
// displayed follower count moves optimistically with the toggle so the affordance reads as
// live. `"use client"` is forced by useState/onClick; it stays a small leaf under the
// server-rendered ProfileHeader.
//
// No faux-bold anywhere: counts lean on colour (text-foreground) not weight, since any label
// can be Shan and the AJ fonts are Regular-only.
export function FollowControls({
  followers,
  following,
}: {
  followers: number;
  following: number;
}) {
  const t = useTranslations("Developers");
  const [isFollowing, setIsFollowing] = useState(false);
  const followerCount = followers + (isFollowing ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <button
        type="button"
        aria-pressed={isFollowing}
        onClick={() => setIsFollowing((v) => !v)}
        className={cn(
          buttonVariants({ variant: isFollowing ? "outline" : "default" }),
          "cursor-pointer gap-2 font-normal",
        )}
      >
        {isFollowing ? (
          <Check className="size-4" />
        ) : (
          <UserPlus className="size-4" />
        )}
        {isFollowing ? t("following") : t("follow")}
      </button>

      <dl className="text-muted-foreground flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <dd className="text-foreground tabular-nums">{followerCount}</dd>
          <dt>{t("followers")}</dt>
        </div>
        <div className="flex items-center gap-1.5">
          <dd className="text-foreground tabular-nums">{following}</dd>
          <dt>{t("following")}</dt>
        </div>
      </dl>
    </div>
  );
}
