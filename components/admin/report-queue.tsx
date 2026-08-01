"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { SectionTabs } from "@/components/content/section-tabs";
import type { Report, ReportTargetType } from "@/lib/reports";
import { ReportActions } from "./report-actions";
import { ReportRow } from "./report-row";

// The queue, filtered by type, with per-row moderation actions.
//
// `"use client"` is forced by the resolved-set state: acting on a report removes it from
// the queue here and nowhere else. **Nothing is persisted** — the real actions are writes
// needing Better Auth and a rate limit, plus an agreed moderation policy (PBI-005,
// Deferred). This is the same frontend-only shape as PBI-023's "mark all as read", and
// the banner and the confirm dialog both say so, so the queue is never mistaken for a
// working takedown tool.
//
// Reports arrive as a prop rather than being imported here, so replacing the mock with a
// real query stays a server-side change. `now` is threaded from the page so every
// relative time on one render shares a reference point.

const TYPES: ReportTargetType[] = ["post", "project", "event"];

export function ReportQueue({
  reports,
  now,
}: {
  reports: Report[];
  now: Date;
}) {
  const t = useTranslations("Admin");
  const [resolved, setResolved] = useState<Record<string, true>>({});

  const open = reports.filter((report) => !resolved[report.id]);
  const resolvedCount = reports.length - open.length;

  const forType = (type?: ReportTargetType) =>
    type ? open.filter((report) => report.targetType === type) : open;

  const panel = (type?: ReportTargetType) => {
    const rows = forType(type);

    if (rows.length === 0) {
      return <p className="text-muted-foreground py-6 text-sm">{t("empty")}</p>;
    }

    return (
      <ul className="flex flex-col">
        {rows.map((report) => (
          <ReportRow
            key={report.id}
            report={report}
            now={now}
            actions={
              <ReportActions
                report={report}
                onResolve={() =>
                  setResolved((current) => ({ ...current, [report.id]: true }))
                }
              />
            }
          />
        ))}
      </ul>
    );
  };

  const tabs = [
    {
      key: "all",
      label: t("filterAll"),
      count: forType().length,
      content: panel(),
    },
    ...TYPES.map((type) => ({
      key: type,
      label: t(`filter_${type}`),
      count: forType(type).length,
      content: panel(type),
    })),
  ];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-foreground text-lg">{t("reportsTitle")}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("reportsSubtitle")}
        </p>
      </div>

      {resolvedCount > 0 && (
        <p className="border-border text-muted-foreground rounded-lg border border-dashed p-3 text-xs leading-relaxed">
          {t("resolvedNote", { count: resolvedCount })}
        </p>
      )}

      <SectionTabs tabs={tabs} />
    </section>
  );
}
