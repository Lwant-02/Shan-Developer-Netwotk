"use client";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Swaps the locale on the current path (/shn <-> /en), preserving where you are.
export function LocaleSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="border-border flex items-center rounded-lg border p-0.5 text-xs">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => router.replace(pathname, { locale })}
          aria-current={locale === active ? "true" : undefined}
          className={cn(
            "cursor-pointer rounded-lg px-2 py-1 uppercase",
            locale === active
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
