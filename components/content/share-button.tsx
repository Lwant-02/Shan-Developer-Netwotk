"use client";

import { Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

const importDialog = () => import("./share-dialog");

// `react-share` is fetched only once someone reaches for Share. This control sits on every
// card in the feed, so a static import would put the whole library in the bundle of every
// anonymous reader on mobile data who never taps it — the same reasoning that keeps kbar
// out of the layout (PBI-012, `search-trigger.tsx`).
const ShareDialog = dynamic(
  () => importDialog().then((m) => m.ShareDialog),
  { ssr: false },
);

// The one share control for the feed, project, and event cards. `url` is the item's
// canonical absolute URL, built on the server by the card — `siteUrl()` falls back to a
// server-only Vercel env var, so computing it here would produce `localhost` links in
// production.
export function ShareButton({
  url,
  title,
  label,
  className,
}: {
  url: string;
  title: string;
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fetch the chunk on hover/focus so the click doesn't wait on the network. The module
  // cache makes repeat calls free.
  const prefetch = useCallback(() => {
    void importDialog();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-label={label}
        className={cn(
          "text-muted-foreground bg-muted hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors",
          className,
        )}
      >
        <Share2 className="size-4" />
        <span>{label}</span>
      </button>

      {loaded && (
        <ShareDialog
          url={url}
          title={title}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
