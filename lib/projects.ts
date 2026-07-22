// Mock projects for PBI-017's developer profiles. Introduced here so a profile can show
// the work a member has built — NOT the Projects surface itself, which is its own future
// PBI that owns the real data model and the /projects routes. This shape is provisional
// and mock: a plain type + array, not a DB schema, and real projects replace it without
// touching the cards.
//
// `lang` is the project's own content language (design.md per-content-language rule),
// independent of the UI locale. Mock copy is English (fabricated) — no Shan is invented.

import type { PostLang } from "./feed";

export type Project = {
  id: string;
  /** URL key for a future /projects/[slug] route; unused until that PBI. */
  slug: string;
  /** Owner handle — ties the project to a developer. */
  author: string;
  title: string;
  description: string;
  lang: PostLang;
  /** Repo or demo URL, if public. */
  url?: string;
  /** Display-only appreciation signal (stars) — the mechanic is not wired. */
  stars: number;
  tags: string[];
};

export const mockProjects: Project[] = [
  {
    id: "p1",
    slug: "shan-gboard-layout",
    author: "tai_builds",
    title: "Shan GBoard Layout",
    description:
      "A Shan keyboard layout for GBoard with the Council tones mapped where fast typists expect them.",
    lang: "en",
    url: "https://github.com/tai_builds/shan-gboard-layout",
    stars: 84,
    tags: ["keyboard", "android", "input"],
  },
  {
    id: "p2",
    slug: "shan-dates",
    author: "mongla_dev",
    title: "shan-dates",
    description:
      "Shan digit and date formatting for JavaScript. Handles Shan numerals and the Gregorian mapping. MIT.",
    lang: "en",
    url: "https://github.com/mongla_dev/shan-dates",
    stars: 132,
    tags: ["library", "i18n"],
  },
  {
    id: "p3",
    slug: "shan-wordlist",
    author: "mongla_dev",
    title: "shan-wordlist",
    description:
      "An open Shan wordlist salvaged from an old spellchecker, cleaned up for reuse in search and tokenizers.",
    lang: "en",
    url: "https://github.com/mongla_dev/shan-wordlist",
    stars: 47,
    tags: ["data", "nlp"],
  },
  {
    id: "p4",
    slug: "shan-search",
    author: "namkham_codes",
    title: "shan-search",
    description:
      "A Postgres tokenizer experiment for Shan text, which is written without spaces between words.",
    lang: "en",
    url: "https://github.com/namkham_codes/shan-search",
    stars: 68,
    tags: ["search", "postgres", "nlp"],
  },
  {
    id: "p5",
    slug: "saolearn",
    author: "keng_tung_js",
    title: "SaoLearn",
    description:
      "A learning app for Shan youth, taught in Shan. React front end, still very much a work in progress.",
    lang: "en",
    url: "https://github.com/keng_tung_js/saolearn",
    stars: 156,
    tags: ["react", "education"],
  },
  {
    id: "p6",
    slug: "tai-type-specimen",
    author: "panglong_pixels",
    title: "Tai Type Specimen",
    description:
      "An interactive specimen for the AJ Shan fonts — set tone marks and stacked characters and see them render.",
    lang: "en",
    url: "https://panglong.design/tai-type",
    stars: 39,
    tags: ["design", "fonts", "typography"],
  },
  {
    id: "p7",
    slug: "shan-notes",
    author: "nam_oo",
    title: "shan-notes",
    description:
      "A tiny offline notes app for Android, tested on a Redmi Note so it runs on the phones people actually own.",
    lang: "en",
    url: "https://github.com/nam_oo/shan-notes",
    stars: 22,
    tags: ["android", "offline"],
  },
];

export function getProjectsByAuthor(author: string): Project[] {
  return mockProjects.filter((project) => project.author === author);
}
