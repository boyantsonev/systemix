"use strict";

/**
 * Acceptance tests — systemix-mcp registration safety
 *
 * Regression guard for the observed failure: running `systemix init` in a
 * scratch/test directory silently repointed an existing GLOBAL systemix-mcp
 * registration (Claude Desktop) at the scratch dir. Deleting the scratch dir
 * then left the global entry dangling.
 *
 * Two seams keep every write inside tmp dirs (never the real home):
 *   - registerServer(configPath, opts) — configPath is a tmp file
 *   - init({ detectClients, projectRoot, homeDir, ... }) — fake client detection
 *
 * AC coverage:
 *   AC-R1  Fresh config → systemix-mcp registered with the right --project-root
 *   AC-R2  Same --project-root already present → idempotent skip, file unchanged
 *   AC-R3  DIFFERENT --project-root present → left unchanged + warning w/ existing root
 *   AC-R4  DIFFERENT root + force → overwritten to the new project root
 *   AC-I1  init leaves an existing global (Claude Desktop) entry untouched by default,
 *          registers the repo-scoped client instead
 *   AC-I2  init --global-mcp on a DIFFERENT-root global still won't overwrite (guard)
 *   AC-I3  init --global-mcp --force-mcp repoints the global entry
 */

const fs   = require("fs");
const os   = require("os");
const path = require("path");

const registrar = require("../../../src/installers/mcp-server-registrar");
const { init }  = require("../../../src/init");

// ── Helpers ───────────────────────────────────────────────────────────────────

function tmpDir(tag) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `systemix-mcp-${tag}-`));
}

/** Write a claude_desktop_config-shaped file with a systemix-mcp entry pointing at `root`. */
function writeConfigWithEntry(configPath, root) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(
    configPath,
    JSON.stringify(
      { mcpServers: { "systemix-mcp": { command: "node", args: ["/some/index.js", "--project-root", root] } } },
      null,
      2
    ),
    "utf8"
  );
}

function readEntryRoot(configPath) {
  const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return registrar.projectRootOf(cfg.mcpServers["systemix-mcp"]);
}

/** Capture console.log for the duration of `fn`. Returns the joined output. */
async function captureLog(fn) {
  const lines = [];
  const orig  = console.log;
  console.log = (...a) => lines.push(a.join(" "));
  try { await fn(); } finally { console.log = orig; }
  return lines.join("\n");
}

