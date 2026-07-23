"use client";

import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useRef, type ReactElement } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Developer } from "@/lib/developers";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

// The share surface for a profile (PBI-018): a card carrying a QR of the profile URL,
// downloadable as a PNG. There is deliberately no copy-link field — the QR carries the URL.
//
// `"use client"` is forced by the dialog state, the download handler, and the canvas work.
// The trigger arrives as `children` (the PBI-014 pattern) so the server page owns the button
// and its translated label. Activity counts arrive as a prop rather than being derived here,
// so the mock data modules stay out of the client bundle.
//
// The card shows only what the profile already shows publicly — never an email, never a
// precise location — so sharing exposes nothing new.

export type ProfileStats = { posts: number; projects: number; events: number };

// Logical card size; the PNG is rendered at 2x for crispness.
const CARD_W = 400;
const CARD_H = 620;
const EXPORT_SCALE = 2;

// Greedy word-wrap for the bio, ellipsised at `maxLines` — canvas has no text wrapping.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = candidate;
    }
  }

  if (lines.length < maxLines && line) lines.push(line);
  else if (lines.length === maxLines) lines[maxLines - 1] += "…";

  return lines;
}

export function ShareProfileDialog({
  developer,
  profileUrl,
  stats,
  children,
}: {
  developer: Developer;
  profileUrl: string;
  stats: ProfileStats;
  children: ReactElement;
}) {
  const t = useTranslations("Developers");
  const format = useFormatter();
  const cardRef = useRef<HTMLDivElement>(null);
  const exportQrRef = useRef<HTMLDivElement>(null);

  const name = developer.displayName ?? developer.handle;
  const joined = t("joined", {
    date: format.dateTime(new Date(developer.joinedAtISO), {
      month: "long",
      year: "numeric",
    }),
  });
  const meta = [developer.location, joined].filter(Boolean).join(" · ");
  const statItems = [
    { label: t("posts"), value: stats.posts },
    { label: t("projects"), value: stats.projects },
    { label: t("events"), value: stats.events },
  ];

  async function handleDownload() {
    const card = cardRef.current;
    const qrCanvas = exportQrRef.current?.querySelector("canvas");
    if (!card || !qrCanvas) return;

    // Without this the PNG can rasterise before the AJ fonts load, which would drop Shan
    // back to a fallback face and distort tone marks.
    await document.fonts.ready;

    // Brand logo for the header. `document.createElement` because next/image's `Image`
    // shadows the global here. Best-effort — if it fails to decode, the name still prints.
    const logo = document.createElement("img");
    logo.src = siteConfig.logo;
    let logoOk = false;
    try {
      await logo.decode();
      logoOk = true;
    } catch {
      logoOk = false;
    }

    const canvas = document.createElement("canvas");
    canvas.width = CARD_W * EXPORT_SCALE;
    canvas.height = CARD_H * EXPORT_SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

    // Colours and the font stack come from the live card, so the PNG tracks the theme
    // tokens instead of hardcoded values that would drift.
    const styles = getComputedStyle(card);
    const font = styles.fontFamily;
    const background = styles.backgroundColor;
    const foreground = styles.color;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    const centre = CARD_W / 2;

    const write = (text: string, y: number, size: number, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = foreground;
      ctx.font = `${size}px ${font}`;
      ctx.fillText(text, centre, y);
      ctx.globalAlpha = 1;
    };

    const rule = (y: number) => {
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = foreground;
      ctx.fillRect(40, y, CARD_W - 80, 1);
      ctx.globalAlpha = 1;
    };

    // Header: logo + wordmark on one centred row, matching the DOM preview (drawing the
    // logo above the name made it "jump up" on download).
    const brandBaseline = 40;
    const logoSize = 16;
    const logoGap = 6;
    ctx.font = `12px ${font}`;
    const brandTextW = ctx.measureText(siteConfig.name).width;
    const rowW = (logoOk ? logoSize + logoGap : 0) + brandTextW;
    const rowLeft = centre - rowW / 2;
    if (logoOk) {
      ctx.drawImage(logo, rowLeft, brandBaseline - 13, logoSize, logoSize);
    }
    ctx.textAlign = "left";
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = foreground;
    ctx.fillText(
      siteConfig.name,
      rowLeft + (logoOk ? logoSize + logoGap : 0),
      brandBaseline,
    );
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    rule(56);

    // Avatar: a tinted disc with the handle's initials, never a photo or identity claim.
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = foreground;
    ctx.beginPath();
    ctx.arc(centre, 112, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    write(developer.handle.slice(0, 2).toUpperCase(), 120, 22, 0.75);

    write(name, 178, 22, 1);
    write(developer.role, 202, 14, 0.65);
    write(meta, 224, 12, 0.5);

    ctx.font = `13px ${font}`;
    const bioLines = wrapText(ctx, developer.bio, CARD_W - 80, 2);
    bioLines.forEach((line, index) => write(line, 254 + index * 18, 13, 0.7));

    rule(302);

    // Three evenly spaced activity counts.
    statItems.forEach((stat, index) => {
      const x = (CARD_W / 4) * (index + 1);
      ctx.globalAlpha = 1;
      ctx.fillStyle = foreground;
      ctx.font = `18px ${font}`;
      ctx.fillText(String(stat.value), x, 332);
      ctx.globalAlpha = 0.5;
      ctx.font = `10px ${font}`;
      ctx.fillText(stat.label.toUpperCase(), x, 350);
      ctx.globalAlpha = 1;
    });

    rule(374);

    // The QR keeps a white plate regardless of theme — scanners need the contrast.
    const plate = 160;
    const plateX = centre - plate / 2;
    const plateY = 394;
    ctx.fillStyle = "#ffffff";
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(plateX, plateY, plate, plate, 8);
      ctx.fill();
    } else {
      ctx.fillRect(plateX, plateY, plate, plate);
    }
    const pad = 12;
    ctx.drawImage(
      qrCanvas,
      plateX + pad,
      plateY + pad,
      plate - pad * 2,
      plate - pad * 2,
    );

    write(developer.handle, 582, 13, 0.6);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `sdn-${developer.handle}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <Dialog>
      <DialogTrigger render={children} />

      {/* rounded-lg overrides the registry's rounded-xl; font-normal keeps a title that can
          carry Shan off the synthesized bold face. */}
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-normal">{t("share")}</DialogTitle>
          <DialogDescription>{t("shareDescription")}</DialogDescription>
        </DialogHeader>

        <div
          ref={cardRef}
          className="border-border bg-card text-foreground flex flex-col items-center gap-3 rounded-lg border px-6 py-5 text-center"
        >
          <div className="flex items-center gap-2">
            {/* The logo is white strokes on transparent — it sits on the dark card as-is. */}
            <Image
              src={siteConfig.logo}
              alt=""
              width={16}
              height={16}
              unoptimized
              className="size-4"
            />
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
              {siteConfig.name}
            </span>
          </div>
          <hr className="border-border w-full" />

          <span
            aria-hidden
            className="bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full text-base uppercase"
          >
            {developer.handle.slice(0, 2)}
          </span>

          <div className="flex flex-col gap-0.5">
            <span className="text-foreground text-lg leading-snug">{name}</span>
            <span className="text-muted-foreground text-sm">
              {developer.role}
            </span>
            <span className="text-muted-foreground text-xs">{meta}</span>
          </div>

          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {developer.bio}
          </p>

          <hr className="border-border w-full" />

          <div className="grid w-full grid-cols-3">
            {statItems.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-foreground text-base tabular-nums">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-border w-full" />

          {/* bg-white is deliberate and must NOT follow the theme: a QR needs a light plate
              behind dark modules to stay scannable on this dark UI. */}
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={profileUrl} size={128} />
          </div>

          <span className="text-muted-foreground text-xs">
            {developer.handle}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full cursor-pointer font-normal",
          )}
        >
          {t("download")}
        </button>

        {/* Off-screen high-resolution canvas copy, used only as the source for the PNG —
            exporting the small on-screen SVG would rasterise blurry. */}
        <div
          ref={exportQrRef}
          aria-hidden
          className="pointer-events-none absolute top-0 left-[-9999px]"
        >
          <QRCodeCanvas value={profileUrl} size={512} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
