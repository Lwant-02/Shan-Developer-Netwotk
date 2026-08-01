"use client";

import { useTranslations } from "next-intl";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { useCurrentUser } from "@/components/auth/current-user";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./account-menu";

export function AccountMenuSlot() {
  const user = useCurrentUser();
  if (!user) return null;

  return <AccountMenu user={user} />;
}

export function NavSignInButton() {
  const t = useTranslations("Nav");
  const user = useCurrentUser();

  if (user) return null;

  return (
    <SignInDialog>
      <button
        type="button"
        className={cn(
          buttonVariants({ size: "default" }),
          "cursor-pointer font-normal xl:hidden",
        )}
      >
        {t("signIn")}
      </button>
    </SignInDialog>
  );
}
