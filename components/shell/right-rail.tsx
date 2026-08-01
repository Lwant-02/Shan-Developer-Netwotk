import { useTranslations } from "next-intl";

import { AnonymousOnly } from "@/components/auth/current-user";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockPosts } from "@/lib/feed";
import { cn } from "@/lib/utils";

export function RightRail() {
  const tHome = useTranslations("Home");
  const tPost = useTranslations("Post");
  const recent = mockPosts.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <AnonymousOnly>
        <Card className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-base">{tHome("aboutTitle")}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {tHome("aboutBody")}
            </p>
          </div>
          <SignInDialog>
            <button
              type="button"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full cursor-pointer font-normal",
              )}
            >
              {tHome("signInToPost")}
            </button>
          </SignInDialog>
        </Card>
      </AnonymousOnly>

      <Card className="flex flex-col gap-1 p-5">
        <h2 className="text-muted-foreground mb-2 text-xs tracking-wide uppercase">
          {tHome("recentTitle")}
        </h2>
        <ul className="flex flex-col">
          {recent.map((post) => (
            <li
              key={post.id}
              className="border-border flex flex-col gap-1 border-b py-3 first:pt-0 last:border-0 last:pb-0"
            >
              <span
                lang={post.lang}
                className="text-foreground hover:text-muted-foreground line-clamp-2 cursor-pointer text-sm leading-snug transition-colors"
              >
                {post.title}
              </span>
              <span className="text-muted-foreground text-xs">
                {post.comments} {tPost("comments")}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
