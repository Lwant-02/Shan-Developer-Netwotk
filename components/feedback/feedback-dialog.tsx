"use client";

import { Bug, ImagePlus, Lightbulb, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type ReactElement } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Feedback / issue dialog (PBI-019) — FRONTEND ONLY. The submit does NOT send anything:
// it is the attach point for the GitHub-issue write path (a server Route Handler + token),
// which is a later PBI and must arrive WITH a rate limit and spam defense (AGENTS.md). Do
// not add a fetch here without that. The image is a client-side picker only — nothing is
// uploaded; delivering it needs image storage the app doesn't have yet.
//
// `"use client"` is forced by the form state, the file handling, and the submit handler.
// The trigger arrives as `children` (the PBI-014 pattern) so the nav that hosts it stays a
// Server Component.

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TITLE_MAX = 120;
const DESCRIPTION_MAX = 2000;

type FeedbackType = "bug" | "idea";

const TYPES: { value: FeedbackType; icon: typeof Bug; labelKey: string }[] = [
  { value: "bug", icon: Bug, labelKey: "typeBug" },
  { value: "idea", icon: Lightbulb, labelKey: "typeIdea" },
];

export function FeedbackDialog({ children }: { children: ReactElement }) {
  const t = useTranslations("Feedback");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<FeedbackType>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = title.trim().length > 0 && description.trim().length > 0;

  function clearImage() {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImageError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
      clearImage();
      setImageError(true);
      return;
    }

    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setImageError(false);
  }

  function resetForm() {
    setType("bug");
    setTitle("");
    setDescription("");
    clearImage();
    setSubmitted(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    // ATTACH POINT — the GitHub-issue write path (server route) hooks in here in a later
    // PBI, sending { type, title, description, image }. Nothing is sent yet: no fetch, no
    // network. Adding a real submission here without the rate limit + token + spam defense
    // that PBI owns would break the AGENTS.md rule.
    setSubmitted(true);
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        // Reset once the close animation is done, so the panel doesn't flip to the form
        // mid-fade after a submit.
        if (!open) window.setTimeout(resetForm, 150);
      }}
    >
      <DialogTrigger render={children} />

      <DialogContent className="rounded-lg">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-normal">
                {t("successTitle")}
              </DialogTitle>
              <DialogDescription>{t("successBody")}</DialogDescription>
            </DialogHeader>
            <DialogClose
              render={
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full cursor-pointer font-normal",
                  )}
                />
              }
            >
              {t("done")}
            </DialogClose>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle className="font-normal">{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>

            <div
              role="radiogroup"
              aria-label={t("typeLabel")}
              className="grid grid-cols-2 gap-2"
            >
              {TYPES.map(({ value, icon: Icon, labelKey }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={type === value}
                  onClick={() => setType(value)}
                  className={cn(
                    buttonVariants({
                      variant: type === value ? "default" : "outline",
                    }),
                    "cursor-pointer gap-2 font-normal",
                  )}
                >
                  <Icon className="size-4" />
                  {t(labelKey)}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="feedback-title"
                className="text-foreground text-sm"
              >
                {t("fieldTitle")}
              </label>
              <Input
                id="feedback-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={TITLE_MAX}
                placeholder={t("fieldTitlePlaceholder")}
                required
                className="h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="feedback-description"
                className="text-foreground text-sm"
              >
                {t("fieldDescription")}
              </label>
              <Textarea
                id="feedback-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={DESCRIPTION_MAX}
                placeholder={t("fieldDescriptionPlaceholder")}
                className="min-h-28 resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />

              {imagePreview ? (
                <div className="border-border relative overflow-hidden rounded-lg border">
                  {/* Local object-URL preview — a transient blob, not a content image, so a
                      plain img is right; next/image can't optimise a blob: URL. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt=""
                    className="max-h-48 w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    aria-label={t("removeImage")}
                    className="bg-background/80 text-foreground hover:bg-background absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground hover:bg-muted/40 flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors"
                >
                  <ImagePlus className="size-5" />
                  <span className="text-sm">{t("addImage")}</span>
                </button>
              )}

              {imageError && (
                <p className="text-destructive text-xs">{t("imageError")}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full cursor-pointer font-normal",
              )}
            >
              {t("submit")}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
