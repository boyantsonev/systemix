/**
 * drift-report.ts — the code-first drift audit (the "Drift Report" skill).
 *
 * Scans src/ for places where design and code split:
 *   CRITICAL  raw hex colors in components/styles (should reference a token)
 *   WARNING   raw oklch() outside globals.css
 *   WARNING   raw Tailwind palette classes (text-blue-500, bg-emerald-400, …)
 *             — the TVA system is warm/semantic-only (design/ guardrails)
 *
 * Appends a DriftSnapshot to .systemix/drift-history.json (same shape and
 * 90-entry rolling cap as src/lib/state/drift-history.ts — kept self-contained
 * so `npx tsx scripts/drift-report.ts` needs no path-alias resolution) and
 * prints a human summary. Exit code 0 always: drift is a report, not a gate.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const HISTORY_PATH = path.join(ROOT, ".systemix", "drift-history.json");
const MAX_SNAPSHOTS = 90;

// Files where raw values are the point (token source, mockups, brand marks).
const EXCLUDE = [
  /src[\/\\]app[\/\\]globals\.css$/,
  /DeepDiveMockups\.tsx$/,
  /brand-nodes\.tsx$/,
  /\.test\.(ts|tsx)$/,
  /\.d\.ts$/,
];

const HEX_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const OKLCH_RE = /oklch\([^)]*\)/g;
// Raw Tailwind palette classes — semantic tokens (bg-primary, text-success, …)
// are the contract; palette classes bypass it (and reintroduce cool hues).
const PALETTE_RE =
  /\b(?:text|bg|border|ring|from|to|via|fill|stroke|divide|outline|decoration|accent|caret|shadow)-(?:blue|indigo|violet|purple|cyan|sky|teal|emerald|green|rose|pink|fuchsia|red|orange|amber|yellow|lime|slate|gray|zinc|neutral|stone)-\d{2,3}(?:\/\d{1,3})?\b/g;

type FileHits = { file: string; critical: number; warnings: number; samples: string[] };

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      walk(p, out);
    } else if (/\.(tsx|ts|css)$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

function audit(): { hits: FileHits[]; filesAudited: number } {
  const files = walk(SRC).filter((f) => !EXCLUDE.some((re) => re.test(f)));
  const hits: FileHits[] = [];

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const hex = text.match(HEX_RE) ?? [];
    const oklch = text.match(OKLCH_RE) ?? [];
    const palette = text.match(PALETTE_RE) ?? [];

    const critical = hex.length;
    const warnings = oklch.length + palette.length;
    if (critical + warnings > 0) {
      hits.push({
        file: path.relative(ROOT, file),
        critical,
        warnings,
        samples: [...new Set([...hex, ...palette, ...oklch])].slice(0, 4),
      });
    }
  }
  return { hits, filesAudited: files.length };
}

function appendSnapshot(snapshot: Record<string, unknown>) {
  let history: { snapshots: Record<string, unknown>[] } = { snapshots: [] };
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
  } catch {
    /* first run */
  }
  history.snapshots.push(snapshot);
  if (history.snapshots.length > MAX_SNAPSHOTS) {
    history.snapshots = history.snapshots.slice(history.snapshots.length - MAX_SNAPSHOTS);
  }
  fs.mkdirSync(path.dirname(HISTORY_PATH), { recursive: true });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), "utf8");
}

const { hits, filesAudited } = audit();
const critical = hits.reduce((n, h) => n + h.critical, 0);
const warnings = hits.reduce((n, h) => n + h.warnings, 0);
const score = Math.max(0, 100 - critical * 4 - warnings);
const topOffenders = [...hits]
  .sort((a, b) => b.critical * 4 + b.warnings - (a.critical * 4 + a.warnings))
  .slice(0, 5)
  .map((h) => h.file);

appendSnapshot({
  runAt: new Date().toISOString(),
  triggeredBy: process.env.DRIFT_TRIGGER ?? "manual",
  score,
  critical,
  warnings,
  componentsAudited: filesAudited,
  topOffenders,
});

console.log(`drift-report · ${filesAudited} files audited`);
console.log(`score ${score}/100 · ${critical} critical (raw hex) · ${warnings} warnings (palette/oklch)`);
for (const h of hits.slice(0, 10)) {
  console.log(`  ${h.critical > 0 ? "✗" : "!"} ${h.file} — ${h.critical} critical, ${h.warnings} warn · ${h.samples.join(" ")}`);
}
if (hits.length > 10) console.log(`  … and ${hits.length - 10} more files`);
console.log(`snapshot appended → .systemix/drift-history.json (score ${score})`);
