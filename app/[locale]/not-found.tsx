import type { Metadata } from "next";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
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
        <div className="border-border bg-card flex w-full max-w-sm flex-col items-center gap-6 rounded-lg border px-8 py-12 text-center shadow-sm">
          <Reveal className="flex flex-col items-center gap-3">
            <span className="text-6xl leading-none tracking-tight tabular-nums sm:text-7xl">
              404
            </span>
            <span className="bg-border h-px w-10" />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-2">
            <h1 className="text-xl">{t("title")}</h1>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </Reveal>
          <Reveal delay={0.2}>
            {/* Base UI's Button has no `asChild`, so a link reuses the variants directly. */}
            <Link
              href={`/${locale}`}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {t("home")}
            </Link>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
