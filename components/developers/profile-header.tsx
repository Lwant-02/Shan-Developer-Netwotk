import { CalendarDays, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { formatDateEn } from "@/lib/datetime";
import { type Developer, SOCIAL } from "@/lib/developers";
import { cn } from "@/lib/utils";
import { FollowControls } from "./follow-controls";

// The profile header: avatar, name/handle, optional coarse location, bio, and external
// links. Identity safety is binding here — no email is ever rendered, location is coarse
// and optional (omitted when absent), and the avatar is initials only.
export function ProfileHeader({ developer }: { developer: Developer }) {
  const t = useTranslations("Developers");
  const name = developer.displayName ?? developer.handle;

  // Month + year only: an exact join date is a correlation handle, and coarse is the
  // house style for anything identifying.
  const joined = formatDateEn(developer.joinedAtISO, {
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="bg-muted text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-full text-lg uppercase"
        >
          {developer.handle.slice(0, 2)}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-foreground text-2xl leading-snug">{name}</h1>
          <span className="text-muted-foreground text-sm">{developer.role}</span>
          {developer.displayName && (
            <span className="text-muted-foreground text-xs">
              {developer.handle}
            </span>
          )}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {developer.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {developer.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              <time dateTime={developer.joinedAtISO}>
                {t("joined", { date: joined })}
              </time>
            </span>
          </div>
        </div>
      </div>

      <FollowControls
        followers={developer.followers}
        following={developer.following}
      />

      <p className="text-muted-foreground text-sm leading-relaxed">
        {developer.bio}
      </p>

      {developer.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {developer.links.map((link) => {
            const social = SOCIAL[link.platform];
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "cursor-pointer gap-2 font-normal",
                )}
              >
                {social.icon ? (
                  <Image
                    src={social.icon}
                    alt=""
                    width={16}
                    height={16}
                    unoptimized
                    className={cn("size-4", social.invert && "invert")}
                  />
                ) : (
                  <Globe className="size-4" />
                )}
                {social.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
