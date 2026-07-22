// Mock comment threads for PBI-016. Like `lib/feed.ts`, this is the minimum the UI
// needs, not the database schema — real comments replace `mockComments` without
// touching the components. `lang` is each comment's own content language (a thread can
// mix Shan and English), independent of the UI locale.

import type { PostLang } from "./feed";

export type Comment = {
  id: string;
  /** Ties the comment to `Post.slug`. */
  postSlug: string;
  /** Pseudonymous handle — identity is sensitive; never a real name by default. */
  author: string;
  createdAtISO: string;
  lang: PostLang;
  body: string;
  /** Set for a reply; refers to another comment's `id`. One level deep only — the mock
   *  does not nest replies under replies. */
  parentId?: string;
};

// English mock content, per the agreed Shan-copy approach: the per-comment `lang` tag
// and its rendering are built, but real Shan sample comments are owner-supplied and not
// fabricated here — so every item is tagged `en` until genuine Shan content exists. The
// count on each post in `lib/feed.ts` matches the number of comments here for that slug.
export const mockComments: Comment[] = [
  // shan-keyboard-layout-gboard (4)
  {
    id: "c1",
    postSlug: "shan-keyboard-layout-gboard",
    author: "nam_oo",
    createdAtISO: "2026-07-18T06:10:00Z",
    lang: "en",
    body: "This is huge. The stock GBoard Shan layout has bothered me for years — the tone key placement especially.",
  },
  {
    id: "c2",
    postSlug: "shan-keyboard-layout-gboard",
    author: "tai_builds",
    createdAtISO: "2026-07-18T06:40:00Z",
    lang: "en",
    body: "Agreed. I moved the tones onto a long-press row. Curious whether that trips up fast typists.",
    parentId: "c1",
  },
  {
    id: "c3",
    postSlug: "shan-keyboard-layout-gboard",
    author: "keng_tung_js",
    createdAtISO: "2026-07-18T07:05:00Z",
    lang: "en",
    body: "Long-press will slow me down a lot. Could you expose it as an option instead of the default?",
    parentId: "c2",
  },
  {
    id: "c4",
    postSlug: "shan-keyboard-layout-gboard",
    author: "sengfah",
    createdAtISO: "2026-07-18T08:20:00Z",
    lang: "en",
    body: "Tested on a Redmi Note — installs clean and the SHAN THA renders right. Nice work.",
  },

  // shan-word-segmentation-search (5)
  {
    id: "c5",
    postSlug: "shan-word-segmentation-search",
    author: "mongla_dev",
    createdAtISO: "2026-07-18T03:15:00Z",
    lang: "en",
    body: "We ended up using ICU with a custom dictionary. Pure n-grams blew up the index size.",
  },
  {
    id: "c6",
    postSlug: "shan-word-segmentation-search",
    author: "namkham_codes",
    createdAtISO: "2026-07-18T03:50:00Z",
    lang: "en",
    body: "How big did the dictionary get? Maintaining it is my worry.",
    parentId: "c5",
  },
  {
    id: "c7",
    postSlug: "shan-word-segmentation-search",
    author: "lasho_online",
    createdAtISO: "2026-07-18T04:30:00Z",
    lang: "en",
    body: "There's a small Shan wordlist from an old spellchecker project floating around — I can dig up the link.",
  },
  {
    id: "c8",
    postSlug: "shan-word-segmentation-search",
    author: "panglong_pixels",
    createdAtISO: "2026-07-18T05:45:00Z",
    lang: "en",
    body: "Trigram n-grams worked fine for us at small scale. Recall over precision early on.",
  },
  {
    id: "c9",
    postSlug: "shan-word-segmentation-search",
    author: "sengfah",
    createdAtISO: "2026-07-18T06:30:00Z",
    lang: "en",
    body: "Whatever you pick, please write it up — this question comes up constantly here.",
  },

  // shan-date-number-formatting-library (3)
  {
    id: "c10",
    postSlug: "shan-date-number-formatting-library",
    author: "keng_tung_js",
    createdAtISO: "2026-07-17T18:40:00Z",
    lang: "en",
    body: "Been needing exactly this. Does it handle the traditional Shan month names or just the digits?",
  },
  {
    id: "c11",
    postSlug: "shan-date-number-formatting-library",
    author: "mongla_dev",
    createdAtISO: "2026-07-17T19:15:00Z",
    lang: "en",
    body: "Digits and the Gregorian mapping for now. The traditional calendar is on the roadmap — PRs welcome.",
    parentId: "c10",
  },
  {
    id: "c12",
    postSlug: "shan-date-number-formatting-library",
    author: "nam_oo",
    createdAtISO: "2026-07-17T20:05:00Z",
    lang: "en",
    body: "Starred. The MIT licence makes it easy to pull into work projects — thank you.",
  },

  // intro-to-react-session (3)
  {
    id: "c13",
    postSlug: "intro-to-react-session",
    author: "sengfah",
    createdAtISO: "2026-07-17T10:00:00Z",
    lang: "en",
    body: "Signed up. Will the recording have captions? Connections here drop a lot.",
  },
  {
    id: "c14",
    postSlug: "intro-to-react-session",
    author: "lasho_online",
    createdAtISO: "2026-07-17T10:35:00Z",
    lang: "en",
    body: "I'll add captions afterwards. The live session will be slow-paced for exactly that reason.",
    parentId: "c13",
  },
  {
    id: "c15",
    postSlug: "intro-to-react-session",
    author: "tai_builds",
    createdAtISO: "2026-07-17T12:10:00Z",
    lang: "en",
    body: "Teaching React in Shan is exactly what beginners here need. Thank you for doing this.",
  },

  // designer-for-shan-learning-app (4)
  {
    id: "c16",
    postSlug: "designer-for-shan-learning-app",
    author: "panglong_pixels",
    createdAtISO: "2026-07-16T22:20:00Z",
    lang: "en",
    body: "Interested — typography with Regular-only fonts is a fun constraint. Sent you a message.",
  },
  {
    id: "c17",
    postSlug: "designer-for-shan-learning-app",
    author: "keng_tung_js",
    createdAtISO: "2026-07-16T22:55:00Z",
    lang: "en",
    body: "Great, replied. The hierarchy problem is exactly where I'm stuck.",
    parentId: "c16",
  },
  {
    id: "c18",
    postSlug: "designer-for-shan-learning-app",
    author: "nam_oo",
    createdAtISO: "2026-07-16T23:40:00Z",
    lang: "en",
    body: "Following this. A well-designed Shan learning app is overdue.",
  },
  {
    id: "c19",
    postSlug: "designer-for-shan-learning-app",
    author: "mongla_dev",
    createdAtISO: "2026-07-17T01:05:00Z",
    lang: "en",
    body: "For hierarchy without weight, lean on size and letter-spacing. Colour carries a lot too.",
  },

  // editor-font-shan-tha-tones (5)
  {
    id: "c20",
    postSlug: "editor-font-shan-tha-tones",
    author: "namkham_codes",
    createdAtISO: "2026-07-16T15:00:00Z",
    lang: "en",
    body: "Noto Sans Myanmar renders the tones cleanly in VS Code for me, but the metrics feel off.",
  },
  {
    id: "c21",
    postSlug: "editor-font-shan-tha-tones",
    author: "panglong_pixels",
    createdAtISO: "2026-07-16T15:35:00Z",
    lang: "en",
    body: "Same — the line height fights my Latin font. Still hunting for a good pairing.",
    parentId: "c20",
  },
  {
    id: "c22",
    postSlug: "editor-font-shan-tha-tones",
    author: "tai_builds",
    createdAtISO: "2026-07-16T16:20:00Z",
    lang: "en",
    body: "The AJ fonts this site uses render SHAN THA correctly. Wish more editors bundled them.",
  },
  {
    id: "c23",
    postSlug: "editor-font-shan-tha-tones",
    author: "sengfah",
    createdAtISO: "2026-07-16T17:10:00Z",
    lang: "en",
    body: "Screenshot of my setup incoming once I'm at my desk. Fira Code with a Noto Myanmar fallback.",
  },
  {
    id: "c24",
    postSlug: "editor-font-shan-tha-tones",
    author: "nam_oo",
    createdAtISO: "2026-07-16T18:30:00Z",
    lang: "en",
    body: "Boxed tone marks are almost always a missing-font fallback, not the editor itself.",
  },
];

// All comments for a post, in posted order, for the detail route (PBI-016).
export function getCommentsForPost(slug: string): Comment[] {
  return mockComments.filter((comment) => comment.postSlug === slug);
}
