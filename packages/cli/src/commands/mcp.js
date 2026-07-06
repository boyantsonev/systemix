"use strict";

/**
 * mcp.js — the `systemix mcp` command.
 *
 * The intentional re-register path for the systemix-mcp server. `init` never
 * overwrites an existing registration that points at another project; this is
 * where you opt into that, with `--force`, once you actually mean to repoint it.
 *
 *   systemix mcp register            Register in repo-scoped clients (skips global)
 *   systemix mcp register --global   Also write the global Claude Desktop config
 *   systemix mcp register --force    Overwrite an entry pointing at another project
 *
 * Injectable seams (opts) mirror init.js so tests never touch the real home dir:
 *   opts.detectClients, opts.registerServer, opts.projectRoot
 */

const registrar = require("../installers/mcp-server-registrar");

async function mcp(args = [], opts = {}) {
  const sub = args[0];
  const force  = args.includes("--force");
  const global = args.includes("--global") || args.includes("--global-mcp");
  const detectClients  = opts.detectClients  ?? registrar.detectClients;
  const registerServer = opts.registerServer ?? registrar.registerServer;
  const projectRoot    = opts.projectRoot    ?? process.cwd();

  if (sub !== "register") {
    console.log("\n  Usage: systemix mcp register [--global] [--force]\n");
    console.log("    Register the systemix-mcp server in your MCP client configs.");
    console.log("    Repo-scoped clients only by default; --global also writes the");
    console.log("    global Claude Desktop config; --force repoints an existing entry.\n");
    return;
  }

  const existingClients = detectClients().filter((c) => c.exists);
  const clients = existingClients.filter((c) => global || c.name !== "Claude Desktop");
  const skippedGlobal = !global && existingClients.some((c) => c.name === "Claude Desktop");

  if (clients.length === 0) {
    console.log("\n  ⚠  No MCP client config found to register in.\n");
    return;
  }

  console.log("\n  Registering systemix-mcp...\n");
  for (const client of clients) {
    registerServer(client.configPath, { force, projectRoot });
  }
  if (skippedGlobal) {
    console.log("\n  -  Claude Desktop (global) left untouched. Add --global to include it.");
  }
  console.log();
}

module.exports = { mcp };
