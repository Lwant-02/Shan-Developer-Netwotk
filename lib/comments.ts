// Mock comment threads for PBI-016. Like `lib/feed.ts`, this is the minimum the UI
// needs, not the database schema — real comments replace `mockComments` without
// touching the components. `lang` is each comment's own content language (a thread can
// mix Shan and English), independent of the UI locale.

import type { PostLang } from "./feed";

export type Comment = {
  id: string;
  /** Ties the comment to the slug of the thing being discussed — a post, project,
   *  or event. Slugs are unique across all three surfaces. */
  targetSlug: string;
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
// stored comment count on each post (`lib/feed.ts`), project (`lib/projects.ts`), and event
// (`lib/events.ts`) matches the number of comments here for that slug.
export const mockComments: Comment[] = [
  // shan-keyboard-layout-gboard (4)
  {
    id: "c1",
    targetSlug: "shan-keyboard-layout-gboard",
    author: "nam_oo",
    createdAtISO: "2026-07-18T06:10:00Z",
    lang: "en",
    body: "This is huge. The stock GBoard Shan layout has bothered me for years — the tone key placement especially.",
  },
  {
    id: "c2",
    targetSlug: "shan-keyboard-layout-gboard",
    author: "tai_builds",
    createdAtISO: "2026-07-18T06:40:00Z",
    lang: "en",
    body: "Agreed. I moved the tones onto a long-press row. Curious whether that trips up fast typists.",
    parentId: "c1",
  },
  {
    id: "c3",
    targetSlug: "shan-keyboard-layout-gboard",
    author: "keng_tung_js",
    createdAtISO: "2026-07-18T07:05:00Z",
    lang: "en",
    body: "Long-press will slow me down a lot. Could you expose it as an option instead of the default?",
    parentId: "c2",
  },
  {
    id: "c4",
    targetSlug: "shan-keyboard-layout-gboard",
    author: "sengfah",
    createdAtISO: "2026-07-18T08:20:00Z",
    lang: "en",
    body: "Tested on a Redmi Note — installs clean and the SHAN THA renders right. Nice work.",
  },

  // shan-word-segmentation-search (5)
  {
    id: "c5",
    targetSlug: "shan-word-segmentation-search",
    author: "mongla_dev",
    createdAtISO: "2026-07-18T03:15:00Z",
    lang: "en",
    body: "We ended up using ICU with a custom dictionary. Pure n-grams blew up the index size.",
  },
  {
    id: "c6",
    targetSlug: "shan-word-segmentation-search",
    author: "namkham_codes",
    createdAtISO: "2026-07-18T03:50:00Z",
    lang: "en",
    body: "How big did the dictionary get? Maintaining it is my worry.",
    parentId: "c5",
  },
  {
    id: "c7",
    targetSlug: "shan-word-segmentation-search",
    author: "lasho_online",
    createdAtISO: "2026-07-18T04:30:00Z",
    lang: "en",
    body: "There's a small Shan wordlist from an old spellchecker project floating around — I can dig up the link.",
  },
  {
    id: "c8",
    targetSlug: "shan-word-segmentation-search",
    author: "panglong_pixels",
    createdAtISO: "2026-07-18T05:45:00Z",
    lang: "en",
    body: "Trigram n-grams worked fine for us at small scale. Recall over precision early on.",
  },
  {
    id: "c9",
    targetSlug: "shan-word-segmentation-search",
    author: "sengfah",
    createdAtISO: "2026-07-18T06:30:00Z",
    lang: "en",
    body: "Whatever you pick, please write it up — this question comes up constantly here.",
  },

  // shan-date-number-formatting-library (3)
  {
    id: "c10",
    targetSlug: "shan-date-number-formatting-library",
    author: "keng_tung_js",
    createdAtISO: "2026-07-17T18:40:00Z",
    lang: "en",
    body: "Been needing exactly this. Does it handle the traditional Shan month names or just the digits?",
  },
  {
    id: "c11",
    targetSlug: "shan-date-number-formatting-library",
    author: "mongla_dev",
    createdAtISO: "2026-07-17T19:15:00Z",
    lang: "en",
    body: "Digits and the Gregorian mapping for now. The traditional calendar is on the roadmap — PRs welcome.",
    parentId: "c10",
  },
  {
    id: "c12",
    targetSlug: "shan-date-number-formatting-library",
    author: "nam_oo",
    createdAtISO: "2026-07-17T20:05:00Z",
    lang: "en",
    body: "Starred. The MIT licence makes it easy to pull into work projects — thank you.",
  },

  // intro-to-react-session (3)
  {
    id: "c13",
    targetSlug: "intro-to-react-session",
    author: "sengfah",
    createdAtISO: "2026-07-17T10:00:00Z",
    lang: "en",
    body: "Signed up. Will the recording have captions? Connections here drop a lot.",
  },
  {
    id: "c14",
    targetSlug: "intro-to-react-session",
    author: "lasho_online",
    createdAtISO: "2026-07-17T10:35:00Z",
    lang: "en",
    body: "I'll add captions afterwards. The live session will be slow-paced for exactly that reason.",
    parentId: "c13",
  },
  {
    id: "c15",
    targetSlug: "intro-to-react-session",
    author: "tai_builds",
    createdAtISO: "2026-07-17T12:10:00Z",
    lang: "en",
    body: "Teaching React in Shan is exactly what beginners here need. Thank you for doing this.",
  },

  // designer-for-shan-learning-app (4)
  {
    id: "c16",
    targetSlug: "designer-for-shan-learning-app",
    author: "panglong_pixels",
    createdAtISO: "2026-07-16T22:20:00Z",
    lang: "en",
    body: "Interested — typography with Regular-only fonts is a fun constraint. Sent you a message.",
  },
  {
    id: "c17",
    targetSlug: "designer-for-shan-learning-app",
    author: "keng_tung_js",
    createdAtISO: "2026-07-16T22:55:00Z",
    lang: "en",
    body: "Great, replied. The hierarchy problem is exactly where I'm stuck.",
    parentId: "c16",
  },
  {
    id: "c18",
    targetSlug: "designer-for-shan-learning-app",
    author: "nam_oo",
    createdAtISO: "2026-07-16T23:40:00Z",
    lang: "en",
    body: "Following this. A well-designed Shan learning app is overdue.",
  },
  {
    id: "c19",
    targetSlug: "designer-for-shan-learning-app",
    author: "mongla_dev",
    createdAtISO: "2026-07-17T01:05:00Z",
    lang: "en",
    body: "For hierarchy without weight, lean on size and letter-spacing. Colour carries a lot too.",
  },

  // editor-font-shan-tha-tones (5)
  {
    id: "c20",
    targetSlug: "editor-font-shan-tha-tones",
    author: "namkham_codes",
    createdAtISO: "2026-07-16T15:00:00Z",
    lang: "en",
    body: "Noto Sans Myanmar renders the tones cleanly in VS Code for me, but the metrics feel off.",
  },
  {
    id: "c21",
    targetSlug: "editor-font-shan-tha-tones",
    author: "panglong_pixels",
    createdAtISO: "2026-07-16T15:35:00Z",
    lang: "en",
    body: "Same — the line height fights my Latin font. Still hunting for a good pairing.",
    parentId: "c20",
  },
  {
    id: "c22",
    targetSlug: "editor-font-shan-tha-tones",
    author: "tai_builds",
    createdAtISO: "2026-07-16T16:20:00Z",
    lang: "en",
    body: "The AJ fonts this site uses render SHAN THA correctly. Wish more editors bundled them.",
  },
  {
    id: "c23",
    targetSlug: "editor-font-shan-tha-tones",
    author: "sengfah",
    createdAtISO: "2026-07-16T17:10:00Z",
    lang: "en",
    body: "Screenshot of my setup incoming once I'm at my desk. Fira Code with a Noto Myanmar fallback.",
  },
  {
    id: "c24",
    targetSlug: "editor-font-shan-tha-tones",
    author: "nam_oo",
    createdAtISO: "2026-07-16T18:30:00Z",
    lang: "en",
    body: "Boxed tone marks are almost always a missing-font fallback, not the editor itself.",
  },

  // === Projects (lib/projects.ts) ===

  // shan-gboard-layout (3)
  {
    id: "pc1",
    targetSlug: "shan-gboard-layout",
    author: "nam_oo",
    createdAtISO: "2026-07-01T04:10:00Z",
    lang: "en",
    body: "Been waiting for a sane Shan GBoard layout. Installing on my Redmi Note now.",
  },
  {
    id: "pc2",
    targetSlug: "shan-gboard-layout",
    author: "tai_builds",
    createdAtISO: "2026-07-01T05:00:00Z",
    lang: "en",
    body: "Thanks — feedback on the tone-row placement is what I need most before I submit it.",
    parentId: "pc1",
  },
  {
    id: "pc3",
    targetSlug: "shan-gboard-layout",
    author: "keng_tung_js",
    createdAtISO: "2026-07-01T07:30:00Z",
    lang: "en",
    body: "The long-press tones work well once you build the muscle memory. Nice work.",
  },

  // shan-dates (2)
  {
    id: "pc4",
    targetSlug: "shan-dates",
    author: "namkham_codes",
    createdAtISO: "2026-07-07T02:20:00Z",
    lang: "en",
    body: "Dropped this into a project today and the Shan numeral formatting just worked.",
  },
  {
    id: "pc5",
    targetSlug: "shan-dates",
    author: "sengfah",
    createdAtISO: "2026-07-07T09:45:00Z",
    lang: "en",
    body: "Tests pass on my end too. Clean API — thanks for keeping it MIT.",
  },

  // shan-wordlist (2)
  {
    id: "pc6",
    targetSlug: "shan-wordlist",
    author: "namkham_codes",
    createdAtISO: "2026-07-10T03:05:00Z",
    lang: "en",
    body: "This is exactly the seed list I needed for the tokenizer. Thank you for cleaning it up.",
  },
  {
    id: "pc7",
    targetSlug: "shan-wordlist",
    author: "lasho_online",
    createdAtISO: "2026-07-10T11:20:00Z",
    lang: "en",
    body: "Great to see the old spellchecker data getting a second life.",
  },

  // shan-search (3)
  {
    id: "pc8",
    targetSlug: "shan-search",
    author: "mongla_dev",
    createdAtISO: "2026-07-13T01:40:00Z",
    lang: "en",
    body: "How are you segmenting words with no spaces — a dictionary, or pure n-grams?",
  },
  {
    id: "pc9",
    targetSlug: "shan-search",
    author: "namkham_codes",
    createdAtISO: "2026-07-13T02:25:00Z",
    lang: "en",
    body: "Dictionary-first with an n-gram fallback. Index size is the tradeoff I'm still tuning.",
    parentId: "pc8",
  },
  {
    id: "pc10",
    targetSlug: "shan-search",
    author: "panglong_pixels",
    createdAtISO: "2026-07-13T08:10:00Z",
    lang: "en",
    body: "Recall looks solid in my quick test. Nice.",
  },

  // saolearn (2)
  {
    id: "pc11",
    targetSlug: "saolearn",
    author: "lasho_online",
    createdAtISO: "2026-07-16T05:30:00Z",
    lang: "en",
    body: "My students would love this. Let me know when you want testers.",
  },
  {
    id: "pc12",
    targetSlug: "saolearn",
    author: "panglong_pixels",
    createdAtISO: "2026-07-16T13:00:00Z",
    lang: "en",
    body: "Happy to help with the typography whenever you're ready.",
  },

  // tai-type-specimen (2)
  {
    id: "pc13",
    targetSlug: "tai-type-specimen",
    author: "tai_builds",
    createdAtISO: "2026-07-19T06:15:00Z",
    lang: "en",
    body: "Setting stacked characters and watching them render is oddly satisfying.",
  },
  {
    id: "pc14",
    targetSlug: "tai-type-specimen",
    author: "keng_tung_js",
    createdAtISO: "2026-07-19T10:40:00Z",
    lang: "en",
    body: "Bookmarked. Great reference for checking tone-mark rendering.",
  },

  // shan-notes (1)
  {
    id: "pc15",
    targetSlug: "shan-notes",
    author: "sengfah",
    createdAtISO: "2026-07-22T07:00:00Z",
    lang: "en",
    body: "Runs smooth offline on my Redmi Note. Does exactly what it says.",
  },

  // === Events (lib/events.ts) ===

  // intro-to-react-in-shan (3)
  {
    id: "ec1",
    targetSlug: "intro-to-react-in-shan",
    author: "sengfah",
    createdAtISO: "2026-07-11T02:30:00Z",
    lang: "en",
    body: "Signed up. Will there be a recording for those of us on unstable connections?",
  },
  {
    id: "ec2",
    targetSlug: "intro-to-react-in-shan",
    author: "lasho_online",
    createdAtISO: "2026-07-11T03:15:00Z",
    lang: "en",
    body: "Yes — the recording and captions will be posted afterwards.",
    parentId: "ec1",
  },
  {
    id: "ec3",
    targetSlug: "intro-to-react-in-shan",
    author: "nam_oo",
    createdAtISO: "2026-07-11T09:20:00Z",
    lang: "en",
    body: "Teaching React in Shan is exactly what beginners here need. Thank you.",
  },

  // beginner-git-workshop (2)
  {
    id: "ec4",
    targetSlug: "beginner-git-workshop",
    author: "keng_tung_js",
    createdAtISO: "2026-07-16T04:00:00Z",
    lang: "en",
    body: "Git from scratch in Shan — sending this to a friend who's just starting out.",
  },
  {
    id: "ec5",
    targetSlug: "beginner-git-workshop",
    author: "namkham_codes",
    createdAtISO: "2026-07-16T06:45:00Z",
    lang: "en",
    body: "Will you cover pull requests, or just local branches and commits?",
  },

  // shan-dev-meetup-kengtung (2)
  {
    id: "ec6",
    targetSlug: "shan-dev-meetup-kengtung",
    author: "tai_builds",
    createdAtISO: "2026-07-19T05:10:00Z",
    lang: "en",
    body: "I'll be there. Good to finally meet people in person.",
  },
  {
    id: "ec7",
    targetSlug: "shan-dev-meetup-kengtung",
    author: "panglong_pixels",
    createdAtISO: "2026-07-19T12:30:00Z",
    lang: "en",
    body: "Wish I could make the trip. Hope someone records the talks.",
  },

  // keyboard-testing-sprint (2)
  {
    id: "ec8",
    targetSlug: "keyboard-testing-sprint",
    author: "nam_oo",
    createdAtISO: "2026-07-15T03:20:00Z",
    lang: "en",
    body: "Count me in for testing on a low-end device.",
  },
  {
    id: "ec9",
    targetSlug: "keyboard-testing-sprint",
    author: "sengfah",
    createdAtISO: "2026-07-15T08:00:00Z",
    lang: "en",
    body: "I'll bring a fresh install so we catch any first-run issues.",
  },

  // shan-unicode-clinic (2)
  {
    id: "ec10",
    targetSlug: "shan-unicode-clinic",
    author: "namkham_codes",
    createdAtISO: "2026-06-29T02:15:00Z",
    lang: "en",
    body: "The Zawgyi-vs-Unicode detection part saved me hours. Thanks for posting the recording.",
  },
  {
    id: "ec11",
    targetSlug: "shan-unicode-clinic",
    author: "mongla_dev",
    createdAtISO: "2026-06-29T05:40:00Z",
    lang: "en",
    body: "Good primer. Sharing it with folks still stuck on legacy text.",
  },
];

// All comments for a target slug (post, project, or event), in posted order, for the
// detail routes. Slugs are unique across surfaces, so one lookup serves all three.
export function getCommentsFor(slug: string): Comment[] {
  return mockComments.filter((comment) => comment.targetSlug === slug);
}
