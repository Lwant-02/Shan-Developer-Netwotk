// Mock report queue for PBI-025. The `⋯` menu on posts, projects, and events has offered
// **Report** since PBI-010/020/021 with nothing on the other end; this is the shape of
// what receives them.
//
// Frontend-only: filing a report is a write, so a real queue needs Better Auth (to know
// who reported) and a rate limit — an unlimited report button is itself a harassment
// vector. `mockReports` is replaced by a query without the admin page changing.
//
// Identity safety (AGENTS.md; design.md "Safety and pseudonymity"): a report names two
// pseudonymous handles — reporter and the reported content's author — and nothing else.
// There is NO email field here, and none is coming.

/** The three surfaces whose `⋯` menu offers Report. Comments are deliberately not
 *  reportable here (owner's call at PBI-025 time). */
export type ReportTargetType = "post" | "project" | "event";

/** A fixed set. These are categories a reporter picks, not free text — free text in a
 *  moderation queue is itself a place for abuse to be written.
 *
 *  Two of these are here for reasons specific to this product rather than copied from a
 *  generic platform list:
 *  - `privateInfo` — pseudonymity is a **safety requirement** in this region
 *    (`design.md`, "Safety and pseudonymity"), so posting another member's real name,
 *    employer, or precise location is the platform's most serious native harm.
 *  - `malware` — this is a developer community whose projects carry outbound repo, site,
 *    and app-store links. A hostile link is a category of its own, not "spam".
 *
 *  `hate` is kept distinct from `harassment` deliberately: one targets a group, the other
 *  an individual, and in this region those are not the same report. */
export type ReportReason =
  | "spam"
  | "harassment"
  | "hate"
  | "violence"
  | "privateInfo"
  | "impersonation"
  | "malware"
  | "sexual"
  | "offTopic"
  | "other";

export type Report = {
  id: string;
  targetType: ReportTargetType;
  /** Slug of the reported content, unique across all three surfaces. */
  targetSlug: string;
  targetTitle: string;
  /** The reported content's author — pseudonymous handle. */
  targetAuthor: string;
  /** Who filed it — pseudonymous handle. */
  reporter: string;
  reason: ReportReason;
  createdAtISO: string;
};

// Where a report's target lives. Kept next to the type so a new reportable surface has
// exactly one place to register its route.
const ROUTE: Record<ReportTargetType, string> = {
  post: "/post",
  project: "/projects",
  event: "/events",
};

export function reportHref(report: Report): string {
  return `${ROUTE[report.targetType]}/${report.targetSlug}`;
}

// English mock reasons and handles, matching the mock content they point at. Every
// `targetSlug` below exists in `lib/feed.ts`, `lib/projects.ts`, or `lib/events.ts`, so
// every row links somewhere real.
export const mockReports: Report[] = [
  {
    id: "r1",
    targetType: "post",
    targetSlug: "shan-word-segmentation-search",
    targetTitle: "How do you search Shan text without word boundaries?",
    targetAuthor: "namkham_codes",
    reporter: "mongla_dev",
    reason: "privateInfo",
    createdAtISO: "2026-07-30T09:12:00Z",
  },
  {
    id: "r2",
    targetType: "project",
    targetSlug: "shan-dates",
    targetTitle: "shan-dates",
    targetAuthor: "tai_builds",
    reporter: "namkham_codes",
    reason: "spam",
    createdAtISO: "2026-07-29T17:40:00Z",
  },
  {
    id: "r3",
    targetType: "event",
    targetSlug: "beginner-git-workshop",
    targetTitle: "Beginner Git workshop",
    targetAuthor: "mongla_dev",
    reporter: "tai_builds",
    reason: "impersonation",
    createdAtISO: "2026-07-28T11:05:00Z",
  },
  {
    id: "r4",
    targetType: "post",
    targetSlug: "shan-keyboard-layout-gboard",
    targetTitle: "Shipped my first Shan keyboard layout for Gboard",
    targetAuthor: "tai_builds",
    reporter: "namkham_codes",
    reason: "harassment",
    createdAtISO: "2026-07-27T20:18:00Z",
  },
  {
    id: "r5",
    targetType: "project",
    targetSlug: "shan-wordlist",
    targetTitle: "shan-wordlist",
    targetAuthor: "namkham_codes",
    reporter: "mongla_dev",
    reason: "malware",
    createdAtISO: "2026-07-26T08:33:00Z",
  },
];

/** Newest first — a queue is worked from the top. Optionally narrowed to one type. */
export function listReports(type?: ReportTargetType): Report[] {
  const reports = type
    ? mockReports.filter((report) => report.targetType === type)
    : mockReports;

  return [...reports].sort(
    (a, b) =>
      new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime(),
  );
}
