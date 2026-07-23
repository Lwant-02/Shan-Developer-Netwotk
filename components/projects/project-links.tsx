import { Globe } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

// Outbound link buttons on a project's detail page (PBI-020): source repo, live site, and
// the two app stores — each rendered only when that link exists. Same outline-button shape
// as the profile's social links (profile-header.tsx). Brand marks are owner-supplied assets
// in public/icons (github.svg inverted for the dark UI; app-store/playstore PNGs); the live
// site falls back to a lucide globe.
export function ProjectLinks({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const t = useTranslations("Projects");

  const links: { href?: string; label: string; icon: React.ReactNode }[] = [
    {
      href: project.repo,
      label: t("linkSource"),
      icon: (
        <Image
          src="/icons/github.svg"
          alt=""
          width={16}
          height={16}
          unoptimized
          className="size-4 invert"
        />
      ),
    },
    {
      href: project.website,
      label: t("linkLive"),
      icon: <Globe className="size-4" />,
    },
    {
      href: project.appStore,
      label: t("linkAppStore"),
      icon: (
        <Image
          src="/icons/app-store.png"
          alt=""
          width={16}
          height={16}
          unoptimized
          className="size-4"
        />
      ),
    },
    {
      href: project.playStore,
      label: t("linkPlayStore"),
      icon: (
        <Image
          src="/icons/playstore.png"
          alt=""
          width={16}
          height={16}
          unoptimized
          className="size-4"
        />
      ),
    },
  ];

  const present = links.filter((link) => link.href);
  if (present.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {present.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "cursor-pointer gap-2 font-normal",
          )}
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
  );
}
