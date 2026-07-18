// Mock feed for PBI-010. The home page renders from this typed shape so real posts
// can replace it later without touching the UI. This is NOT the database schema —
// it's the minimum a post card needs. `lang` is the post's own content language,
// independent of the UI locale, so the feed can mix Shan and English.

export type PostLang = "shn" | "en";

export type Post = {
  id: string;
  /** Pseudonymous handle. Identity is sensitive here — never a real name by default. */
  author: string;
  createdAtISO: string;
  lang: PostLang;
  title: string;
  body: string;
  /** Optional post image. Real posts need storage (Neon bundles none) — a later PBI. */
  image?: string;
  /** Placeholder signal for the undecided vote mechanic — display only. */
  score: number;
  comments: number;
};

// English mock content, per the agreed Shan-copy approach: real Shan post samples are
// owner-supplied and not fabricated here. Every item is tagged `en`; the card renders
// the `lang` tag so a `shn` post would render correctly the moment one exists.
export const mockPosts: Post[] = [
  {
    id: "1",
    author: "tai_builds",
    createdAtISO: "2026-07-18T05:00:00Z",
    lang: "en",
    title: "Shipped my first Shan keyboard layout for GBoard",
    body: "Spent the weekend mapping the Council tones properly. Feedback from native typists welcome before I submit it.",
    image: "/icons/icon-512.png",
    score: 128,
    comments: 34,
  },
  {
    id: "2",
    author: "namkham_codes",
    createdAtISO: "2026-07-18T02:30:00Z",
    lang: "en",
    title: "How are you handling Shan word segmentation in search?",
    body: "Postgres full-text tokenizes on spaces, but Shan is written without them. Curious what people are using — ICU? n-grams?",
    score: 76,
    comments: 41,
  },
  {
    id: "3",
    author: "mongla_dev",
    createdAtISO: "2026-07-17T18:00:00Z",
    lang: "en",
    title: "Open-sourced a small Shan date/number formatting library",
    body: "Handles Shan digits and the traditional calendar. MIT licensed. Contributions and corrections very welcome.",
    image: "/icons/icon-512.png",
    score: 203,
    comments: 27,
  },
  {
    id: "4",
    author: "lasho_online",
    createdAtISO: "2026-07-17T09:15:00Z",
    lang: "en",
    title: "Hosting an online intro-to-React session this Saturday",
    body: "Beginner friendly, taught in Shan. Bring a laptop and a stable connection. Recording will be posted after.",
    score: 54,
    comments: 12,
  },
  {
    id: "5",
    author: "keng_tung_js",
    createdAtISO: "2026-07-16T21:45:00Z",
    lang: "en",
    title: "Looking for a designer to pair on a Shan learning app",
    body: "I have the API and data model done. Need someone who cares about typography — the fonts are Regular-only, so hierarchy is tricky.",
    score: 89,
    comments: 19,
  },
  {
    id: "6",
    author: "panglong_pixels",
    createdAtISO: "2026-07-16T14:20:00Z",
    lang: "en",
    title: "What editor font renders SHAN THA and the tones cleanly for you?",
    body: "Half my setups drop the tone marks or box them. Sharing what works — post yours with a screenshot.",
    score: 61,
    comments: 48,
  },
];
