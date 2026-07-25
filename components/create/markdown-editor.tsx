"use client";

import { Code, List, ListOrdered, Quote, SquareCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { applyMarkdown, type MarkdownAction } from "@/lib/markdown";

// The composer's body field (PBI-022): a plain textarea with a Slack-style formatting
// toolbar. Each button applies a pure markdown edit (lib/markdown.ts) and restores the
// selection, so authors can also just type. `"use client"` is forced by the selection ref
// and the click handlers. No faux-bold anywhere — any label or body can be Shan, and the AJ
// fonts are Regular-only.
const TOOLS: { action: MarkdownAction; Icon: typeof Code; labelKey: string }[] =
  [
    { action: "bullet-list", Icon: List, labelKey: "toolBulletList" },
    { action: "ordered-list", Icon: ListOrdered, labelKey: "toolOrderedList" },
    { action: "quote", Icon: Quote, labelKey: "toolQuote" },
    { action: "inline-code", Icon: Code, labelKey: "toolInlineCode" },
    { action: "code-block", Icon: SquareCode, labelKey: "toolCodeBlock" },
  ];

export function MarkdownEditor({
  id,
  value,
  onChange,
  placeholder,
  lang,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  lang?: string;
}) {
  const t = useTranslations("Create");
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(action: MarkdownAction) {
    const el = ref.current;
    if (!el) return;
    const next = applyMarkdown(
      value,
      el.selectionStart,
      el.selectionEnd,
      action,
    );
    onChange(next.value);
    // Restore the selection after React has written the new value back to the textarea.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(next.selectionStart, next.selectionEnd);
    });
  }

  return (
    <div className="border-input focus-within:border-ring focus-within:ring-ring/50 flex flex-col rounded-lg border transition-colors focus-within:ring-3">
      <div className="border-border flex flex-wrap items-center gap-0.5 border-b p-1">
        {TOOLS.map(({ action, Icon, labelKey }) => (
          <button
            key={action}
            type="button"
            aria-label={t(labelKey)}
            onClick={() => apply(action)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        lang={lang}
        rows={8}
        className="text-foreground placeholder:text-muted-foreground w-full resize-none bg-transparent px-3 py-2 text-sm leading-relaxed outline-none"
      />
    </div>
  );
}
