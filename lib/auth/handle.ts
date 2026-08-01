import type { User } from "@supabase/supabase-js";

const MIN = 3;
const MAX = 30;

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

const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

function randomSuffix(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function generateHandle() {
  return `member_${randomSuffix(6)}`;
}

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

export function deriveDisplayName(user: User): string | null {
  return claim(user, "full_name", "name");
}

export function deriveAvatarUrl(user: User): string | null {
  const url = claim(user, "avatar_url", "picture");
  return url?.startsWith("https://") ? url : null;
}

export function deriveHandle(user: User): string {
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

export function nextCandidate(base: string, attempt: number): string {
  const suffix = String(attempt + 1);
  return `${base.slice(0, MAX - suffix.length)}${suffix}`;
}
