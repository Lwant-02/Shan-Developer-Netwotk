#!/usr/bin/env node
// PBI id helper. Resolves ids from every git ref, not just the working tree, so a
// PBI created on someone else's branch doesn't get a colliding id.
//
//   node scripts/pbi.mjs next [--fetch]  -> next free id, zero-padded (e.g. 014)
//   node scripts/pbi.mjs current         -> id from the current git branch, if any
//   node scripts/pbi.mjs list [status]   -> working-tree PBIs, optionally filtered
//   node scripts/pbi.mjs check [--fetch] -> report ids claimed more than once
//
// Sources scanned for `next` and `check`:
//   - the working tree (docs/delivery/backlog.md + docs/delivery/NNN/)
//   - every local branch (refs/heads)
//   - every remote-tracking branch (refs/remotes)
//
// Not detectable, by definition: a PBI created on another machine and never pushed.
// Reserve ids early (push the backlog row) if more than one person is filing PBIs.
//
// Exit codes: 0 ok, 1 usage/parse error, 2 nothing matched, 3 duplicate ids found.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BACKLOG_REL = "docs/delivery/backlog.md";
const BACKLOG = resolve(root, BACKLOG_REL);
const DELIVERY = resolve(root, "docs/delivery");

const ROW = /^\|\s*\[?(\d{3})\]?(?:\([^)]*\))?\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/;

// execFileSync, not execSync: arguments go straight to git with no shell in the
// middle. Format strings like %(refname) contain glob characters that a shell
// mangles — that failure is silent when errors are swallowed.
function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (err) {
    if (allowFail) return null;
    throw err;
  }
}

/** Parse backlog markdown into rows. Skips the status-legend table (no numeric id). */
function parseBacklog(text) {
  const rows = [];
  for (const line of (text ?? "").split("\n")) {
    const m = line.match(ROW);
    if (m) rows.push({ id: m[1], title: m[2], status: m[3] });
  }
  return rows;
}

function workingTreeRows() {
  if (!existsSync(BACKLOG)) return [];
  return parseBacklog(readFileSync(BACKLOG, "utf8"));
}

function workingTreeDirIds() {
  if (!existsSync(DELIVERY)) return [];
  return readdirSync(DELIVERY, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{3}$/.test(d.name))
    .map((d) => d.name);
}

function allRefs() {
  const out = git(["for-each-ref", "--format=%(refname)", "refs/heads", "refs/remotes"], {
    allowFail: true,
  });
  if (!out) return [];
  // Drop symbolic origin/HEAD, which just duplicates another ref.
  return out.split("\n").filter((r) => r && !r.endsWith("/HEAD"));
}

/** Every claimed id, with where it came from, across the working tree and all refs. */
function collectClaims({ fetch = false } = {}) {
  if (fetch) git(["fetch", "--all", "--quiet"], { allowFail: true });

  const claims = new Map(); // id -> [{ source, title, status }]
  const add = (id, source, title, status) => {
    if (!claims.has(id)) claims.set(id, []);
    claims.get(id).push({ source, title, status });
  };

  for (const r of workingTreeRows()) add(r.id, "working tree", r.title, r.status);
  for (const id of workingTreeDirIds()) add(id, "working tree (dir)", "", "");

  for (const ref of allRefs()) {
    const text = git(["show", `${ref}:${BACKLOG_REL}`], { allowFail: true });
    for (const r of parseBacklog(text)) add(r.id, ref, r.title, r.status);

    const tree = git(["ls-tree", "-d", "--name-only", `${ref}:docs/delivery`], {
      allowFail: true,
    });
    if (tree) {
      for (const name of tree.split("\n")) {
        if (/^\d{3}$/.test(name.trim())) add(name.trim(), `${ref} (dir)`, "", "");
      }
    }
  }
  return claims;
}

function next(fetch) {
  const claims = collectClaims({ fetch });
  const ids = [...claims.keys()].map(Number);
  const highest = ids.length ? Math.max(...ids) : 0;
  const id = String(highest + 1).padStart(3, "0");

  const refCount = allRefs().length;
  console.error(
    `Scanned working tree + ${refCount} ref(s); highest claimed id is ` +
      `${String(highest).padStart(3, "0")}.`
  );
  console.error(
    "Unpushed work on another machine cannot be seen — push the backlog row early " +
      "to claim this id."
  );
  return id;
}

function current() {
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], { allowFail: true });
  if (!branch) {
    console.error("Not a git repository.");
    process.exit(1);
  }
  const m = branch.match(/(?:^|\/)(\d{3})(?:-|$)/);
  if (!m) {
    console.error(`No PBI id in branch "${branch}".`);
    process.exit(2);
  }
  return m[1];
}

function list(filter) {
  const rows = workingTreeRows();
  const wanted = filter?.toLowerCase();
  const shown = wanted
    ? rows.filter((r) => r.status.toLowerCase().includes(wanted))
    : rows;
  if (!shown.length) {
    console.error(filter ? `No PBIs with status "${filter}".` : "No PBIs found.");
    process.exit(2);
  }
  return shown.map((r) => `${r.id}  ${r.status.padEnd(12)}  ${r.title}`).join("\n");
}

/** A real collision is the same id used for two different titles. */
function check(fetch) {
  const claims = collectClaims({ fetch });
  const conflicts = [];
  for (const [id, entries] of [...claims].sort()) {
    const titles = new Set(
      entries.map((e) => e.title).filter(Boolean).map((t) => t.toLowerCase())
    );
    if (titles.size > 1) conflicts.push({ id, entries });
  }
  if (!conflicts.length) {
    console.log(`No id collisions across ${claims.size} PBI id(s).`);
    return;
  }
  console.error(`Collision: ${conflicts.length} id(s) claimed for different work.\n`);
  for (const { id, entries } of conflicts) {
    console.error(`  PBI-${id}`);
    for (const e of entries) {
      if (e.title) console.error(`    ${e.source.padEnd(34)} ${e.title}`);
    }
    console.error("");
  }
  process.exit(3);
}

const args = process.argv.slice(2);
const cmd = args[0];
const fetch = args.includes("--fetch");
const positional = args.slice(1).filter((a) => !a.startsWith("--"));

switch (cmd) {
  case "next":
    console.log(next(fetch));
    break;
  case "current":
    console.log(current());
    break;
  case "list":
    console.log(list(positional[0]));
    break;
  case "check":
    check(fetch);
    break;
  default:
    console.error(
      "Usage: node scripts/pbi.mjs <next|current|list|check> [--fetch]\n" +
        "  next     next free id, scanning all local and remote refs\n" +
        "  current  PBI id from the current git branch\n" +
        "  list     working-tree PBIs, optionally filtered by status\n" +
        "  check    report ids claimed for two different things\n" +
        "  --fetch  refresh remote refs first (next, check)"
    );
    process.exit(1);
}
