import { Globe, MapPin } from "lucide-react";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { type Developer, SOCIAL } from "@/lib/developers";
import { cn } from "@/lib/utils";

// The profile header: avatar, name/handle, optional coarse location, bio, and external
// links. Identity safety is binding here — no email is ever rendered, location is coarse
// and optional (omitted when absent), and the avatar is initials only.
export function ProfileHeader({ developer }: { developer: Developer }) {
  const name = developer.displayName ?? developer.handle;

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
          {developer.location && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="size-3.5" />
              {developer.location}
            </span>
          )}
        </div>
      </div>

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
