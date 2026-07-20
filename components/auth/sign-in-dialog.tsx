"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, type ReactElement } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Sign-in is the only gate in the product, so this is the highest-stakes screen in the
// UI: it has to say what becomes public *before* someone hands over an OAuth identity.
//
// `"use client"` is forced by one thing only — the consent checkbox gates the provider
// buttons. The trigger arrives as `children` so the nav and the right rail can share a
// single dialog; passing it as children rather than a named prop is deliberate, since a
// React element crossing the server/client boundary as a prop breaks the static
// prerender.
//
// The provider buttons are inert: PBI-014 is the surface only, and this is where Better
// Auth attaches in a later PBI.

const providerButton = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  // `font-normal` is not cosmetic: `buttonVariants` ships `font-medium`, and the AJ
  // fonts are Regular-only, so any weight above 400 synthesizes faux-bold and distorts
  // Myanmar tone marks. Every label here can render in Shan.
  "w-full cursor-pointer justify-center gap-3 rounded-lg font-normal",
);

// Next's image optimizer refuses SVG unless `dangerouslyAllowSVG` is set, which is not
// worth widening for two static brand marks.
const mark = { width: 18, height: 18, unoptimized: true } as const;

export function SignInDialog({ children }: { children: ReactElement }) {
  const [agreed, setAgreed] = useState(false);
  const t = useTranslations("Auth");

  return (
    <Dialog>
      <DialogTrigger render={children} />

      {/* `rounded-lg` and `font-normal` override the registry defaults (`rounded-xl`,
          `font-medium`) at the call site — one radius everywhere, and no faux-bold on
          a title that can carry Shan. `components/ui/*` stays unedited. */}
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-normal">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <button type="button" disabled={!agreed} className={providerButton}>
            <Image src="/icons/google.svg" alt="" {...mark} />
            {t("google")}
          </button>

          <div className="flex items-center gap-3">
            <span className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs">{t("or")}</span>
            <span className="bg-border h-px flex-1" />
          </div>

          {/* The supplied mark is #161514 on a #0a0a0a surface — invisible without
              inverting. White-on-dark is what GitHub's brand guidance specifies. The
              Google mark stays unaltered, as Google's guidelines require. */}
          <button type="button" disabled={!agreed} className={providerButton}>
            <Image src="/icons/github.svg" alt="" {...mark} className="invert" />
            {t("github")}
          </button>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="auth-consent"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked)}
            className="mt-0.5"
          />
          <label
            htmlFor="auth-consent"
            className="text-muted-foreground cursor-pointer text-xs leading-relaxed"
          >
            {t("consent")}
          </label>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed">
          {t("privacy")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
