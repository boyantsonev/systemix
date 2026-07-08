"use strict";

/**
 * Acceptance tests — the propose stage (`lib/propose.js`). The loop's missing
 * half: after the sweep, the runner may queue an `experiment-proposal` card —
 * and NEVER creates the experiment file (the covenant, pinned here). Real
 * filesystem (tmp dirs), fixed clock, deterministic templates (no LLM).
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

const exp = require("../../../src/lib/experiments");
const goals = require("../../../src/lib/goals");
const { proposeNextExperiment } = require("../../../src/lib/propose");
const { loop } = require("../../../src/commands/loop");

const NOW = new Date("2026-07-04T00:00:00.000Z");

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "systemix-propose-"));
}
const readQueue = (root) => {
  const p = path.join(root, ".systemix", "queue.json");
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : { cards: [] };
};
const writeQueue = (root, queue) => {
  fs.mkdirSync(path.join(root, ".systemix"), { recursive: true });
  fs.writeFileSync(path.join(root, ".systemix", "queue.json"), JSON.stringify(queue, null, 2), "utf8");
};
const experimentFiles = (root) => {
  const dir = path.join(root, "experiments");
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")) : [];
};

describe("proposeNextExperiment — the propose stage", () => {
  let root;
  beforeEach(() => {
    root = tmpRoot();
  });
  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  it("idle loop (0 running) queues a proposal card — and NEVER creates an experiment file", () => {
    goals.createGoal(root, "consultancy-leads", { title: "Consultancy leads", now: NOW });
    const before = experimentFiles(root);

    const r = proposeNextExperiment(root, { now: NOW });

    expect(r.proposed).toBe(true);
    expect(experimentFiles(root)).toEqual(before); // the covenant: queue.json only
    const cards = readQueue(root).cards;
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({
      type: "experiment-proposal",
      status: "pending",
      proposedBy: "loop-runner",
      goal: "consultancy-leads",
      suggestedId: "consultancy-leads-2026-07",
    });
    expect(cards[0].nextStep).toMatch(/init-experiment/);
  });

  it("cites the newest learning + the active goal in the draft", () => {
    goals.createGoal(root, "consultancy-leads", { title: "Consultancy leads", now: NOW });
    exp.createExperiment(root, "hero-cta-2026-06", { now: NOW });
    exp.closeExperiment(root, "hero-cta-2026-06", {
      result: "Bolder CTA lifted calls 24%",
      decision: "promote",
      confidence: 0.85,
      now: NOW,
    });

    const r = proposeNextExperiment(root, { now: NOW });

    expect(r.proposed).toBe(true);
    expect(r.card.sourceLearnings).toContain("hero-cta-2026-06");
    expect(r.card.draftHypothesis).toMatch(/Bolder CTA lifted calls 24%/);
    expect(r.card.draftHypothesis).toMatch(/Consultancy leads/);
    expect(r.card.rationale).toMatch(/from \[hero-cta-2026-06\]/);
  });

  it("empty ledger still proposes, with the honest no-learnings template", () => {
    goals.createGoal(root, "consultancy-leads", { title: "Consultancy leads", now: NOW });
    const r = proposeNextExperiment(root, { now: NOW });
    expect(r.proposed).toBe(true);
    expect(r.card.draftHypothesis).toMatch(/No learnings recorded yet/);
    expect(r.card.sourceLearnings).toEqual([]);
  });

  it("dedupes: a second call while a proposal is pending queues nothing", () => {
    proposeNextExperiment(root, { now: NOW });
    const r2 = proposeNextExperiment(root, { now: NOW });
    expect(r2.proposed).toBe(false);
    expect(r2.deduped).toBe(true);
    expect(readQueue(root).cards).toHaveLength(1);
  });

  it("no-op while experiments run and no recent learning is uncited", () => {
    exp.createExperiment(root, "running-one", { now: NOW });
    const r = proposeNextExperiment(root, { now: NOW });
    expect(r.proposed).toBe(false);
    expect(readQueue(root).cards).toHaveLength(0);
  });

  it("a fresh close triggers a proposal even while another experiment runs — and a resolved proposal keeps that learning cited", () => {
    exp.createExperiment(root, "still-running", { now: NOW });
    exp.createExperiment(root, "just-closed", { now: NOW });
    exp.closeExperiment(root, "just-closed", { result: "won", decision: "promote", confidence: 0.85, now: NOW });

    const r = proposeNextExperiment(root, { now: NOW });
    expect(r.proposed).toBe(true);
    expect(r.card.sourceLearnings).toContain("just-closed");

    // Human dismisses the proposal — the learning stays cited, so the loop
    // doesn't re-propose the same bet tomorrow.
    const queue = readQueue(root);
    queue.cards[queue.cards.length - 1].status = "dismissed";
    writeQueue(root, queue);

    const r2 = proposeNextExperiment(root, { now: NOW });
    expect(r2.proposed).toBe(false);
    expect(readQueue(root).cards.filter((c) => c.type === "experiment-proposal")).toHaveLength(1);
  });

  it("suggestedId dodges an existing experiment file (-b suffix)", () => {
    goals.createGoal(root, "consultancy-leads", { title: "Consultancy leads", now: NOW });
    exp.createExperiment(root, "consultancy-leads-2026-07", { now: NOW });
    exp.closeExperiment(root, "consultancy-leads-2026-07", { decision: "kill", now: NOW });
    const r = proposeNextExperiment(root, { now: NOW });
    expect(r.card.suggestedId).toBe("consultancy-leads-2026-07-b");
  });

  it("CLI door: `systemix loop` with nothing running queues the proposal after the sweep", async () => {
    goals.createGoal(root, "consultancy-leads", { title: "Consultancy leads", now: NOW });
    await loop([], { projectRoot: root, now: NOW });
    const cards = readQueue(root).cards;
    expect(cards).toHaveLength(1);
    expect(cards[0].type).toBe("experiment-proposal");
    expect(experimentFiles(root)).toEqual([]); // still nothing created
  });
});
