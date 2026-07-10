const fs = require("fs");
const path = require("path");

// The design-audit skill is the zero-setup front door. `systemix audit` vendors
// just that one skill into the repo (no full init, no config, no MCP) so the
// engine — Claude Code — can run it. This keeps the landing CTA honest: someone
// runs `npx @getsystemix/cli audit`, gets the skill, and runs `/design-audit`.

const SKILL_SRC = path.join(
  __dirname, "..", "..", "pipelines", "design-system", "skills", "design-audit"
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

/**
 * `systemix audit` — install the zero-setup design-audit skill into this repo.
 * Read-only when run: the audit itself proposes files and writes nothing without
 * approval. This command only vendors the skill.
 */
async function audit() {
  if (!fs.existsSync(SKILL_SRC)) {
    throw new Error("design-audit skill not found in this systemix install.");
  }

  const dest = path.join(SKILLS_DIR, "design-audit");
  copyDir(SKILL_SRC, dest);

  console.log("\n✓ design-audit installed → .claude/skills/design-audit/\n");
  console.log("  Zero setup. Read-only. It infers your de-facto design system,");
  console.log("  flags drift + inconsistent components, and proposes a starter");
  console.log("  design/ — writing nothing without your approval.\n");
  console.log("  Next: open Claude Code in this repo and run\n");
  console.log("    /design-audit            audit the whole repo");
  console.log("    /design-audit src/       scope to a directory\n");
  console.log("  Docs: https://getsystemix.vercel.app/docs/audit\n");
}

module.exports = { audit };
