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

// Relative time is rendered with a fixed `en` locale, not the UI locale, on purpose:
// `Intl.RelativeTimeFormat` has full ICU data for `shn` in Node but not in the browser,
// so a Shan-locale relative time renders in Shan on the server and falls back to English
// on the client — a guaranteed hydration mismatch on any client tree (e.g. the "use
// client" post feed). Pinning `en` makes the output invariant across both. Pass the
// shared `now` from next-intl's `useNow()` so it also stays stable per URL.
const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
  ["second", 1000],
];

const relativeEn = new Intl.RelativeTimeFormat("en", { numeric: "always" });

export function relativeTimeEn(iso: string, now: Date): string {
  const diff = new Date(iso).getTime() - now.getTime();
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms || unit === "second") {
      return relativeEn.format(Math.round(diff / ms), unit);
    }
  }
  return relativeEn.format(0, "second");
}

// Absolute dates, also pinned to `en` for the same server/client ICU-parity reason: a
// Shan-locale month or weekday name is present in Node's ICU but absent in the browser's,
// so anything rendered inside a client tree drifts on hydration. `en` renders identically
// in both.
export function formatDateEn(
  iso: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en", options).format(new Date(iso));
}
