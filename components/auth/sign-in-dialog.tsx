"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useState,
  useSyncExternalStore,
  useTransition,
  type ReactElement,
} from "react";

import { signIn } from "@/lib/auth/actions";
import type { AuthProvider } from "@/lib/current-user";
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
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// The trigger arrives as `children` so the nav and right rail share one dialog — as a
// named prop it would be a React element crossing the boundary, which breaks the
// static prerender. Sign-in goes through a Server Action, so no auth library reaches
// the browser; the redirect leaves the page, so there is no success state here.

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

const CONSENT_KEY = "sdn.terms-accepted";

// `children` is the trigger, and is omitted when a caller drives the dialog with
// `open`/`onOpenChange` instead — the account menu does, because a `DialogTrigger`
// inside the menu popup is unmounted the moment the menu closes.
export function SignInDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [ticked, setTicked] = useState(false);
  const [pending, startTransition] = useTransition();
  const t = useTranslations("Auth");

  // `profiles.terms_accepted_at` is the durable record, but it can't be read here —
  // nobody is identified until after they authenticate. So the browser remembers too.
  // `useSyncExternalStore` gives the server an explicit `false` rather than a mismatch.
  const remembered = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem(CONSENT_KEY) !== null,
    () => false,
  );

  const agreed = ticked || remembered;

  // Read at click time: the path must keep its locale prefix, which next-intl's
  // `usePathname` strips.
  const start = (provider: AuthProvider) =>
    startTransition(async () => {
      localStorage.setItem(CONSENT_KEY, new Date().toISOString());
      await signIn(provider, window.location.pathname + window.location.search);
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger render={children} /> : null}

      {/* `rounded-lg` and `font-normal` override the registry defaults (`rounded-xl`,
          `font-medium`) at the call site — one radius everywhere, and no faux-bold on
          a title that can carry Shan. `components/ui/*` stays unedited. */}
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-normal">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={!agreed || pending}
            onClick={() => start("google")}
            className={providerButton}
          >
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
          <button
            type="button"
            disabled={!agreed || pending}
            onClick={() => start("github")}
            className={providerButton}
          >
            <Image
              src="/icons/github.svg"
              alt=""
              {...mark}
              className="invert"
            />
            {t("github")}
          </button>
        </div>

        <div className="flex items-start gap-3">
          {/* Gone once remembered, rather than pre-ticked — a box nobody ticked
              reads as consent asserted on their behalf. */}
          {!remembered && (
            <Checkbox
              id="auth-consent"
              checked={ticked}
              onCheckedChange={(checked) => setTicked(checked)}
              aria-labelledby="auth-consent-label"
              className="mt-0.5"
            />
          )}
          {/* Not a <label htmlFor>: the sentence now carries links, and clicking a
              link inside a label would toggle the checkbox and nests interactive
              controls. `aria-labelledby` gives the checkbox its name instead. */}
          <p
            id="auth-consent-label"
            className="text-muted-foreground text-xs leading-relaxed"
          >
            {t.rich(remembered ? "consentRemembered" : "consent", {
              terms: (chunks) => (
                <Link
                  href="/terms"
                  className="text-foreground underline underline-offset-2"
                >
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="text-foreground underline underline-offset-2"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed">
          {t("privacy")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
