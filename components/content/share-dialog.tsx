"use client";

import { useTranslations } from "next-intl";
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  ViberIcon,
  ViberShareButton,
  XIcon,
  XShareButton,
} from "react-share";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// The content share dialog (PBI-026). Loaded lazily by `ShareButton` — `react-share` must
// not sit in the bundle of every page that renders a card, since the target reader is on
// a mid-range Android on mobile data and most never tap Share.
//
// Network order is a locality decision, not the library's defaults: Facebook, Telegram,
// Viber, and LINE are where this audience already is (design.md — Telegram is where
// Myanmar tech conversation lives). X and LinkedIn are for reach beyond it.
//
// Share counts are deliberately absent: `react-share` can fetch them, but that is a
// third-party request per card, and a zero next to a member's post is discouraging.
//
// No copy-link control either (owner's call, matching the profile dialog in PBI-018).
// Each network button already carries the URL — `react-share` builds the share link from
// it — so a copy field only served channels that aren't listed here.
//
// The profile share (PBI-018) is a separate, QR-based dialog on purpose — that one shares
// a person as a card, this one shares content as a link.

const NETWORKS = [
  { key: "facebook", Button: FacebookShareButton, Icon: FacebookIcon },
  { key: "telegram", Button: TelegramShareButton, Icon: TelegramIcon },
  { key: "viber", Button: ViberShareButton, Icon: ViberIcon },
  { key: "line", Button: LineShareButton, Icon: LineIcon },
  { key: "x", Button: XShareButton, Icon: XIcon },
  { key: "linkedin", Button: LinkedinShareButton, Icon: LinkedinIcon },
] as const;

export function ShareDialog({
  url,
  title,
  open,
  onOpenChange,
}: {
  url: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Share");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-normal">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-3 justify-center items-center">
          {NETWORKS.map(({ key, Button, Icon }) => (
            <Button
              key={key}
              url={url}
              title={title}
              aria-label={t(`network_${key}`)}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              {/* `round` matches the app's single radius better than the library's
                  default square marks. */}
              <Icon size={40} round />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
