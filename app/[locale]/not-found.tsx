import type { Metadata } from "next";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fontVariables } from "../fonts";

// Static, not localised: this file has no params, and localising it would mean
// getTranslations() reading headers — which flips the invalid-locale 404 path from
// static to dynamic and 500s. The page is noindex anyway, so the title is the tab
// label, not an SEO surface; the localised message stays in the visible <h1>.
// `absolute` escapes the layout's title template; `noindex` overrides its
// index:true so a 404 is never indexable.
export const metadata: Metadata = {
  title: { absolute: "404 · Shan Developer Network" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("NotFound");

  return (
    <div
      lang={locale}
      className={cn(
        fontVariables,
        "font-sans bg-background text-foreground flex min-h-dvh flex-col antialiased"
      )}
    >
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
          <p className="border-border text-muted-foreground rounded-lg border px-4 py-2 text-4xl">
            404
          </p>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl">{t("title")}</h1>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
          {/* Base UI's Button has no `asChild`, so a link reuses the variants directly. */}
          <Link
            href={`/${locale}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {t("home")}
          </Link>
        </div>
      </main>
    </div>
  );
}
