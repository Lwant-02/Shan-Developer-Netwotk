// Convert a datetime-local input value ("2026-08-02T13:00", no zone) to a UTC ISO string.
// The browser parses the value in its own zone — for the target Shan author that is Myanmar
// UTC+06:30 — and `toISOString()` normalises to UTC. This is PBI-021's store-UTC rule: never
// persist a naive local time, because the +06:30 half-hour offset is what naive code mangles.
// Returns "" for empty or unparseable input.
export function toUtcISO(local: string): string {
  if (!local) return "";
  const date = new Date(local);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}
