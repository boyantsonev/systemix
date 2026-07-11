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
const { spawn } = require("child_process");

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

  if (opts.dryRun) return { started: false, serverPath, port, projectRoot };

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
