import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Avatars are seeded from the OAuth provider (PBI-028), and `next/image` refuses any
    // remote host not listed here — without these, every signed-in avatar 400s. Kept to
    // exact hostnames rather than wildcards: this list is what stops the optimizer being
    // used as an open proxy for arbitrary images.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
