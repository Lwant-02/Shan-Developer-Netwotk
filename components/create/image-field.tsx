"use client";

import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

// The composer's optional photo (PBI-022), mirroring the feedback dialog's picker: a
// client-side preview only — nothing is uploaded, because delivering it needs image storage
// the app doesn't have yet. Each content model (`Post`/`Project`/`EventItem`) already carries
// an optional `image`, so this is where that attaches once storage exists. `"use client"` is
// the file handling.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function ImageField() {
  const t = useTranslations("Create");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState(false);

  function clear() {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setError(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
      clear();
      setError(true);
      return;
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setError(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-foreground text-sm">{t("fieldImage")}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {preview ? (
        <div className="border-border relative overflow-hidden rounded-lg border">
          {/* Local object-URL preview — a transient blob, not a content image, so a
              plain img is right; next/image can't optimise a blob: URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="max-h-64 w-full object-contain"
          />
          <button
            type="button"
            onClick={clear}
            aria-label={t("imageRemove")}
            className="bg-background/80 text-foreground hover:bg-background absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground hover:bg-muted/40 flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors"
        >
          <ImagePlus className="size-5" />
          <span className="text-sm">{t("imageAdd")}</span>
        </button>
      )}

      <p className="text-muted-foreground text-xs">
        {error ? t("imageError") : t("hintOptional")}
      </p>
    </div>
  );
}
