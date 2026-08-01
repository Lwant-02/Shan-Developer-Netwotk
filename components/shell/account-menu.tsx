"use client";

import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { signOut } from "@/lib/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PROVIDER, type CurrentUser } from "@/lib/current-user";

function Avatar({
  user,
  className,
}: {
  user: CurrentUser;
  className?: string;
}) {
  return user.avatarUrl ? (
    <Image
      src={user.avatarUrl}
      alt={user.displayName ?? user.handle}
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
      {user.handle.slice(0, 2)}
    </span>
  );
}

export function AccountMenu({ user }: { user: CurrentUser }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations("Account");
  const tNav = useTranslations("Nav");

  const provider = PROVIDER[user.provider];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={tNav("account")}
        className="text-muted-foreground hover:bg-muted flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
      >
        <Avatar user={user} className="size-7" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-1.5 py-2">
          <Avatar user={user} className="size-9" />
          <div className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm">
              {user.displayName ?? user.handle}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              @{user.handle}
            </span>
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

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={<Link href={`/developers/${user.handle}`} />}
          className="py-1.5"
        >
          <User />
          {t("profile")}
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/settings" />} className="py-1.5">
          <Settings />
          {t("settings")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            startTransition(async () => {
              toast.success(t("signedOutToast"));
              await signOut(window.location.pathname);
            })
          }
          disabled={pending}
          className="cursor-pointer py-1.5"
        >
          <LogOut />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
