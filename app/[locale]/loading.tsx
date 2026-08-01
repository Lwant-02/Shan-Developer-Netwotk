import { Swirling } from "@/components/ui/swirling";

// No translations here on purpose. `loading.tsx` receives no `params`, so it cannot call
// `setRequestLocale()`; next-intl then reads headers to find the locale and **every route
// under this segment turns dynamic**. Same trap as the 404 title (AGENTS.md), so the label
// is a static English string.
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen w-full items-center justify-center"
    >
      <Swirling className="text-muted-foreground size-16" />
    </div>
  );
}
