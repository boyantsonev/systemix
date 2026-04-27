"use strict";

const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * npx systemix tokens
 *
 * Converts src/app/globals.css oklch variables → .systemix/tokens.bridge.json
 * Delegates to the project's `npm run tokens` script, or spawns tsx directly
 * if the project doesn't have the script wired up.
 */
async function tokens(args) {
  const projectRoot = process.cwd();
  const scriptPath = path.join(projectRoot, "scripts/token-converter.ts");

  // Check if the project has a `tokens` npm script
  let pkgJson = {};
  try {
    pkgJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  } catch { /* ignore */ }

  const hasNpmScript = pkgJson.scripts && pkgJson.scripts.tokens;
  const hasScript = fs.existsSync(scriptPath);

  if (!hasNpmScript && !hasScript) {
    console.error(
      "\n  ✗  No token converter found in this project.\n" +
      "     Expected: scripts/token-converter.ts  OR  \"tokens\" in package.json scripts\n" +
      "     Is this a Systemix project? Run `npx systemix init` first.\n"
    );
    process.exit(1);
  }

  console.log("  Running token converter...\n");

  let result;
  if (hasNpmScript) {
    result = spawnSync("npm", ["run", "tokens"], { stdio: "inherit", cwd: projectRoot });
  } else {
    result = spawnSync("npx", ["tsx", scriptPath], { stdio: "inherit", cwd: projectRoot });
  }

  if (result.status !== 0) {
    console.error("\n  ✗  Token converter failed.\n");
    process.exit(result.status ?? 1);
  }
}

module.exports = { tokens };
