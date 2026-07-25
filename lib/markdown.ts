// Toolbar edits for the create composer (PBI-022). Pure and framework-free so it can be
// unit-tested without a DOM: given the textarea's value and selection, each action returns
// the new value plus where the selection should land. The MarkdownEditor leaf does the DOM
// part (read selection, write value, restore selection).
//
// This is a deliberate non-choice of a WYSIWYG editor: the audience is on a mid-range
// Android phone on mobile data (AGENTS.md), so the body is plain markdown a textarea can
// hold, not a ProseMirror/Lexical document.

export type MarkdownAction =
  | "inline-code"
  | "code-block"
  | "bullet-list"
  | "ordered-list"
  | "quote";

export type MarkdownResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

// Prefix each line spanning the selection — for the list and quote actions.
function prefixLines(
  value: string,
  start: number,
  end: number,
  prefix: (index: number) => string,
): MarkdownResult {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const after = value.indexOf("\n", end);
  const lineEnd = after === -1 ? value.length : after;

  const block = value.slice(lineStart, lineEnd);
  const rewritten = block
    .split("\n")
    .map((line, index) => prefix(index) + line)
    .join("\n");

  return {
    value: value.slice(0, lineStart) + rewritten + value.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + rewritten.length,
  };
}

// Wrap the selection in a marker on each side — for inline code.
function wrap(
  value: string,
  start: number,
  end: number,
  marker: string,
): MarkdownResult {
  const selected = value.slice(start, end);
  return {
    value: value.slice(0, start) + marker + selected + marker + value.slice(end),
    selectionStart: start + marker.length,
    selectionEnd: end + marker.length,
  };
}

export function applyMarkdown(
  value: string,
  start: number,
  end: number,
  action: MarkdownAction,
): MarkdownResult {
  switch (action) {
    case "inline-code":
      return wrap(value, start, end, "`");

    case "code-block": {
      const selected = value.slice(start, end);
      const before = start === 0 || value[start - 1] === "\n" ? "" : "\n";
      const after = end === value.length || value[end] === "\n" ? "" : "\n";
      const opened = `${before}\`\`\`\n`;
      return {
        value: `${value.slice(0, start)}${opened}${selected}\n\`\`\`${after}${value.slice(end)}`,
        selectionStart: start + opened.length,
        selectionEnd: start + opened.length + selected.length,
      };
    }

    case "bullet-list":
      return prefixLines(value, start, end, () => "- ");

    case "ordered-list":
      return prefixLines(value, start, end, (index) => `${index + 1}. `);

    case "quote":
      return prefixLines(value, start, end, () => "> ");
  }
}
