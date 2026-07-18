#!/usr/bin/env node
// Generates a translation brief for a capable, web-searching agent (e.g. Gemini) to
// fill in the Shan (`shn`) message strings. It never translates anything itself — it
// only finds what is missing and writes precise instructions, including what NOT to
// do, so the agent can't quietly invent Shan that no Shan speaker would recognise.
//
//   node scripts/i18n-prompt.mjs            -> brief for en -> shn, to stdout
//   node scripts/i18n-prompt.mjs --from en --to shn
//
// A value counts as untranslated when it is missing, equals the English source, or
// starts with the `TODO(shn):` marker this repo uses for a placeholder. Exit code 0
// with a brief, 0 with a "nothing to do" note when shn is complete, 1 on error.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES = join(ROOT, "messages");
const PLACEHOLDER = "TODO(shn):";

function parseArgs(argv) {
  const opts = { from: "en", to: "shn" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--from") opts.from = argv[++i];
    else if (argv[i] === "--to") opts.to = argv[++i];
    else {
      console.error(`Unknown argument: ${argv[i]}`);
      process.exit(1);
    }
  }
  return opts;
}

function loadMessages(locale) {
  const file = join(MESSAGES, `${locale}.json`);
  if (!existsSync(file)) {
    console.error(`No message file for "${locale}" at ${file}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(file, "utf8"));
}

// messages nest (NotFound.title), so compare on flattened dot-paths.
function flatten(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(out, flatten(value, path));
    } else {
      out[path] = value;
    }
  }
  return out;
}

function isUntranslated(target, source) {
  if (target === undefined) return true;
  if (typeof target !== "string") return false;
  return target === source || target.startsWith(PLACEHOLDER);
}

// ICU placeholders ({name}, {count, plural, ...}) must survive translation verbatim.
function placeholdersIn(text) {
  return typeof text === "string" ? [...text.matchAll(/\{[^}]+\}/g)].map((m) => m[0]) : [];
}

function main() {
  const { from, to } = parseArgs(process.argv.slice(2));
  const source = flatten(loadMessages(from));
  const target = flatten(loadMessages(to));

  const pending = Object.entries(source)
    .filter(([path, english]) => isUntranslated(target[path], english))
    .map(([path, english]) => ({ path, english, placeholders: placeholdersIn(english) }));

  const extra = Object.keys(target).filter((path) => !(path in source));

  if (pending.length === 0) {
    console.error(`messages/${to}.json is complete against ${from}. Nothing to translate.`);
    if (extra.length) console.error(`Note: keys in ${to} but not ${from}: ${extra.join(", ")}`);
    return;
  }

  process.stdout.write(brief({ from, to, pending, extra }));
}

function brief({ from, to, pending, extra }) {
  const rows = pending
    .map((p) => {
      const ph = p.placeholders.length ? `  (keep placeholders exactly: ${p.placeholders.join(" ")})` : "";
      return `- \`${p.path}\`\n    English: ${JSON.stringify(p.english)}${ph}`;
    })
    .join("\n");

  const extraNote = extra.length
    ? `\n## Keys to remove\n\nThese exist in \`messages/${to}.json\` but not \`messages/${from}.json\`. Delete them:\n${extra.map((k) => `- \`${k}\``).join("\n")}\n`
    : "";

  return `# Translation brief — English → Shan (\`${to}\`)

You are translating UI strings for **Shan Developer Network**, a platform for
Shan-speaking developers. You have web search. Use it.

Target language is **Shan** (Tai Long / Tai Yai), ISO 639-3 \`shn\`, written in the
**Shan script** (a Myanmar-block script, U+1000–U+109F plus Shan extensions). It is
**not Burmese** and **not Zawgyi** — Unicode Shan only.

Edit **\`messages/${to}.json\`**. The English source of truth is
**\`messages/${from}.json\`** — match its structure and keys exactly; translate only
the values listed below.

## DO

- **Search before you translate.** For every term, find how Shan speakers actually
  write it: existing Shan software localisations, Shan Wikipedia, the Shan font /
  Shan language community, published glossaries. Prefer an **attested** term over one
  you coin.
- **Keep ICU placeholders verbatim** — \`{name}\`, \`{count}\`, tags. Never translate,
  rename, or reorder them. They are flagged per-string below.
- **Leave established loanwords and proper nouns as they are** when that is how the
  community writes them (product names, well-known technical words). Don't force a
  translation that no one uses.
- **Keep the tone plain and friendly**, written for developers.
- **Use Shan Unicode codepoints only.** No Zawgyi, no Burmese substitutions.
- **Cite a source** for any non-obvious term choice, in the "Notes" section.

## DON'T

- **Don't guess.** If you cannot verify a Shan term is real and correct after
  searching, **do not invent one**.
- **Don't leave a fabricated translation in the file.** For any string you can't
  confidently translate, **keep its current \`${PLACEHOLDER}\` placeholder value
  unchanged** and list it under "Unsure" with what you searched and why you couldn't
  confirm. A left placeholder is a correct outcome; a made-up word is not.
- **Don't machine-translate the whole file in one pass** and hope. Translate
  term by term, verifying each.
- **Don't change keys, nesting, or placeholders**, and don't output Burmese or Zawgyi.

## Strings to translate

${rows}
${extraNote}
## Output

1. The **complete** updated \`messages/${to}.json\` as valid JSON — every existing key
   present, only the values above changed.
2. A **"Notes"** section: sources for non-obvious term choices.
3. An **"Unsure"** section: any key you left as a \`${PLACEHOLDER}\` placeholder, with
   the searches you ran and why you couldn't confirm a translation.
`;
}

main();
