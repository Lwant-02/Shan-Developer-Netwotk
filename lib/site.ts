// Brand-level constants for site metadata. Values here are language-independent
// or English by necessity (SEO description); localising the description needs
// Shan marketing copy, which is a human task — see AGENTS.md.
export const siteConfig = {
  name: "Shan Developer Network",
  // Home-screen label under the PWA icon, where long names truncate.
  shortName: "SDN",
  title: "Shan Developer Network",
  description:
    "A community platform for Shan-speaking developers — profiles, projects, posts, and member-hosted events.",
  keywords: [
    "Shan",
    "Shan developers",
    "Tai Yai",
    "Shan script",
    "developer community",
    "Myanmar developers",
  ],
  logo: "/icons/logo.svg",
} as const;

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
