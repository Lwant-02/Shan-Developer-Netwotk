// Mock projects. Introduced by PBI-017 to list a member's work on a profile, and now the
// data behind the Projects surface itself (PBI-020: /projects directory + /projects/[slug]
// detail). This shape is provisional and mock — a plain type + array, NOT a DB schema; real
// projects replace it without touching the cards.
//
// `lang` is the project's own content language (design.md per-content-language rule),
// independent of the UI locale. Mock copy is English (fabricated) — no Shan is invented.
// Links and the image are mock too: the store URLs are placeholders, and the image reuses an
// in-repo asset (as lib/feed.ts does) because real image storage is a later PBI.

import type { PostLang } from "./feed";

export type Project = {
  id: string;
  /** URL key for the /projects/[slug] detail route. Unique across the mock. */
  slug: string;
  /** Owner handle — ties the project to a developer profile. */
  author: string;
  title: string;
  description: string;
  lang: PostLang;
  /** When the project was posted. UTC ISO. */
  createdAtISO: string;
  /** Optional project image. Real projects need storage (Neon bundles none) — a later PBI. */
  image?: string;
  /** Outbound links, each optional — not every project has all four. */
  repo?: string;
  website?: string;
  appStore?: string;
  playStore?: string;
  /** Display-only appreciation signal (stars) — the mechanic is not wired. */
  stars: number;
  /** Display-only comment count, mirroring the feed card — not wired. */
  comments: number;
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
    createdAtISO: "2026-06-30T09:00:00Z",
    image: "/icons/icon-512.png",
    repo: "https://github.com/tai_builds/shan-gboard-layout",
    playStore:
      "https://play.google.com/store/apps/details?id=com.taibuilds.shangboard",
    stars: 84,
    comments: 3,
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
    createdAtISO: "2026-07-06T09:00:00Z",
    repo: "https://github.com/mongla_dev/shan-dates",
    stars: 132,
    comments: 2,
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
    createdAtISO: "2026-07-09T09:00:00Z",
    repo: "https://github.com/mongla_dev/shan-wordlist",
    stars: 47,
    comments: 2,
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
    createdAtISO: "2026-07-12T09:00:00Z",
    repo: "https://github.com/namkham_codes/shan-search",
    stars: 68,
    comments: 3,
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
    createdAtISO: "2026-07-15T09:00:00Z",
    image: "/icons/icon-512.png",
    repo: "https://github.com/keng_tung_js/saolearn",
    website: "https://saolearn.app",
    appStore: "https://apps.apple.com/app/saolearn/id0000000000",
    playStore: "https://play.google.com/store/apps/details?id=app.saolearn",
    stars: 156,
    comments: 2,
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
    createdAtISO: "2026-07-18T09:00:00Z",
    image: "/icons/icon-512.png",
    website: "https://panglong.design/tai-type",
    stars: 39,
    comments: 2,
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
    createdAtISO: "2026-07-21T09:00:00Z",
    repo: "https://github.com/nam_oo/shan-notes",
    playStore: "https://play.google.com/store/apps/details?id=oo.nam.shannotes",
    stars: 22,
    comments: 1,
    tags: ["android", "offline"],
  },
];

export function getProjectsByAuthor(author: string): Project[] {
  return mockProjects.filter((project) => project.author === author);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return mockProjects.find((project) => project.slug === slug);
}

export function listProjects(): Project[] {
  return mockProjects;
}
