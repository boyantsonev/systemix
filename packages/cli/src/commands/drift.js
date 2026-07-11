/**
 * drift.js — `systemix drift <sub>`
 *
 * The sacred-timeline substrate: deterministic drift snapshots any instance
 * can accumulate (no LLM — the /drift-report skill remains the deep audit).
 *
 *   systemix drift scan [--dirs a,b] [--triggered-by ci]   scan + append a snapshot
 *   systemix drift history [--last 10]                     print recent snapshots
 *
 * Snapshot shape matches .systemix/drift-history.json as read by the local
 * app and the POC dashboard: { runAt, triggeredBy, score, critical, warnings,
 * componentsAudited, topOffenders[] } — rolling window of 90.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const MAX_SNAPSHOTS = 90;
const DEFAULT_DIRS = ["src", "app", "components", "lib", "packages"];
const EXCLUDE_DIRS = new Set([
  "node_modules", "dist", "build", "out", "coverage", "vendor", "reference",
  ".next", ".expo", ".git", ".systemix", "generated",
]);
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".vue", ".svelte"]);

// critical: raw color literals · warnings: raw px values
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const COLOR_FN_RE = /\b(?:rgba?|hsla?|oklch)\(/g;
const PX_RE = /\b\d+px\b/g;

function listFiles(root, dirs) {
  const files = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (!EXCLUDE_DIRS.has(e.name) && !e.name.startsWith(".")) walk(path.join(dir, e.name));
      } else if (EXTS.has(path.extname(e.name)) && !/\.generated\./.test(e.name)) {
        files.push(path.join(dir, e.name));
      }
    }
  };
  for (const d of dirs) {
    const abs = path.join(root, d);
    if (fs.existsSync(abs)) walk(abs);
  }
  return files;
}

function scanProject(root, dirs) {
  const files = listFiles(root, dirs);
  let critical = 0;
  let warnings = 0;
  const perFile = [];
  const tokensCss = path.join(root, "design", "tokens.css");
  for (const file of files) {
    if (path.resolve(file) === path.resolve(tokensCss)) continue; // canonical source is exempt
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const c = (text.match(HEX_RE) ?? []).length + (text.match(COLOR_FN_RE) ?? []).length;
    const w = (text.match(PX_RE) ?? []).length;
    if (c || w) perFile.push({ file: path.relative(root, file), c, w });
    critical += c;
    warnings += w;
  }
  perFile.sort((a, b) => b.c + b.w - (a.c + a.w));
  const score = Math.max(0, Math.round(100 - critical * 2 - warnings * 0.5));
  return {
    score,
    critical,
    warnings,
    componentsAudited: files.length,
    topOffenders: perFile.slice(0, 5).map((f) => f.file),
  };
}

function historyPath(root) {
  return path.join(root, ".systemix", "drift-history.json");
}

function readHistory(root) {
  try {
    const raw = JSON.parse(fs.readFileSync(historyPath(root), "utf8"));
    return Array.isArray(raw) ? { snapshots: raw } : { snapshots: raw.snapshots ?? [] };
  } catch {
    return { snapshots: [] };
  }
}

function appendSnapshot(root, snapshot) {
  const data = readHistory(root);
  data.snapshots.push(snapshot);
  if (data.snapshots.length > MAX_SNAPSHOTS) data.snapshots = data.snapshots.slice(-MAX_SNAPSHOTS);
  const file = historyPath(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n");
  fs.renameSync(tmp, file);
  return data.snapshots.length;
}

function argOf(args, name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

async function drift(args = [], opts = {}) {
  const root = opts.projectRoot ?? process.cwd();
  const sub = args[0];

  if (sub === "scan") {
    const dirs = argOf(args, "--dirs", null)?.split(",").map((s) => s.trim()).filter(Boolean) ?? DEFAULT_DIRS;
    const result = scanProject(root, dirs);
    const snapshot = {
      runAt: (opts.now ?? new Date()).toISOString(),
      triggeredBy: argOf(args, "--triggered-by", "cli"),
      ...result,
    };
    const total = appendSnapshot(root, snapshot);
    console.log(`\n  ✓  drift snapshot #${total} — score ${snapshot.score} (${snapshot.critical} critical, ${snapshot.warnings} warnings across ${snapshot.componentsAudited} files)`);
    if (snapshot.topOffenders.length) {
      console.log("     top offenders:");
      for (const f of snapshot.topOffenders) console.log(`       - ${f}`);
    }
    console.log("     view the timeline: npx @getsystemix/cli app → Timeline\n");
    return snapshot;
  }

  if (sub === "history") {
    const last = Number(argOf(args, "--last", 10));
    const { snapshots } = readHistory(root);
    if (!snapshots.length) {
      console.log("\n  -  no drift history yet — run: npx @getsystemix/cli drift scan\n");
      return [];
    }
    console.log();
    for (const s of snapshots.slice(-last)) {
      console.log(`  ${s.runAt}  score ${String(s.score).padStart(3)}  critical ${s.critical}  warnings ${s.warnings}  (${s.triggeredBy})`);
    }
    console.log();
    return snapshots.slice(-last);
  }

  console.log("\n  Usage: npx @getsystemix/cli drift scan [--dirs src,app] [--triggered-by ci]");
  console.log("         npx @getsystemix/cli drift history [--last 10]\n");
  return null;
}

module.exports = { drift, scanProject, appendSnapshot, readHistory };
