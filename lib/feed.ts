// Mock feed for PBI-010. The home page renders from this typed shape so real posts
// can replace it later without touching the UI. This is NOT the database schema —
// it's the minimum a post card needs. `lang` is the post's own content language,
// independent of the UI locale, so the feed can mix Shan and English.

export type PostLang = "shn" | "en";

export type Post = {
  id: string;
  /** URL key for the detail page (PBI-016). Unique across the feed; a plain field,
   *  not a DB concern. Real posts will carry their own slug. */
  slug: string;
  /** Pseudonymous handle. Identity is sensitive here — never a real name by default. */
  author: string;
  createdAtISO: string;
  lang: PostLang;
  title: string;
  body: string;
  /** Optional post image. Real posts need storage (Neon bundles none) — a later PBI. */
  image?: string;
  /** Like count. The interaction model is a single like, not up/down voting
   *  (design.md, decided in PBI-016) — display only until auth. */
  likes: number;
  /** Consistent with the mock thread in `lib/comments.ts` (PBI-016), so clicking a
   *  card's count shows exactly that many comments. */
  comments: number;
};

// English mock content, per the agreed Shan-copy approach: real Shan post samples are
// owner-supplied and not fabricated here. Every item is tagged `en`; the card renders
// the `lang` tag so a `shn` post would render correctly the moment one exists.
export const mockPosts: Post[] = [
  {
    id: "1",
    slug: "shan-keyboard-layout-gboard",
    author: "tai_builds",
    createdAtISO: "2026-07-18T05:00:00Z",
    lang: "en",
    title: "Shipped my first Shan keyboard layout for GBoard",
    body: "Spent the weekend mapping the Council tones properly. Feedback from native typists welcome before I submit it.",
    image: "/icons/icon-512.png",
    likes: 128,
    comments: 4,
  },
  {
    id: "2",
    slug: "shan-word-segmentation-search",
    author: "namkham_codes",
    createdAtISO: "2026-07-18T02:30:00Z",
    lang: "en",
    title: "How are you handling Shan word segmentation in search?",
    body: "Postgres full-text tokenizes on spaces, but Shan is written without them. Curious what people are using — ICU? n-grams?",
    likes: 76,
    comments: 5,
  },
  {
    id: "3",
    slug: "shan-date-number-formatting-library",
    author: "mongla_dev",
    createdAtISO: "2026-07-17T18:00:00Z",
    lang: "en",
    title: "Open-sourced a small Shan date/number formatting library",
    body: "Handles Shan digits and the traditional calendar. MIT licensed. Contributions and corrections very welcome.",
    image: "/icons/icon-512.png",
    likes: 203,
    comments: 3,
  },
  {
    id: "4",
    slug: "intro-to-react-session",
    author: "lasho_online",
    createdAtISO: "2026-07-17T09:15:00Z",
    lang: "en",
    title: "Hosting an online intro-to-React session this Saturday",
    body: "Beginner friendly, taught in Shan. Bring a laptop and a stable connection. Recording will be posted after.",
    likes: 54,
    comments: 3,
  },
  {
    id: "5",
    slug: "designer-for-shan-learning-app",
    author: "keng_tung_js",
    createdAtISO: "2026-07-16T21:45:00Z",
    lang: "en",
    title: "Looking for a designer to pair on a Shan learning app",
    body: "I have the API and data model done. Need someone who cares about typography — the fonts are Regular-only, so hierarchy is tricky.",
    likes: 89,
    comments: 4,
  },
  {
    id: "6",
    slug: "editor-font-shan-tha-tones",
    author: "panglong_pixels",
    createdAtISO: "2026-07-16T14:20:00Z",
    lang: "en",
    title: "What editor font renders SHAN THA and the tones cleanly for you?",
    body: "Half my setups drop the tone marks or box them. Sharing what works — post yours with a screenshot.",
    likes: 61,
    comments: 5,
  },
];

// Resolve a post by its slug for the detail route (PBI-016). Returns undefined for an
// unknown slug so the page can call notFound().
export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find((post) => post.slug === slug);
}
