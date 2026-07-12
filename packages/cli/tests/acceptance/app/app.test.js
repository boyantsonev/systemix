"use strict";

/**
 * Acceptance tests — `systemix app` instance resolution. The #1 confusion is a
 * server pointed at the wrong folder, so the command announces WHICH instance
 * it serves. dryRun returns the resolved {name, isInstance} without spawning.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

const { app } = require("../../../src/commands/app");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "systemix-app-"));
}
const run = (root) =>
  app(["--project-root", root], { dryRun: true, resolveServer: () => "x" });

describe("systemix app — instance resolution", () => {
  let root;
  beforeEach(() => { root = tmpRoot(); });
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

  it("prefers design/DESIGN.md frontmatter name", async () => {
    fs.writeFileSync(path.join(root, "systemix.config.yaml"), "version: 1\n");
    fs.mkdirSync(path.join(root, "design"));
    fs.writeFileSync(
      path.join(root, "design", "DESIGN.md"),
      "---\ntype: design-system\nname: vero\ninstance: vero\n---\n# Vero\n"
    );
    const { instance } = await run(root);
    expect(instance).toEqual({ name: "vero", isInstance: true });
  });

  it("falls back to config instance/name when no DESIGN.md", async () => {
    fs.writeFileSync(path.join(root, "systemix.config.yaml"), "version: 1\ninstance: acme-ds\n");
    const { instance } = await run(root);
    expect(instance.name).toBe("acme-ds");
    expect(instance.isInstance).toBe(true);
  });

  it("flags a folder with no systemix.config.yaml as not an instance", async () => {
    const { instance } = await run(root);
    expect(instance.isInstance).toBe(false);
    expect(instance.name).toBe(path.basename(root)); // dir name fallback
  });
});
