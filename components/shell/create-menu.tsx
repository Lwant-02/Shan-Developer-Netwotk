"use client";

import { Calendar, FileText, FolderGit2, SquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";

// The top-nav Create control (PBI-022). Was display-only until this PBI; it now opens a
// menu routing to the three composers. Publishing is still gated — the compose page's
// Publish opens the sign-in dialog — so this asserts no logged-in identity, it only
// navigates. `"use client"` is the dropdown's.
export function CreateMenu() {
  const t = useTranslations("Create");
  const tNav = useTranslations("Nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-muted-foreground hover:bg-muted flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors">
        <SquarePlus className="size-5" />
        <span className="hidden sm:inline">{tNav("create")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-fit">
        <DropdownMenuItem render={<Link href="/create/post" />}>
          <FileText />
          {t("newPost")}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/create/project" />}>
          <FolderGit2 />
          {t("newProject")}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/create/event" />}>
          <Calendar />
          {t("newEvent")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