function makePrompt(answers) {
  const queue = [...answers];
  return { ask: () => Promise.resolve(queue.shift() ?? ""), close: () => {} };
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("systemix-mcp registration — must not silently rewrite an existing entry", () => {
  const cleanups = [];
  const mkTmp = (tag) => { const d = tmpDir(tag); cleanups.push(d); return d; };

  afterEach(() => {
    while (cleanups.length) fs.rmSync(cleanups.pop(), { recursive: true, force: true });
  });

  // ── AC-R1 ──────────────────────────────────────────────────────────────────
  it("AC-R1: registers systemix-mcp in a fresh config with the given --project-root", async () => {
    const dir  = mkTmp("fresh");
    const cfg  = path.join(dir, "claude_desktop_config.json");
    const root = "/Users/me/projects/systemix-poc";

    const out = await captureLog(() => registrar.registerServer(cfg, { projectRoot: root }));

    expect(readEntryRoot(cfg)).toBe(root);
    expect(out).toContain("✓ Registered");
  });

  // ── AC-R2 ──────────────────────────────────────────────────────────────────
  it("AC-R2: same --project-root already registered → idempotent skip, file byte-identical", async () => {
    const dir  = mkTmp("same");
    const cfg  = path.join(dir, "claude_desktop_config.json");
    const root = "/Users/me/projects/systemix-poc";
    writeConfigWithEntry(cfg, root);
    const before = fs.readFileSync(cfg, "utf8");

    const out = await captureLog(() => registrar.registerServer(cfg, { projectRoot: root }));

    expect(fs.readFileSync(cfg, "utf8")).toBe(before);       // untouched
    expect(out).toContain("already registered");
    expect(out).toContain("skipped");
  });

  // ── AC-R3 ──────────────────────────────────────────────────────────────────
  it("AC-R3: DIFFERENT --project-root → left unchanged, warns with the existing root and the force command", async () => {
    const dir     = mkTmp("diff");
    const cfg     = path.join(dir, "claude_desktop_config.json");
    const oldRoot = "/Users/me/projects/systemix-poc";
    const scratch = "/tmp/scratch-test-dir";
    writeConfigWithEntry(cfg, oldRoot);

    const out = await captureLog(() => registrar.registerServer(cfg, { projectRoot: scratch }));

    // Existing registration preserved — NOT repointed at the scratch dir
    expect(readEntryRoot(cfg)).toBe(oldRoot);
    expect(out).toContain(oldRoot);
    expect(out).toContain("left unchanged");
    expect(out).toContain("systemix mcp register --force");
  });

  // ── AC-R4 ──────────────────────────────────────────────────────────────────
  it("AC-R4: DIFFERENT root + force → overwritten to the new project root", async () => {
    const dir     = mkTmp("force");
    const cfg     = path.join(dir, "claude_desktop_config.json");
    const oldRoot = "/Users/me/projects/systemix-poc";
    const newRoot = "/Users/me/projects/other";
    writeConfigWithEntry(cfg, oldRoot);

    const out = await captureLog(() => registrar.registerServer(cfg, { projectRoot: newRoot, force: true }));

    expect(readEntryRoot(cfg)).toBe(newRoot);
    expect(out).toContain("Re-registered");
  });

  // ── AC-I1: the end-to-end regression ────────────────────────────────────────
  it("AC-I1: init leaves an existing global (Claude Desktop) entry untouched by default and registers the repo-scoped client", async () => {
    const projectRoot = mkTmp("proj");
    const homeDir     = mkTmp("home");
    const desktopCfg  = path.join(mkTmp("desktop"), "claude_desktop_config.json");
    const codeCfg     = path.join(mkTmp("code"), ".claude.json");
    const otherRoot   = "/Users/me/projects/systemix-poc";
    writeConfigWithEntry(desktopCfg, otherRoot);  // pre-existing GLOBAL registration

    const detectClients = () => [
      { name: "Claude Desktop", configPath: desktopCfg, exists: true },
      { name: "Claude Code",    configPath: codeCfg,    exists: true },
    ];

    const out = await captureLog(() =>
      init({
        projectRoot,
        homeDir,
        prompt: makePrompt(["", "", "", "", "", ""]),
        detectClients,
        // real registerServer — this is what we're guarding
      })
    );

    // Global entry still points at the original project — NOT the scratch projectRoot
    expect(readEntryRoot(desktopCfg)).toBe(otherRoot);
    // Repo-scoped Claude Code got the registration at the new project root
    expect(readEntryRoot(codeCfg)).toBe(projectRoot);
    expect(out).toContain("Claude Desktop (global) left untouched");
  });

  // ── AC-I2 ──────────────────────────────────────────────────────────────────
  it("AC-I2: init --global-mcp on a DIFFERENT-root global still refuses to overwrite (guard holds)", async () => {
    const projectRoot = mkTmp("proj");
    const homeDir     = mkTmp("home");
    const desktopCfg  = path.join(mkTmp("desktop"), "claude_desktop_config.json");
    const otherRoot   = "/Users/me/projects/systemix-poc";
    writeConfigWithEntry(desktopCfg, otherRoot);

    const detectClients = () => [
      { name: "Claude Desktop", configPath: desktopCfg, exists: true },
    ];

    const out = await captureLog(() =>
      init({
        projectRoot,
        homeDir,
        prompt: makePrompt(["", "", "", "", "", ""]),
        detectClients,
        globalMcp: true,
      })
    );

    expect(readEntryRoot(desktopCfg)).toBe(otherRoot);   // still guarded
    expect(out).toContain("left unchanged");
  });

  // ── AC-I3 ──────────────────────────────────────────────────────────────────
  it("AC-I3: init --global-mcp --force-mcp repoints the global entry at the new project", async () => {
    const projectRoot = mkTmp("proj");
    const homeDir     = mkTmp("home");
    const desktopCfg  = path.join(mkTmp("desktop"), "claude_desktop_config.json");
    const otherRoot   = "/Users/me/projects/systemix-poc";
    writeConfigWithEntry(desktopCfg, otherRoot);

    const detectClients = () => [
      { name: "Claude Desktop", configPath: desktopCfg, exists: true },
    ];

    await captureLog(() =>
      init({
        projectRoot,
        homeDir,
        prompt: makePrompt(["", "", "", "", "", ""]),
        detectClients,
        globalMcp: true,
        forceMcp: true,
      })
    );

    expect(readEntryRoot(desktopCfg)).toBe(projectRoot);  // intentionally repointed
  });
});
