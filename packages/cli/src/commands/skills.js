"use strict";

// `systemix skills sync` — refresh already-installed loop skills in place from the
// CLI's bundled source of truth (packages/cli/pipelines/<pipeline>/skills/).
//
// The THIRD way skills reach a skills dir, filling a real gap:
//   - `init`          scaffolds a NEW instance (project .claude/skills/)   [ADR-008]
//   - `workflow add`  installs a pipeline INTO a project (project scope)
//   - `skills sync`   updates an EXISTING set in place — and is the only one
//                     that can target the USER-GLOBAL ~/.claude/skills/ (--global),
//                     which init/add never touch.
//
// Idempotent: reports each skill as created / updated / in-sync by content, and
// --dry-run previews without writing.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { parseVersion } = require("../skills-fetcher");

const DEFAULT_PIPELINE = "hypothesis-validation"; // the loop — what `init` always installs
const BUNDLED_PIPELINES_DIR = path.join(__dirname, "..", "..", "pipelines");

const SKILLS_HELP = `
  systemix skills — manage installed Claude Code skills

  Usage:
    systemix skills sync [--global] [--pipeline <name>] [--dry-run]

  Sync copies the CLI's bundled loop skills into a skills dir, overwriting drifted
  copies and adding missing ones (existing unrelated skills are left untouched).

    --global            Target ~/.claude/skills/ (default: <cwd>/.claude/skills/)
    --pipeline <name>   Which bundled pipeline's skills to sync (default: ${DEFAULT_PIPELINE})
    --dry-run           Show what would change without writing
`;

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = args[i + 1];
    if (next === undefined || next.startsWith("--")) flags[key] = true;
    else { flags[key] = next; i++; }
  }
  return flags;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

/** Classify a skill's dest SKILL.md against the bundled source (by content). */
function skillState(srcFile, destFile) {
  if (!fs.existsSync(destFile)) return { state: "create", to: parseVersion(fs.readFileSync(srcFile, "utf8")) };
  const srcTxt = fs.readFileSync(srcFile, "utf8");
  const destTxt = fs.readFileSync(destFile, "utf8");
  if (srcTxt === destTxt) return { state: "in-sync", to: parseVersion(srcTxt) };
  return { state: "update", from: parseVersion(destTxt), to: parseVersion(srcTxt) };
}

/**
 * Sync one pipeline's bundled skills into the target skills dir.
 * Injectable seams (opts.pipelinesDir / homeDir / projectRoot / skillsDir) keep it
 * testable and let callers (e.g. `update`) target a pre-resolved skills dir.
 * Returns { skillsDir, pipeline, dryRun, results:[{skill,state,from?,to?}] }.
 */
function syncSkills(flags, opts = {}) {
  const pipelinesDir = opts.pipelinesDir ?? BUNDLED_PIPELINES_DIR;
  const home = opts.homeDir ?? os.homedir();
  const cwd = opts.projectRoot ?? process.cwd();
  const pipeline = typeof flags.pipeline === "string" ? flags.pipeline : DEFAULT_PIPELINE;
  const dryRun = !!flags["dry-run"];
  // opts.skillsDir wins (caller already resolved a target); otherwise flags.global
  // picks ~/.claude/skills vs <cwd>/.claude/skills.
  const skillsDir = opts.skillsDir ?? path.join(flags.global ? home : cwd, ".claude", "skills");

  const manifestPath = path.join(pipelinesDir, pipeline, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`pipeline not found: ${pipeline} (no manifest at ${manifestPath})`);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const skillsSrc = path.join(pipelinesDir, pipeline, "skills");

  const results = [];
  for (const skill of manifest.skills || []) {
    const srcDir = path.join(skillsSrc, skill);
    const srcFile = path.join(srcDir, "SKILL.md");
    if (!fs.existsSync(srcFile)) { results.push({ skill, state: "missing-src" }); continue; }
    const st = skillState(srcFile, path.join(skillsDir, skill, "SKILL.md"));
    if (!dryRun && st.state !== "in-sync") copyDir(srcDir, path.join(skillsDir, skill));
    results.push({ skill, ...st });
  }
  return { skillsDir, pipeline, dryRun, results };
}

function report({ skillsDir, pipeline, dryRun, results }) {
  const verb = dryRun ? "would sync" : "syncing";
  console.log(`\n  ${verb} ${pipeline} skills → ${skillsDir}\n`);
  const label = { create: "＋ new", update: "↻ updated", "in-sync": "✓ in-sync", "missing-src": "⚠ no source" };
  for (const r of results) {
    const ver = r.state === "update" ? `  ${r.from} → ${r.to}` : r.to ? `  ${r.to}` : "";
    console.log(`  ${(label[r.state] || r.state).padEnd(11)} ${r.skill.padEnd(18)}${ver}`);
  }
  const changed = results.filter((r) => r.state === "create" || r.state === "update").length;
  console.log(
    dryRun
      ? `\n  ${changed} would change. Re-run without --dry-run to apply.\n`
      : `\n  ✓ ${changed} synced, ${results.length - changed} already current.\n`
  );
}

async function skills(args = [], opts = {}) {
  const [sub, ...rest] = args;
  const flags = parseFlags(rest);
  switch (sub) {
    case "sync": {
      const result = syncSkills(flags, opts);
      report(result);
      return result;
    }
    case undefined:
    case "help":
      console.log(SKILLS_HELP);
      break;
    default:
      console.log(`\n  Unknown skills subcommand: ${sub}`);
      console.log(SKILLS_HELP);
      process.exitCode = 1;
  }
}

module.exports = { skills, syncSkills, skillState, SKILLS_HELP };
