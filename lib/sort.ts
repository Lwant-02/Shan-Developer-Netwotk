// Shared sort for the feed, projects, and events directories. Pure and generic: each
// surface passes accessors for the two fields any card carries — a created timestamp and an
// appreciation count (likes for posts, stars for projects/events).
//
// NOTE: `popular` orders by that appreciation count. Ranking by popularity is the question
// design.md deliberately holds open (🔴) — "the like is an expression, not yet a sort key";
// it is wired here by owner decision, not because that question was settled.

export type SortKey = "newest" | "popular" | "oldest";

type Accessors<T> = {
  createdAtISO: (item: T) => string;
  score: (item: T) => number;
};

export function sortItems<T>(items: T[], key: SortKey, get: Accessors<T>): T[] {
  const at = (iso: string) => new Date(iso).getTime();
  const copy = [...items];
  switch (key) {
    case "newest":
      return copy.sort(
        (a, b) => at(get.createdAtISO(b)) - at(get.createdAtISO(a)),
      );
    case "oldest":
      return copy.sort(
        (a, b) => at(get.createdAtISO(a)) - at(get.createdAtISO(b)),
      );
    case "popular":
      // Ties fall back to newest-first so the order is stable and predictable.
      return copy.sort(
        (a, b) =>
          get.score(b) - get.score(a) ||
          at(get.createdAtISO(b)) - at(get.createdAtISO(a)),
      );
  }
}
