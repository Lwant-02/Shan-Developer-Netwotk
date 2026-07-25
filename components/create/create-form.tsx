"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { toUtcISO } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { DateTimeField } from "./date-time-field";
import { ImageField } from "./image-field";
import { MarkdownEditor } from "./markdown-editor";

export type CreateType = "post" | "project" | "event";

// The one composer shell shared by all three content types (PBI-022). Frontend-only: it
// holds draft state and validates nothing to a server — Publish opens the sign-in gate,
// which is where a real, rate-limited write endpoint attaches once auth exists. It asserts
// no logged-in identity. `"use client"` is inherent to a form; this is the single
// interactive island, with the sign-in dialog and markdown editor as its leaves.
export function CreateForm({ type }: { type: CreateType }) {
  const t = useTranslations("Create");

  // Shared across every type.
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Project.
  const [repo, setRepo] = useState("");
  const [website, setWebsite] = useState("");
  const [appStore, setAppStore] = useState("");
  const [playStore, setPlayStore] = useState("");
  const [tags, setTags] = useState("");

  // Event.
  const [startsLocal, setStartsLocal] = useState("");
  const [online, setOnline] = useState(true);
  const [location, setLocation] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [registerUrl, setRegisterUrl] = useState("");

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field label={t("fieldTitle")} htmlFor="create-title">
        <Input
          id="create-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t(`phTitle_${type}`)}
          className="h-9"
        />
      </Field>

      <Field
        label={t(type === "post" ? "fieldBody" : "fieldDescription")}
        htmlFor="create-body"
      >
        <MarkdownEditor
          id="create-body"
          value={body}
          onChange={setBody}
          placeholder={t(`phBody_${type}`)}
        />
      </Field>

      <ImageField />

      {type === "project" && (
        <>
          <Field label={t("fieldRepo")} htmlFor="create-repo">
            <UrlInput id="create-repo" value={repo} onChange={setRepo} />
          </Field>
          <Field label={t("fieldWebsite")} htmlFor="create-website">
            <UrlInput
              id="create-website"
              value={website}
              onChange={setWebsite}
            />
          </Field>
          <Field label={t("fieldAppStore")} htmlFor="create-appstore">
            <UrlInput
              id="create-appstore"
              value={appStore}
              onChange={setAppStore}
            />
          </Field>
          <Field label={t("fieldPlayStore")} htmlFor="create-playstore">
            <UrlInput
              id="create-playstore"
              value={playStore}
              onChange={setPlayStore}
            />
          </Field>
          <Field
            label={t("fieldTags")}
            htmlFor="create-tags"
            hint={t("hintTags")}
          >
            <Input
              id="create-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder={t("phTags")}
              className="h-9"
            />
          </Field>
        </>
      )}

      {type === "event" && (
        <>
          <Field
            label={t("fieldStart")}
            htmlFor="create-start"
            hint={
              startsLocal
                ? t("storedUtc", { iso: toUtcISO(startsLocal) })
                : undefined
            }
          >
            <DateTimeField
              id="create-start"
              value={startsLocal}
              onChange={setStartsLocal}
            />
          </Field>

          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={online}
              onCheckedChange={(checked) => setOnline(checked === true)}
            />
            {t("fieldOnline")}
          </label>

          {online ? (
            <Field label={t("fieldJoinUrl")} htmlFor="create-join">
              <UrlInput
                id="create-join"
                value={joinUrl}
                onChange={setJoinUrl}
              />
            </Field>
          ) : (
            <Field
              label={t("fieldLocation")}
              htmlFor="create-location"
              hint={t("hintLocation")}
            >
              <Input
                id="create-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={t("phLocation")}
                className="h-9"
              />
            </Field>
          )}

          <Field
            label={t("fieldRegisterUrl")}
            htmlFor="create-register"
            hint={t("hintOptional")}
          >
            <UrlInput
              id="create-register"
              value={registerUrl}
              onChange={setRegisterUrl}
            />
          </Field>
        </>
      )}

      <div className="border-border flex flex-wrap justify-end items-center gap-3 border-t pt-4">
        {/* Publishing is a write: it needs a signed-in user and a rate-limited endpoint,
            neither of which exists. So Publish opens the sign-in gate rather than
            persisting anything, and never asserts a logged-in identity. */}
        <SignInDialog>
          <button
            type="button"
            className={cn(
              buttonVariants(),
              "cursor-pointer font-normal w-32 h-9",
            )}
          >
            {t("publish")}
          </button>
        </SignInDialog>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "cursor-pointer font-normal w-32 h-9",
          )}
        >
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-foreground text-sm">
        {label}
      </label>
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  );
}

function UrlInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      id={id}
      type="url"
      inputMode="url"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="https://"
      className="h-9"
    />
  );
}
