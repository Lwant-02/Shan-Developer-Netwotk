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

export function deriveHandle(name: string | null | undefined): string {
  if (name) {
    const normalized = normalizeHandle(name);
    if (normalized) return normalized;
  }

  return generateHandle();
}

export function nextCandidate(base: string, attempt: number): string {
  const suffix = String(attempt + 1);
  return `${base.slice(0, MAX - suffix.length)}${suffix}`;
}
