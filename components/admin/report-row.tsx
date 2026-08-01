import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { HandleLink } from "@/components/feed/handle-link";
import { Link } from "@/i18n/navigation";
import { relativeTimeEn } from "@/lib/datetime";
import { type Report, reportHref } from "@/lib/reports";

// One row of the queue: what was reported, who reported it, why, and when. The `⋯`
// actions arrive as a slot so this stays presentational — the state that drives them
// lives in `ReportQueue`.
//
// Times use the `en` helper, never `useFormatter`: `Intl` has full `shn` data in Node but
// not the browser, so a Shan-locale date drifts on hydration (PBI-023).
//
// Both handles here are pseudonymous, and that is the whole identity surface of a report.
export function ReportRow({
  report,
  now,
  actions,
}: {
  report: Report;
  now: Date;
  actions?: ReactNode;
}) {
  const t = useTranslations("Admin");
  // Reasons come from the shared `Report` namespace — the same strings the reporter
  // picked from, so the moderator's view can't drift from the reporter's options.
  const tReport = useTranslations("Report");

  return (
    <li className="border-border flex items-start gap-3 border-b py-4 first:pt-0 last:border-0 last:pb-0">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="border-border text-muted-foreground rounded-lg border px-2 py-0.5 text-xs">
          {t(`type_${report.targetType}`)}
        </span>
        <span className="text-muted-foreground text-xs">
          {tReport(`reason_${report.reason}`)}
        </span>
        <span className="text-muted-foreground/70 text-xs">
          {relativeTimeEn(report.createdAtISO, now)}
        </span>
      </div>

      <Link
        href={reportHref(report)}
        className="text-foreground hover:text-muted-foreground text-sm leading-snug transition-colors"
      >
        {report.targetTitle}
      </Link>

      <p className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
        {t.rich("reportedBy", {
          reporter: () => <HandleLink handle={report.reporter} />,
          author: () => <HandleLink handle={report.targetAuthor} />,
        })}
      </p>
      </div>
      {actions}
    </li>
  );
}
