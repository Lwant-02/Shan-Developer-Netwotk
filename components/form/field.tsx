"use client";

import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";

// The labelled-field and URL-input shapes shared by the composer (PBI-022) and the
// settings form (PBI-024). Extracted from `create-form.tsx` rather than copied: a second
// near-identical field wrapper is exactly the drift `AGENTS.md` warns about, and importing
// the composer module would drag the markdown editor into the settings bundle.

export function Field({
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

export function UrlInput({
  id,
  value,
  onChange,
  placeholder = "https://",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      id={id}
      type="url"
      inputMode="url"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-9"
    />
  );
}
