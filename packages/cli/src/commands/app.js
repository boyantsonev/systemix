/**
 * app.js — `systemix app`
 *
 * Launches the per-instance local app (@getsystemix/app): the design system
 * as contextual infrastructure — docs with human/machine views, tokens,
 * experiments, and the HITL queue, served over THIS repo's files. The app is
 * a viewer + HITL actuator over the same files the skills/CLI/MCP use.
 *
 *   npx @getsystemix/cli app [--port 4400] [--open] [--project-root <dir>]
 */

"use strict";

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

/**
 * Resolve a human label for the instance at `root` so `systemix app` announces
 * WHICH instance it's serving before the browser opens (the design system's
 * name, not the folder). Precedence: design/DESIGN.md frontmatter name →
 * systemix.config.yaml instance/name → the directory basename.
 * `isInstance` is false when there's no systemix.config.yaml — a strong hint
 * the folder was never `init`-ed (so the user pointed at the wrong place).
 */
function resolveInstance(root) {
  const read = (p) => {
    try {
      return fs.readFileSync(path.join(root, p), "utf8");
    } catch {
      return null;
    }
  };
  const field = (text, key) => {
    if (!text) return null;
    const m = text.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
    return m ? m[1].replace(/^["']|["']$/g, "") : null;
  };
  const config = read("systemix.config.yaml");
  const design = read(path.join("design", "DESIGN.md"));
  const name =
    field(design, "name") ||
    field(config, "instance") ||
    field(config, "name") ||
    path.basename(root);
  return { name, isInstance: config != null };
}

function resolveAppServer() {
  try {
    return require.resolve("@getsystemix/app/server/index.js");
  } catch {
    // Monorepo dev fallback — __dirname is packages/cli/src/commands/
    try {
      return require.resolve(path.resolve(__dirname, "../../../app/server/index.js"));
    } catch {
      return null;
    }
  }
}

function argOf(args, name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

async function app(args = [], opts = {}) {
  const serverPath = opts.resolveServer ? opts.resolveServer() : resolveAppServer();
  if (!serverPath) {
    console.error("\n  ✗ @getsystemix/app is not installed.\n");
    console.log("    Install it in this repo:  npm i -D @getsystemix/app");
    console.log("    Then run:                 npx @getsystemix/cli app\n");
    process.exitCode = 1;
    return { started: false };
  }

  const port = argOf(args, "--port", "4400");
  const projectRoot = path.resolve(argOf(args, "--project-root", process.cwd()));
  const url = `http://localhost:${port}`;
  const instance = resolveInstance(projectRoot);

  if (opts.dryRun) return { started: false, serverPath, port, projectRoot, instance };

  // Announce WHICH instance is being served — the #1 source of confusion is a
  // server pointed at the wrong folder (the header shows it too, but say it up front).
  console.log(`\n  Serving  ${instance.name}  ·  ${projectRoot}`);
  if (!instance.isInstance) {
    console.log(
      "  ⚠ no systemix.config.yaml here — this folder isn't a systemix instance.\n" +
        "    Run from inside an init-ed repo, or pass --project-root <dir>."
    );
  }
  console.log(`  ${url}\n`);

  const child = spawn(
    process.execPath,
    [serverPath, "--project-root", projectRoot, "--port", String(port)],
    { stdio: "inherit" }
  );

  if (args.includes("--open")) {
    const opener =
      process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    setTimeout(() => {
      try {
        spawn(opener, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" });
      } catch {
        /* opening the browser is best-effort */
      }
    }, 400);
  }

  await new Promise((resolve) => child.on("exit", resolve));
  return { started: true, serverPath, port, projectRoot };
}

module.exports = { app, resolveAppServer };
