#!/usr/bin/env node
/**
 * smoke-test.js — SYSTMIX-263
 *
 * Verifies the Systemix POC is wired up correctly:
 *   1. CLI entry point loads without errors
 *   2. MCP server dist exists and is executable
 *   3. Root package.json has workspaces + generate-contracts script
 *   4. generate-contracts.ts is present
 *   5. tokens.bridge.json exists (or warns)
 *
 * Usage: node scripts/smoke-test.js
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT  = __dirname.replace(/\/scripts$/, "");
const PASS  = "  ✓ ";
const FAIL  = "  ✗ ";
const WARN  = "  ⚠ ";

let failures = 0;

function check(label, fn) {
  try {
    const result = fn();
    if (result === false) {
      console.log(FAIL + label);
      failures++;
    } else {
      console.log(PASS + label);
    }
  } catch (err) {
    console.log(FAIL + label + "  →  " + err.message);
    failures++;
  }
}

function warn(label, fn) {
  try {
    const result = fn();
    if (result === false) {
      console.log(WARN + label);
    } else {
      console.log(PASS + label);
    }
  } catch {
    console.log(WARN + label + " (skipped)");
  }
}

console.log("\n  systemix smoke tests\n");

// 1. CLI entry point
check("CLI entry point exists", () =>
  fs.existsSync(path.join(ROOT, "packages/cli/bin/cli.js"))
);

check("CLI loads without syntax errors", () => {
  const r = spawnSync(process.execPath, ["--check", path.join(ROOT, "packages/cli/bin/cli.js")], {
    cwd: ROOT,
    timeout: 5000,
  });
  return r.status === 0;
});

// 2. MCP server
check("MCP server dist/index.js exists", () =>
  fs.existsSync(path.join(ROOT, "packages/mcp-server/dist/index.js"))
);

check("MCP server dist/index.js is valid JS", () => {
  const r = spawnSync(process.execPath, ["--check", path.join(ROOT, "packages/mcp-server/dist/index.js")], {
    cwd: ROOT,
    timeout: 5000,
  });
  return r.status === 0;
});

// 3. Root package.json
check("Root package.json has workspaces", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  return Array.isArray(pkg.workspaces) && pkg.workspaces.includes("packages/*");
});

check("Root package.json has generate-contracts script", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  return typeof pkg.scripts?.["generate-contracts"] === "string";
});

check("Root package.json has build:mcp script", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  return typeof pkg.scripts?.["build:mcp"] === "string";
});

// 4. generate-contracts.ts
check("scripts/generate-contracts.ts exists", () =>
  fs.existsSync(path.join(ROOT, "scripts/generate-contracts.ts"))
);

// 5. CLI commands
check("CLI tokens command exists", () =>
  fs.existsSync(path.join(ROOT, "packages/cli/src/commands/tokens.js"))
);

check("CLI init.js has sync-docs in ALL_SKILLS", () => {
  const src = fs.readFileSync(path.join(ROOT, "packages/cli/src/init.js"), "utf8");
  return src.includes('"sync-docs"');
});

check("CLI registrar uses getServerConfig()", () => {
  const src = fs.readFileSync(path.join(ROOT, "packages/cli/src/installers/mcp-server-registrar.js"), "utf8");
  return src.includes("function getServerConfig") && src.includes("process.cwd()");
});

// 6. Optional: tokens.bridge.json
warn("tokens.bridge.json exists (run `npm run tokens` to generate)", () =>
  fs.existsSync(path.join(ROOT, ".systemix/tokens.bridge.json"))
);

// ── Result ──────────────────────────────────────────────────────────────────
console.log();
if (failures === 0) {
  console.log("  All checks passed. Systemix POC is wired up correctly.\n");
} else {
  console.log(`  ${failures} check(s) failed. Review the ✗ items above.\n`);
  process.exit(1);
}
