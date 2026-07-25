// Mock notifications for PBI-023. Like `lib/feed.ts`, this is the minimum the UI needs,
// not a database schema — a real per-user query replaces `mockNotifications` without
// touching the page or the row component. Notifications are inherently per-user, so this
// stands in for "the signed-in reader's" feed until Better Auth lands; the surface asserts
// no identity (identity-safety rule).
//
// The kinds are fixed by the interactions that already exist — a like/comment on your
// post, a star on your project, a new follower, an event reminder — not by what a generic
// platform would push (design.md, Notifications).

export type NotificationKind =
  | "comment"
  | "like"
  | "star"
  | "follow"
  | "event-reminder";

export type Notification = {
  id: string;
  kind: NotificationKind;
  /** Pseudonymous handle of whoever acted. Absent for `event-reminder`, which has no
   *  actor — it comes from the event itself. Never a real name (identity is sensitive). */
  actor?: string;
  /** Where the notification points: the post/project/event/profile it's about. Slugs and
   *  handles are the URL keys the read surfaces already use. */
  href: string;
  /** The title of the thing acted on (post/project/event). Absent for `follow`, which
   *  points at the follower's profile and has no target title. */
  targetTitle?: string;
  /** Display-only unread marker. "Mark as read" is a write and needs auth + a rate limit,
   *  so nothing here is mutable yet. */
  unread: boolean;
  createdAtISO: string;
};

// English mock content, per the agreed Shan-copy approach: real Shan samples are
// owner-supplied and not fabricated here. Handles, slugs, and titles reference real rows
// in `lib/feed.ts` / `lib/projects.ts` / `lib/events.ts` / `lib/developers.ts`, so every
// target link resolves.
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    kind: "comment",
    actor: "nam_oo",
    href: "/post/shan-keyboard-layout-gboard",
    targetTitle: "Shipped my first Shan keyboard layout for GBoard",
    unread: true,
    createdAtISO: "2026-07-25T02:15:00Z",
  },
  {
    id: "n2",
    kind: "like",
    actor: "namkham_codes",
    href: "/post/shan-keyboard-layout-gboard",
    targetTitle: "Shipped my first Shan keyboard layout for GBoard",
    unread: true,
    createdAtISO: "2026-07-24T19:40:00Z",
  },
  {
    id: "n3",
    kind: "star",
    actor: "keng_tung_js",
    href: "/projects/shan-gboard-layout",
    targetTitle: "Shan GBoard Layout",
    unread: true,
    createdAtISO: "2026-07-24T11:05:00Z",
  },
  {
    id: "n4",
    kind: "follow",
    actor: "panglong_pixels",
    href: "/developers/panglong_pixels",
    unread: false,
    createdAtISO: "2026-07-23T08:30:00Z",
  },
  {
    id: "n5",
    kind: "event-reminder",
    href: "/events/intro-to-react-in-shan",
    targetTitle: "Intro to React, taught in Shan",
    unread: false,
    createdAtISO: "2026-07-22T15:00:00Z",
  },
  {
    id: "n6",
    kind: "comment",
    actor: "mongla_dev",
    href: "/post/shan-word-segmentation-search",
    targetTitle: "How are you handling Shan word segmentation in search?",
    unread: false,
    createdAtISO: "2026-07-21T21:20:00Z",
  },
];

// Newest first — the order a reader expects. A real query orders by `createdAtISO desc`.
export function listNotifications(): Notification[] {
  return [...mockNotifications].sort(
    (a, b) => Date.parse(b.createdAtISO) - Date.parse(a.createdAtISO),
  );
}
