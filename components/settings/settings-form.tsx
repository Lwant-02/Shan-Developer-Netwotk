"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Field, UrlInput } from "@/components/form/field";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { type Developer, SOCIAL, type SocialPlatform } from "@/lib/developers";
import { cn } from "@/lib/utils";
import type { Viewer } from "@/lib/viewer";

// Editing for exactly the fields the public profile renders (PBI-017's `Developer`), so
// what you change here is what other members see — nothing more. Identity safety is
// binding: there is **no email field** (OAuth emails are never public, and a settings
// form is the obvious place for one to creep in), and `location` is coarse and optional.
//
// Frontend-only (PBI-024): Save persists nothing. It is the attach point for a
// rate-limited write endpoint, which needs Better Auth first — writes over identity data
// are exactly what `AGENTS.md` requires a rate limit for.

const PLATFORMS = Object.keys(SOCIAL) as SocialPlatform[];

export function SettingsForm({
  viewer,
  developer,
}: {
  viewer: Viewer;
  developer?: Developer;
}) {
  const t = useTranslations("Settings");

  const [displayName, setDisplayName] = useState(
    developer?.displayName ?? viewer.displayName ?? "",
  );
  const [handle, setHandle] = useState(viewer.handle);
  const [role, setRole] = useState(developer?.role ?? viewer.role);
  const [bio, setBio] = useState(developer?.bio ?? "");
  const [location, setLocation] = useState(developer?.location ?? "");
  const [links, setLinks] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (developer?.links ?? []).map((link) => [link.platform, link.href]),
    ),
  );

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex items-center gap-4">
        {/* Initials, like every other avatar in the app. Upload is blocked on image
            storage (backlog Open Questions), not on this form. */}
        <span
          aria-hidden
          className="bg-muted text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-full text-lg uppercase"
        >
          {handle.slice(0, 2) || viewer.handle.slice(0, 2)}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-foreground text-sm">{t("photo")}</span>
          <span className="text-muted-foreground text-xs leading-relaxed">
            {t("photoHint")}
          </span>
        </div>
      </div>

      <Field
        label={t("fieldDisplayName")}
        htmlFor="settings-name"
        hint={t("hintDisplayName")}
      >
        <Input
          id="settings-name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder={t("phDisplayName")}
          className="h-9"
        />
      </Field>

      <Field
        label={t("fieldHandle")}
        htmlFor="settings-handle"
        hint={t("hintHandle", { handle: handle || viewer.handle })}
      >
        <Input
          id="settings-handle"
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          className="h-9"
        />
      </Field>

      <Field
        label={t("fieldRole")}
        htmlFor="settings-role"
        hint={t("hintRole")}
      >
        <Input
          id="settings-role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder={t("phRole")}
          className="h-9"
        />
      </Field>

      <Field label={t("fieldBio")} htmlFor="settings-bio">
        <Textarea
          id="settings-bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder={t("phBio")}
          rows={4}
          className="resize-none"
        />
      </Field>

      <Field
        label={t("fieldLocation")}
        htmlFor="settings-location"
        hint={t("hintLocation")}
      >
        <Input
          id="settings-location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder={t("phLocation")}
          className="h-9"
        />
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-foreground text-sm">{t("fieldLinks")}</span>
          <p className="text-muted-foreground text-xs">{t("hintLinks")}</p>
        </div>
        {PLATFORMS.map((platform) => (
          <Field
            key={platform}
            label={SOCIAL[platform].label}
            htmlFor={`settings-link-${platform}`}
          >
            <UrlInput
              id={`settings-link-${platform}`}
              value={links[platform] ?? ""}
              onChange={(value) =>
                setLinks((current) => ({ ...current, [platform]: value }))
              }
            />
          </Field>
        ))}
      </div>

      <div className="border-border flex flex-col gap-3 border-t pt-4">
        {/* Saving is a write over identity data: it needs a signed-in user and a
            rate-limited endpoint, neither of which exists. Disabled rather than inert —
            a button that looks live and silently discards edits is worse. */}
        <p className="text-muted-foreground text-xs leading-relaxed">
          {t("notSaved")}
        </p>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="submit"
            disabled
            className={cn(
              buttonVariants(),
              "h-9 w-32 font-normal disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {t("save")}
          </button>
          <Link
            href={`/developers/${viewer.handle}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 w-32 cursor-pointer font-normal",
            )}
          >
            {t("cancel")}
          </Link>
        </div>
      </div>
    </form>
  );
}
