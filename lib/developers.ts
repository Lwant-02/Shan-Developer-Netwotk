// Mock developer directory for PBI-017. Derived from the pseudonymous handles that
// already author the mock feed (`lib/feed.ts`) and comment threads (`lib/comments.ts`),
// so a member's profile shows their real mock posts and the feed and directory agree.
// This is the minimum a profile needs, NOT a database schema — real profiles replace
// `mockDevelopers` without touching the UI.
//
// Identity safety is load-bearing here (AGENTS.md; design.md "Safety and pseudonymity"):
// handles are pseudonymous, there is NO email field, and `location` is coarse
// (region/town, never precise) and OPTIONAL — some members have none.

// Platforms with a brand icon under public/icons, plus `website` (a generic globe).
export type SocialPlatform =
  | "github"
  | "facebook"
  | "instagram"
  | "line"
  | "linkedin"
  | "telegram"
  | "website";

export type DeveloperLink = {
  platform: SocialPlatform;
  href: string;
};

// Presentation for each platform: label (a proper noun, not UI chrome) and its brand
// icon. `invert` flips the monochrome GitHub mark to white for the dark UI (as the
// sign-in dialog does); the colour brand PNGs render as-is. `website` has no icon and
// falls back to a generic globe in the UI.
export const SOCIAL: Record<
  SocialPlatform,
  { label: string; icon?: string; invert?: boolean }
> = {
  github: { label: "GitHub", icon: "/icons/github.svg", invert: true },
  facebook: { label: "Facebook", icon: "/icons/facebook.png" },
  instagram: { label: "Instagram", icon: "/icons/instagram.png" },
  line: { label: "LINE", icon: "/icons/line-app.png" },
  linkedin: { label: "LinkedIn", icon: "/icons/linkedin.png" },
  telegram: { label: "Telegram", icon: "/icons/telegram.png" },
  website: { label: "Website" },
};

export type Developer = {
  /** Pseudonymous handle — the URL key and the primary identity. Never a real name. */
  handle: string;
  /** Optional chosen display name. Still pseudonymous; not the OAuth real name. */
  displayName?: string;
  /** Self-described role, e.g. "Learner" or "Senior Frontend Developer". Free text. */
  role: string;
  /** When they joined the community. Rendered as month + year only — a join *date* is
   *  precise enough to correlate accounts, and coarse is the house style for identity. */
  joinedAtISO: string;
  bio: string;
  /** Coarse and optional. Region or town, never precise; omitted for members who
   *  share none. */
  location?: string;
  links: DeveloperLink[];
  /** Display-only follower / following counts. Frontend-only: following is a write and
   *  needs auth plus a rate limit, and a public social graph is identity-sensitive
   *  (design.md) — the counts render, the mechanic is not wired. */
  followers: number;
  following: number;
};

// English mock bios/locations (fabricated, like PBI-010 post bodies) — never a Shan
// content claim. Every handle here authors at least one post or comment elsewhere.
export const mockDevelopers: Developer[] = [
  {
    handle: "tai_builds",
    role: "Keyboard & Input Developer",
    joinedAtISO: "2025-11-03T00:00:00Z",
    bio: "Working on Shan input methods and keyboard layouts. Council-tone correctness is the hill I die on.",
    location: "Taunggyi, Shan State",
    links: [
      { platform: "github", href: "https://github.com/tai_builds" },
      { platform: "facebook", href: "https://facebook.com/tai_builds" },
      { platform: "website", href: "https://tai.build" },
    ],
    followers: 142,
    following: 38,
  },
  {
    handle: "namkham_codes",
    role: "Backend Engineer",
    joinedAtISO: "2025-12-14T00:00:00Z",
    bio: "Backend and search. Currently deep in Shan text tokenization for Postgres.",
    location: "Lashio, Shan State",
    links: [
      { platform: "github", href: "https://github.com/namkham_codes" },
      { platform: "linkedin", href: "https://linkedin.com/in/namkham" },
      { platform: "website", href: "https://namkham.dev" },
    ],
    followers: 96,
    following: 51,
  },
  {
    handle: "mongla_dev",
    role: "Open-Source Developer",
    joinedAtISO: "2026-01-20T00:00:00Z",
    // No location — a member who shares none. Must render cleanly (CoS 5).
    bio: "Open-source odds and ends for Shan — dates, numbers, small libraries. MIT everything.",
    links: [
      { platform: "github", href: "https://github.com/mongla_dev" },
      { platform: "telegram", href: "https://t.me/mongla_dev" },
    ],
    followers: 74,
    following: 29,
  },
  {
    handle: "lasho_online",
    role: "Developer & Educator",
    joinedAtISO: "2026-02-08T00:00:00Z",
    bio: "Teaching beginners and running online sessions in Shan. Community over code.",
    location: "Chiang Mai, Thailand",
    links: [
      { platform: "github", href: "https://github.com/lasho_online" },
      { platform: "line", href: "https://line.me/ti/p/~lasho_online" },
      { platform: "telegram", href: "https://t.me/lasho_online" },
    ],
    followers: 210,
    following: 63,
  },
  {
    handle: "keng_tung_js",
    role: "Senior Frontend Developer",
    joinedAtISO: "2026-03-15T00:00:00Z",
    bio: "Frontend developer building a Shan learning app, and caring far too much about typography.",
    location: "Kengtung, Shan State",
    links: [
      { platform: "github", href: "https://github.com/keng_tung_js" },
      { platform: "linkedin", href: "https://linkedin.com/in/kengtung" },
      { platform: "website", href: "https://kengtung.dev" },
    ],
    followers: 128,
    following: 44,
  },
  {
    handle: "panglong_pixels",
    displayName: "Panglong Pixels",
    role: "Product Designer",
    joinedAtISO: "2026-04-02T00:00:00Z",
    bio: "Designer and type nerd. Making Shan render cleanly wherever it's broken.",
    location: "Yangon",
    links: [
      { platform: "instagram", href: "https://instagram.com/panglong.pixels" },
      { platform: "facebook", href: "https://facebook.com/panglong.pixels" },
      { platform: "website", href: "https://panglong.design" },
    ],
    followers: 156,
    following: 72,
  },
  {
    handle: "nam_oo",
    role: "Android Developer",
    joinedAtISO: "2026-05-19T00:00:00Z",
    bio: "Android developer. I test everything on a Redmi Note so it works on the phones people actually have.",
    location: "Muse, Shan State",
    links: [
      { platform: "github", href: "https://github.com/nam_oo" },
      { platform: "telegram", href: "https://t.me/nam_oo" },
    ],
    followers: 61,
    following: 40,
  },
  {
    handle: "sengfah",
    role: "QA Engineer",
    joinedAtISO: "2026-06-11T00:00:00Z",
    // No location.
    bio: "QA, and the person who asks 'did you test that logged out?'",
    links: [{ platform: "github", href: "https://github.com/sengfah" }],
    followers: 33,
    following: 22,
  },
];

export function listDevelopers(): Developer[] {
  return mockDevelopers;
}

// Resolve a handle for the profile route (PBI-017). Returns undefined for an unknown
// handle so the page can call notFound().
export function getDeveloperByHandle(handle: string): Developer | undefined {
  return mockDevelopers.find((developer) => developer.handle === handle);
}
