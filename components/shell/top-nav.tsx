import { Bell } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { SearchTrigger } from "@/components/search/search-trigger";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";
import { AccountMenu } from "./account-menu";
import { CreateMenu } from "./create-menu";
import { LeftNav } from "./left-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export function TopNav() {
  const t = useTranslations("Nav");
  const viewer = getViewer();

  return (
    <header className="border-border bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex h-16 w-full items-center gap-3 px-4 sm:px-6">
        <MobileNav>
          <LeftNav />
        </MobileNav>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          {/* `unoptimized` because the logo is now an SVG: Next's image optimizer
              refuses SVG unless `dangerouslyAllowSVG` is set, which is not worth
              widening for one static mark. */}
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={32}
            height={32}
            unoptimized
          />
          <span className="hidden text-lg font-bold sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        {/* Renders both entry points — the field above `sm`, the icon below — and
            loads the palette only when one is used. */}
        <SearchTrigger />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Create routes to the composers (PBI-022), the bell to the notifications
              page (PBI-023), and Account opens a menu (PBI-024). All three are
              frontend-only. `getViewer()` is `null` in production, so what ships asserts
              no logged-in identity. */}
          <CreateMenu />
          <Link
            href="/notifications"
            aria-label={t("notifications")}
            className="text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors"
          >
            <Bell className="size-5" />
          </Link>
          <AccountMenu viewer={viewer} />
          <LocaleSwitcher />
          {/* Hidden from `xl`, where the right rail's "Sign in to post" card takes
              over — two sign-in buttons on one screen is one too many. Gone entirely
              once there is a viewer: "Sign in" beside a signed-in avatar is the
              contradiction the identity rule exists to prevent. */}
          {!viewer && (
            <SignInDialog>
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "cursor-pointer font-normal xl:hidden",
                )}
              >
                {t("signIn")}
              </button>
            </SignInDialog>
          )}
        </div>
      </div>
    </header>
  );
}
