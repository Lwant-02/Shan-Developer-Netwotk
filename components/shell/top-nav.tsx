import { Bell, SquarePlus, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { SearchTrigger } from "@/components/search/search-trigger";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LeftNav } from "./left-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export function TopNav() {
  const t = useTranslations("Nav");

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
          {/* Both need auth to do anything, so they are disabled rather than
              routed — a signed-out visitor gets "Sign in" as the one live action. */}
          <button
            type="button"
            disabled
            className="text-muted-foreground hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors disabled:pointer-events-none disabled:opacity-60"
          >
            <SquarePlus className="size-5" />
            <span className="hidden sm:inline">{t("create")}</span>
          </button>
          <button
            type="button"
            disabled
            aria-label={t("notifications")}
            className="text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-60"
          >
            <Bell className="size-5" />
          </button>
          <button
            type="button"
            disabled
            aria-label={t("account")}
            className="text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-60"
          >
            <span className="bg-muted flex size-7 items-center justify-center rounded-full">
              <User className="size-4" />
            </span>
          </button>
          <LocaleSwitcher />
          {/* Hidden from `xl`, where the right rail's "Sign in to post" card takes
              over — two sign-in buttons on one screen is one too many. */}
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
        </div>
      </div>
    </header>
  );
}
