"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./locale-switcher";

// The left nav is a server component passed in as children, so this client leaf only
// owns the open/close of the drawer — the nav content stays on the server.
export function MobileNav({ children }: { children: ReactNode }) {
  const t = useTranslations("Nav");

  return (
    <Sheet>
      <SheetTrigger
        aria-label={t("openMenu")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "cursor-pointer lg:hidden",
        )}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetHeader className="border-border border-b">
          <SheetTitle className="text-left text-base">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>
        <div className="p-2">{children}</div>

        <div className="border-border mt-auto border-t p-4 sm:hidden">
          <LocaleSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
