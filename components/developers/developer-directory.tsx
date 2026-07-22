import { useTranslations } from "next-intl";

import type { Developer } from "@/lib/developers";
import { DeveloperCard } from "./developer-card";

// The directory: a heading and a hairline-separated list of members. A Server Component
// using `useTranslations` — no client trigger, so it renders under Vitest (unlike the
// async page). The heading reuses the already-translated `Nav.developers` label.
export function DeveloperDirectory({
  developers,
}: {
  developers: Developer[];
}) {
  const tNav = useTranslations("Nav");
  const t = useTranslations("Developers");

  return (
    <div className="flex flex-col gap-6 py-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-foreground text-2xl">{tNav("developers")}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {developers.map((developer) => (
          <DeveloperCard key={developer.handle} developer={developer} />
        ))}
      </div>
    </div>
  );
}
