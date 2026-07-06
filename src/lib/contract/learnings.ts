// Reader for experiments/LEARNINGS.md — the earned-memory ledger.
//
// TS port of the canonical parser in packages/cli/src/lib/experiments.js
// (`parseLearnings`). The bullet template is shared byte-identically by three
// writers (CLI appendLearning, MCP appendLearning, app renderMemoryLine in
// memory-mdx.ts); this is the one reader on the app side. Keep the regexes in
// sync with the CLI — the round-trip test against renderMemoryLine guards it.

import fs from "fs";
import path from "path";

export type LearningEntry = {
  date: string | null; // YYYY-MM-DD
  title: string | null;
  confidence: number | null; // "—" (no confidence) parses to null
  experimentId: string | null; // provenance: the experiment that earned it
  decision: string | null; // promote | kill | iterate
  reviewBy: string | null; // YYYY-MM-DD — claims expire
  usedBy: string[]; // experiment ids that cited this learning
  raw: string; // the full bullet, verbatim
};

/**
 * Parse the `## Memory` bullets into structured entries (file order =
 * newest-first). Tolerant of both the CLI format and the skill format (which
 * adds a reason sentence between `decision:` and `Review by:`). A line is an
 * entry iff it's a `-` bullet that cites an experiment (`from [<id>]`).
 */
export function parseLearnings(raw: string): LearningEntry[] {
  if (!raw) return [];
  const lines = raw.split("\n");
  const anchor = lines.findIndex((l) => l.trim() === "## Memory");
  const scope = anchor === -1 ? lines : lines.slice(anchor + 1);
  const entries: LearningEntry[] = [];
  for (const line of scope) {
    const l = line.trim();
    if (!l.startsWith("- ") || !l.includes("from [")) continue;
    const pick = (re: RegExp) => (l.match(re) || [])[1] ?? null;
    const confidenceRaw = pick(/confidence\s+(\S+?)\s*·/);
    const confidence =
      confidenceRaw != null && !Number.isNaN(Number(confidenceRaw))
        ? Number(confidenceRaw)
        : null;
    const usedByRaw = (pick(/Used by:\s*(.+)$/) || "—").trim();
    entries.push({
      date: pick(/\*\*(\d{4}-\d{2}-\d{2})\s*·/),
      title: pick(/·\s*([^*]+?)\s*\*\*/),
      confidence,
      experimentId: pick(/from \[([^\]]+)\]/),
      decision: pick(/decision:\s*([A-Za-z][\w-]*)/),
      reviewBy: pick(/Review by:\s*(\d{4}-\d{2}-\d{2})/),
      usedBy:
        usedByRaw === "—"
          ? []
          : (usedByRaw.match(/\[([^\]]+)\]/g) || []).map((s) => s.slice(1, -1)),
      raw: l,
    });
  }
  return entries;
}

/**
 * Load the ledger from experiments/LEARNINGS.md (in-repo → safe at build time
 * on Vercel). Returns [] when the file is missing or has no entries yet —
 * empty-state-first, honest by construction.
 */
export function loadLearnings(): LearningEntry[] {
  const file = path.join(process.cwd(), "experiments", "LEARNINGS.md");
  if (!fs.existsSync(file)) return [];
  return parseLearnings(fs.readFileSync(file, "utf8"));
}
