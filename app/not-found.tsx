import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { fontVariables } from "./fonts";
import "./globals.css";

// Language-neutral, like the page: no locale resolved, so the title names none.
// `noindex` is explicit so a 404 is never indexable regardless of the layout.
export const metadata: Metadata = {
  title: { absolute: "404 · Shan Developer Network" },
  robots: { index: false, follow: false },
};

// Reached only when no locale resolved, so there is no honest basis for picking a
// language: this page names none and lets the visitor choose one.
export default function RootNotFound() {
  return (
    <div
      className={cn(
        fontVariables,
        "dot-grid font-sans text-foreground flex min-h-dvh flex-col antialiased",
      )}
    >
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-sm flex-col items-center gap-6 px-8 py-12 text-center">
          <Reveal className="flex flex-col items-center gap-3">
            <span className="text-6xl leading-none tracking-tight tabular-nums sm:text-7xl">
              404
            </span>
            <span className="bg-border h-px w-10" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground text-sm">
              Shan Developer Network
            </p>
          </Reveal>
          <Reveal
            delay={0.2}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {routing.locales.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                lang={locale}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                /{locale}
              </Link>
            ))}
          </Reveal>
        </div>
      </main>
    </div>
  );
}
