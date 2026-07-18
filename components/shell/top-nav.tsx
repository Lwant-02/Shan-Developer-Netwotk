import { Bell, Search, SquarePlus, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          <Image
            src="/icons/icon-192.png"
            alt={siteConfig.name}
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="hidden text-sm sm:inline">{siteConfig.name}</span>
        </Link>

        {/* Search is a non-functional placeholder — wiring it is a separate PBI
            (Myanmar-script tokenisation is unsolved). Disabled to signal that. */}
        <div className="relative mx-auto hidden w-full max-w-lg flex-1 sm:block">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            disabled
            placeholder={t("search")}
            className="bg-muted text-muted-foreground h-10 border-transparent pl-9 disabled:opacity-100"
          />
        </div>

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
          <button
            type="button"
            className={cn(buttonVariants({ size: "default" }), "cursor-pointer")}
          >
            {t("signIn")}
          </button>
        </div>
      </div>
    </header>
  );
}
