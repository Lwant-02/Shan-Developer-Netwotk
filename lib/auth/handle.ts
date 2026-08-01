import type { User } from "@supabase/supabase-js";

// Handle and display name come from the OAuth profile name, then GitHub's login, then
// a generated fallback. The email is never used — addresses are too often
// `firstname.lastname`, so it would leak the address itself.

const MIN = 3;
const MAX = 30;

// Impossible to claw back once someone holds one.
const RESERVED = new Set([
  "admin",
  "administrator",
  "moderator",
  "mod",
  "staff",
  "support",
  "help",
  "official",
  "system",
  "root",
  "shn",
  "sdn",
  "shandev",
  "shandevelopernetwork",
]);

// No ambiguous glyphs — these get read aloud and typed by hand.
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

function randomSuffix(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** A handle nobody chose, for providers that expose no public username. */
export function generateHandle() {
  return `member_${randomSuffix(6)}`;
}

/** Fold an arbitrary provider string into the handle charset, or reject it. */
export function normalizeHandle(raw: string): string | null {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  if (cleaned.length < MIN || RESERVED.has(cleaned)) return null;
  return cleaned.slice(0, MAX);
}

function claim(user: User, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = user.user_metadata?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

/** The provider's name for this person, or `null`. Never the email. */
export function deriveDisplayName(user: User): string | null {
  return claim(user, "full_name", "name");
}

/** GitHub calls it `avatar_url`, Google `picture`. */
export function deriveAvatarUrl(user: User): string | null {
  // https only: this ends up in an <img> src.
  const url = claim(user, "avatar_url", "picture");
  return url?.startsWith("https://") ? url : null;
}

/** First candidate for a new member. Uniqueness is the database's job, not this. */
export function deriveHandle(user: User): string {
  // `user_metadata` is user-writable — fine here, and the reason no authorization
  // code reads from it.
  const fromName = deriveDisplayName(user);
  if (fromName) {
    const normalized = normalizeHandle(fromName);
    if (normalized) return normalized;
  }

  const login = claim(user, "user_name", "preferred_username");
  if (login) {
    const normalized = normalizeHandle(login);
    if (normalized) return normalized;
  }

  return generateHandle();
}

/** Next candidate after a collision: `tai_builds` → `tai_builds2` → `tai_builds3`. */
export function nextCandidate(base: string, attempt: number): string {
  const suffix = String(attempt + 1);
  return `${base.slice(0, MAX - suffix.length)}${suffix}`;
}
