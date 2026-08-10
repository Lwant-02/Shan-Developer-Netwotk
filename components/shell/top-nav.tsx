import { Bell } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { AuthedOnly, ResolvingOnly } from "@/components/auth/current-user";
import { SearchTrigger } from "@/components/search/search-trigger";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { CreateMenu } from "./create-menu";
import { LeftNav } from "./left-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { AccountMenuSlot, NavSignInButton } from "./nav-account";

export function TopNav() {
  const t = useTranslations("Nav");

  return (
    <header className="border-border bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex min-h-16 w-full flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 sm:py-0">
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
          <ResolvingOnly>
            <div className="flex items-center gap-2 px-3 py-2">
              <Skeleton className="size-5 rounded-lg" />
              <Skeleton className="hidden h-4 w-12 rounded-lg sm:block" />
            </div>
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex size-9 items-center justify-center">
              <Skeleton className="size-7 rounded-full" />
            </div>
          </ResolvingOnly>
          <AuthedOnly>
            <CreateMenu />
            <Link
              href="/notifications"
              aria-label={t("notifications")}
              className="text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors"
            >
              <Bell className="size-5" />
            </Link>
          </AuthedOnly>
          <AccountMenuSlot />
          <span className="hidden sm:contents">
            <LocaleSwitcher />
          </span>
          <NavSignInButton />
        </div>
      </div>
    </header>
  );
}
