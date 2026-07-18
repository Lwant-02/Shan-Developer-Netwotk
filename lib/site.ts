// No production domain is registered yet. VERCEL_PROJECT_PRODUCTION_URL is set
// automatically on Vercel; NEXT_PUBLIC_SITE_URL overrides it once a real domain
// exists. Absolute URLs are required by the sitemap spec, so this must never be
// a guessed domain.
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
