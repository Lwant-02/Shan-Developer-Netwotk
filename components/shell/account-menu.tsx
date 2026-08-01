"use client";

import { LogIn, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PROVIDER, type Viewer } from "@/lib/viewer";

// The top-nav account control (PBI-024). Renders both states from `viewer`, which is
// `null` for an anonymous visitor — the only state production ships today, since there
// is no auth. The signed-in branch is a design preview driven by `lib/viewer.ts`; see
// `getViewer()` for how it is gated.
//
// Identity safety (AGENTS.md): with `viewer === null` this asserts nothing about a
// session beyond its absence — no name, photo, handle, or count. The two states are
// mutually exclusive on purpose; a signed-out header next to a live "Sign in" button is
// the contradiction that rule exists to prevent.
//
// The dialog is driven by state rather than a `DialogTrigger` inside the popup: the menu
// unmounts its items on close, which would take the trigger — and the dialog — with it.

function Avatar({ viewer, className }: { viewer: Viewer; className?: string }) {
  // No image storage yet (backlog Open Questions), so this is initials in practice —
  // the same fallback every other avatar in the app renders.
  return viewer.avatarUrl ? (
    <Image
      src={viewer.avatarUrl}
      alt={viewer.displayName ?? viewer.handle}
      width={36}
      height={36}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        "bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-full text-xs uppercase",
        className,
      )}
    >
      {viewer.handle.slice(0, 2)}
    </span>
  );
}

function Soon({ label }: { label: string }) {
  return (
    <span className="text-muted-foreground/80 ml-auto text-[10px]">{label}</span>
  );
}

export function AccountMenu({ viewer }: { viewer: Viewer | null }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const t = useTranslations("Account");
  const tNav = useTranslations("Nav");
  const soon = tNav("comingSoon");

  const provider = viewer ? PROVIDER[viewer.provider] : null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={tNav("account")}
          className="text-muted-foreground hover:bg-muted flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
        >
          {viewer ? (
            <Avatar viewer={viewer} className="size-7" />
          ) : (
            <span className="bg-muted flex size-7 items-center justify-center rounded-full">
              <User className="size-4" />
            </span>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {viewer && provider ? (
            <div className="flex items-center gap-3 px-1.5 py-2">
              <Avatar viewer={viewer} className="size-9" />
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground truncate text-sm">
                  {viewer.displayName ?? viewer.handle}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  @{viewer.handle}
                </span>
                {/* Which provider you came in through, so an account reachable by two
                    sign-in routes is unambiguous. The email behind it is never shown —
                    OAuth emails are not public (AGENTS.md). */}
                <span className="text-muted-foreground/80 mt-1 flex items-center gap-1.5 text-xs">
                  <Image
                    src={provider.icon}
                    alt=""
                    width={12}
                    height={12}
                    unoptimized
                    className={cn(provider.invert && "invert")}
                  />
                  {t("signedInVia", { provider: provider.label })}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1 px-1.5 py-2">
              <p className="text-foreground text-sm">{t("signedOut")}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t("signedOutHint")}
              </p>
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Signed out, the one live action is the way in. Signed in, the profile route
              already exists (PBI-017), so it is a real link. Settings links in both
              states — the page itself handles a visitor with no account. */}
          {viewer ? (
            <DropdownMenuItem
              render={<Link href={`/developers/${viewer.handle}`} />}
              className="py-1.5"
            >
              <User />
              {t("profile")}
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => setSignInOpen(true)}
                className="cursor-pointer py-1.5"
              >
                <LogIn />
                {tNav("signIn")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="py-1.5">
                <User />
                {t("profile")}
                <Soon label={soon} />
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem render={<Link href="/settings" />} className="py-1.5">
            <Settings />
            {t("settings")}
          </DropdownMenuItem>

          {viewer && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="py-1.5">
                <LogOut />
                {t("signOut")}
                <Soon label={soon} />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {!viewer && <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />}
    </>
  );
}
