/**
 * drift.test.js — acceptance tests for `systemix drift scan|history`
 * (the sacred-timeline substrate: deterministic snapshots, rolling window).
 */

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const { drift, readHistory } = require("../../../src/commands/drift");

const silence = async (fn) => {
  const orig = console.log;
  console.log = () => {};
  try {
    return await fn();
  } finally {
    console.log = orig;
  }
};

describe("systemix drift", () => {
  let root;
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "sx-drift-"));
    fs.mkdirSync(path.join(root, "src"), { recursive: true });
    fs.mkdirSync(path.join(root, "design"), { recursive: true });
    // canonical tokens are exempt even though they are full of colors
    fs.writeFileSync(path.join(root, "design", "tokens.css"), ":root { --primary: #1a1713; }");
  });
  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  test("scan counts raw colors as critical and px as warnings, writes a snapshot", async () => {
    fs.writeFileSync(
      path.join(root, "src", "Bad.tsx"),
      "const s = { color: '#ff0000', background: 'rgb(1,2,3)', padding: '16px' }"
    );
    fs.writeFileSync(path.join(root, "src", "Clean.tsx"), "const ok = 'var(--primary)'");

    const snapshot = await silence(() => drift(["scan"], { projectRoot: root, now: new Date("2026-07-11T10:00:00Z") }));

    expect(snapshot.critical).toBe(2); // hex + rgb(
    expect(snapshot.warnings).toBe(1); // 16px
    expect(snapshot.componentsAudited).toBe(2);
    expect(snapshot.topOffenders).toEqual(["src/Bad.tsx"]);
    expect(snapshot.runAt).toBe("2026-07-11T10:00:00.000Z");
    expect(snapshot.triggeredBy).toBe("cli");

    const { snapshots } = readHistory(root);
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0].score).toBe(96); // round(100 - 2*2 - 1*0.5)
  });

  test("design/tokens.css is exempt; generated files are skipped", async () => {
    fs.writeFileSync(path.join(root, "src", "themes.generated.ts"), "export const t = '#123456'");
    const snapshot = await silence(() => drift(["scan"], { projectRoot: root }));
    expect(snapshot.critical).toBe(0);
    expect(snapshot.score).toBe(100);
  });

  test("history rolls at 90 snapshots and prints the recent window", async () => {
    for (let i = 0; i < 95; i++) {
      await silence(() => drift(["scan", "--triggered-by", `run-${i}`], { projectRoot: root }));
    }
    const { snapshots } = readHistory(root);
    expect(snapshots).toHaveLength(90);
    expect(snapshots[89].triggeredBy).toBe("run-94");

    const shown = await silence(() => drift(["history", "--last", "5"], { projectRoot: root }));
    expect(shown).toHaveLength(5);
  });
});
