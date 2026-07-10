const fs = require("fs");
const path = require("path");

// `systemix design` — read the design system + the HITL feed from the CLI door,
// and vendor the greenfield interview skill. The MCP door exposes the same via
// design_get / design_list_proposals; the skill door is /design-audit + /design-interview.
// File-first: reads design/ and .systemix/queue.json.

const DESIGN_DIR = path.join(process.cwd(), "design");
const QUEUE_FILE = path.join(process.cwd(), ".systemix", "queue.json");
const INTERVIEW_SRC = path.join(
  __dirname, "..", "..", "pipelines", "design-system", "skills", "design-interview"
);
const SKILLS_DIR = path.join(process.cwd(), ".claude", "skills");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function readTokens(cssPath) {
  if (!fs.existsSync(cssPath)) return [];
  const css = fs.readFileSync(cssPath, "utf8");
  const root = css.match(/:root\s*\{([\s\S]*?)\}/);
  const block = root ? root[1] : css;
  const out = [];
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(block)) !== null) out.push({ name: m[1].trim(), value: m[2].trim() });
  return out;
}

function readGuardrailGroups(mdPath) {
  if (!fs.existsSync(mdPath)) return [];
  return fs.readFileSync(mdPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.startsWith("## "))
    .map((l) => l.replace(/^##\s+/, "").trim());
}

function readProposals(status) {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  let parsed;
  try { parsed = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8")); } catch { return []; }
  const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
  return cards
    .filter((c) => c.type === "design-proposal")
    .filter((c) => !status || c.status === status);
}

// ── systemix design (show) ────────────────────────────────────────────────────

function show() {
  if (!fs.existsSync(DESIGN_DIR)) {
    console.log("\n  No design system yet.\n");
    console.log("  → existing repo:  npx @systemix/cli audit    (then /design-audit)");
    console.log("  → from scratch:   npx @systemix/cli design init  (then /design-interview)\n");
    return;
  }

  const groups = readGuardrailGroups(path.join(DESIGN_DIR, "guardrails.mdx"));
  const tokens = readTokens(path.join(DESIGN_DIR, "tokens.css"));
  const pending = readProposals("pending");

  console.log("\n  Design system  (design/)\n");
  console.log(`  Tokens:      ${tokens.length}  (design/tokens.css)`);
  console.log(`  Guardrails:  ${groups.length} rule groups  (design/guardrails.mdx)`);
  if (groups.length) console.log(`               ${groups.join(" · ")}`);
  console.log(`  Proposals:   ${pending.length} pending in the HITL feed\n`);
  console.log("  Digest it elsewhere:  systemix design feed  ·  MCP design_get / design_list_proposals\n");
}

// ── systemix design feed ──────────────────────────────────────────────────────

function feed(args) {
  const status = args.find((a) => !a.startsWith("-")) || "pending";
  const cards = readProposals(status);

  if (cards.length === 0) {
    console.log(`\n  No design proposals with status '${status}'.\n`);
    return;
  }

  console.log(`\n  Design proposals — ${status}  (.systemix/queue.json)\n`);
  for (const c of cards) {
    console.log(`  ❖ ${c.filePath || "design/"}`);
    if (c.proposed) console.log(`    ${c.proposed}`);
    if (c.context) console.log(`    ${c.context}`);
    console.log(`    id: ${c.id}\n`);
  }
  console.log("  Resolve in the dashboard (/config) or with the MCP hitl tools.\n");
}

// ── systemix design init ──────────────────────────────────────────────────────

function init() {
  if (!fs.existsSync(INTERVIEW_SRC)) {
    throw new Error("design-interview skill not found in this systemix install.");
  }
  copyDir(INTERVIEW_SRC, path.join(SKILLS_DIR, "design-interview"));
  console.log("\n✓ design-interview installed → .claude/skills/design-interview/\n");
  console.log("  A short interview — your product, your people, the associations behind");
  console.log("  your palette — then it drafts design/ in your voice. Every draft is");
  console.log("  proposed for approval; nothing is written until you say yes.\n");
  console.log("  Next: open Claude Code in this repo and run\n");
  console.log("    /design-interview\n");
  console.log("  Already have UI? Use `npx @systemix/cli audit` instead.\n");
}

async function design(args) {
  const sub = args[0];
  switch (sub) {
    case undefined:
    case "show":
      show();
      break;
    case "feed":
      feed(args.slice(1));
      break;
    case "init":
      init();
      break;
    default:
      console.error(`\n  Unknown: systemix design ${sub}\n`);
      console.log("  Usage: systemix design [show|feed|init]\n");
      process.exit(1);
  }
}

module.exports = { design };
