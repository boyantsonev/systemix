"use strict";

// Acceptance tests for the deterministic experiment-evidence loop:
// `systemix evidence experiment pull` (PostHog funnel → experiment snapshot + HITL
// card). Hermetic: real tmpdir workspace, stubbed global fetch, env toggled per test.
// No Ollama, no LLM — synthesis is deterministic (ADR-019).

const fs   = require("fs");
const os   = require("os");
const path = require("path");

const EXPERIMENT_MDX = `---
type: experiment
id: landing-live-loop-2026-06
section: landing
icp: pre-pmf-founder
status: running
metric: book-a-call-rate
hypothesis: "Seeing the live loop converts the founder to a call."
posthog-event: book_a_call
evidence-posthog: null
evidence-social: null
created: 2026-06-18
review-by: null
---

## Why this hypothesis
Body.
`;

let root, prevCwd, prevEnv;

function freshModule() {
  jest.resetModules();
  return require("../../../src/commands/evidence");
}

function makeWorkspace(mdx = EXPERIMENT_MDX, id = "landing-live-loop-2026-06") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "systemix-experiment-"));
  fs.mkdirSync(path.join(dir, "experiments"), { recursive: true });
  fs.mkdirSync(path.join(dir, ".systemix"), { recursive: true });
  fs.writeFileSync(path.join(dir, "experiments", `${id}.mdx`), mdx, "utf8");
  return dir;
}

function readExperiment(id = "landing-live-loop-2026-06") {
  return fs.readFileSync(path.join(root, "experiments", `${id}.mdx`), "utf8");
}
function readQueue() {
  const p = path.join(root, ".systemix", "queue.json");
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : { cards: [] };
}

beforeEach(() => {
  prevCwd = process.cwd();
  prevEnv = { ...process.env };
  root = makeWorkspace();
  process.chdir(root);
  global.fetch = jest.fn();
});

afterEach(() => {
  process.chdir(prevCwd);
  process.env = prevEnv;
  fs.rmSync(root, { recursive: true, force: true });
  delete global.fetch;
});

// ── queryPostHogExperiment ────────────────────────────────────────────────────

test("query returns no-credentials when env is unset (no network call)", async () => {
  delete process.env.POSTHOG_API_KEY;
  delete process.env.POSTHOG_PROJECT_ID;
  const { queryPostHogExperiment } = freshModule();
  const ev = await queryPostHogExperiment("book_a_call", 30);
  expect(ev.source).toBe("no-credentials");
  expect(ev.event).toBe("book_a_call");
  expect(ev.visitors).toBe(0);
  expect(ev.rate).toBeNull();
  expect(ev.fetched_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(global.fetch).not.toHaveBeenCalled();
});

test("query rejects an unsafe event name before hitting the network", async () => {
  process.env.POSTHOG_API_KEY = "phx_test";
  process.env.POSTHOG_PROJECT_ID = "123";
  const { queryPostHogExperiment } = freshModule();
  const ev = await queryPostHogExperiment("book'; DROP", 30);
  expect(ev.source).toBe("invalid-event");
  expect(global.fetch).not.toHaveBeenCalled();
});

test("query computes visitors + event persons + rate from the HogQL row", async () => {
  process.env.POSTHOG_API_KEY = "phx_test";
  process.env.POSTHOG_PROJECT_ID = "123";
  process.env.POSTHOG_HOST = "https://eu.posthog.com";
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ results: [[800, 50, 40]] }) });

  const { queryPostHogExperiment } = freshModule();
  const ev = await queryPostHogExperiment("book_a_call", 30);

  expect(ev.source).toBe("live");
  expect(ev.visitors).toBe(800);
  expect(ev.event_count).toBe(50);
  expect(ev.event_persons).toBe(40);
  expect(ev.rate).toBeCloseTo(40 / 800, 5);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch.mock.calls[0][0]).toBe("https://eu.posthog.com/api/projects/123/query");
  const body = JSON.parse(global.fetch.mock.calls[0][1].body);
  expect(body.query.kind).toBe("HogQLQuery");
  expect(body.query.query).toMatch(/book_a_call/);
  expect(body.query.query).toMatch(/\$pageview/);
  expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer phx_test");
});

test("query nulls the rate when there is no traffic", async () => {
  process.env.POSTHOG_API_KEY = "phx_test";
  process.env.POSTHOG_PROJECT_ID = "123";
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) });
  const { queryPostHogExperiment } = freshModule();
  const ev = await queryPostHogExperiment("book_a_call", 30);
  expect(ev.source).toBe("live");
  expect(ev.visitors).toBe(0);
  expect(ev.rate).toBeNull();
});

test("query returns source=error on a failed response", async () => {
  process.env.POSTHOG_API_KEY = "phx_test";
  process.env.POSTHOG_PROJECT_ID = "123";
  global.fetch.mockResolvedValueOnce({ ok: false, status: 403 });
  const { queryPostHogExperiment } = freshModule();
  const ev = await queryPostHogExperiment("book_a_call", 30);
  expect(ev.source).toBe("error");
  expect(ev.error).toBe("PostHog query 403");
});

// ── synthesizeExperiment ──────────────────────────────────────────────────────

test("synthesis is deterministic and confidence tracks sample size", () => {
  const { synthesizeExperiment } = freshModule();
  expect(synthesizeExperiment({ source: "no-credentials", event: "e", period_days: 30 }).recommendation).toBe("configure-posthog");
  expect(synthesizeExperiment({ source: "no-credentials" }).confidence).toBe(0);
  expect(synthesizeExperiment({ source: "live", visitors: 1200, event_persons: 30, rate: 0.025, event: "book_a_call", period_days: 30 }).confidence).toBe(0.8);
  expect(synthesizeExperiment({ source: "live", visitors: 200, event_persons: 5, rate: 0.025, event: "book_a_call", period_days: 30 }).confidence).toBe(0.5);
  expect(synthesizeExperiment({ source: "live", visitors: 10, event_persons: 0, rate: 0, event: "book_a_call", period_days: 30 }).confidence).toBe(0.2);
  const none = synthesizeExperiment({ source: "live", visitors: 0, event_persons: 0, rate: null, event: "book_a_call", period_days: 30 });
  expect(none.confidence).toBe(0);
  expect(none.recommendation).toMatch(/no-traffic/);
});

// ── writeExperimentSnapshot ───────────────────────────────────────────────────

test("snapshot replaces the evidence-posthog: null line with a block", () => {
  const { writeExperimentSnapshot } = freshModule();
  writeExperimentSnapshot("landing-live-loop-2026-06", {
    event: "book_a_call", period_days: 30, fetched_at: "2026-07-02",
    visitors: 800, event_count: 50, event_persons: 40, rate: 0.05, source: "live",
  });
  const out = readExperiment();
  expect(out).toMatch(/evidence-posthog:\n {2}fetched_at: "2026-07-02"/);
  expect(out).toMatch(/visitors: 800/);
  expect(out).toMatch(/event: "book_a_call"/);
  expect(out).toMatch(/rate: 0\.05/);
  // Other frontmatter + body survive.
  expect(out).toMatch(/id: landing-live-loop-2026-06/);
  expect(out).toMatch(/## Why this hypothesis/);
  expect(out).not.toMatch(/evidence-posthog: null/);
});

// ── experimentPull (end to end) ───────────────────────────────────────────────

test("pull writes the snapshot + queues an experiment-validation card from live data", async () => {
  process.env.POSTHOG_API_KEY = "phx_test";
  process.env.POSTHOG_PROJECT_ID = "123";
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ results: [[800, 50, 40]] }) });

  const { experimentPull } = freshModule();
  await experimentPull(["--days", "30"]);

  const out = readExperiment();
  expect(out).toMatch(/visitors: 800/);

  const cards = readQueue().cards;
  expect(cards).toHaveLength(1);
  const card = cards[0];
  expect(card.type).toBe("experiment-validation");
  expect(card.experimentId).toBe("landing-live-loop-2026-06");
  expect(card.metric).toBe("book-a-call-rate");
  expect(card.baselineRate).toBeCloseTo(0.05, 5);
  expect(card.sessions).toBe(800);
  expect(card.confidenceLevel).toBe(0.5);
  expect(card.status).toBe("pending");
  expect(card._posthogData.source).toBe("live");
  expect(card._posthogData.fetched_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("pull with no credentials queues an honest card and never touches the experiment file", async () => {
  delete process.env.POSTHOG_API_KEY;
  delete process.env.POSTHOG_PROJECT_ID;
  const before = readExperiment();

  const { experimentPull } = freshModule();
  await experimentPull([]);

  expect(readExperiment()).toBe(before); // untouched — no snapshot on no-creds
  const cards = readQueue().cards;
  expect(cards).toHaveLength(1);
  expect(cards[0].type).toBe("experiment-validation");
  expect(cards[0].proposal).toBe("configure-posthog");
  expect(cards[0].confidenceLevel).toBe(0);
  expect(global.fetch).not.toHaveBeenCalled();
});

test("pull supersedes a prior pending card for the same experiment", async () => {
  process.env.POSTHOG_API_KEY = "phx_test";
  process.env.POSTHOG_PROJECT_ID = "123";
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [[100, 2, 2]] }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [[900, 20, 18]] }) });
  const mod = freshModule();
  await mod.experimentPull([]);
  await mod.experimentPull([]);
  const pending = readQueue().cards.filter(c => c.status === "pending");
  expect(pending).toHaveLength(1);
  expect(pending[0].sessions).toBe(900);
});

test("pull skips experiments that are not running or have no posthog-event", async () => {
  // Rewrite the fixture: status complete → skipped unless --all; and a second
  // running experiment with no event → skipped.
  fs.writeFileSync(
    path.join(root, "experiments", "done.mdx"),
    EXPERIMENT_MDX.replace("id: landing-live-loop-2026-06", "id: done").replace("status: running", "status: complete"),
    "utf8",
  );
  fs.writeFileSync(
    path.join(root, "experiments", "noevent.mdx"),
    EXPERIMENT_MDX.replace("id: landing-live-loop-2026-06", "id: noevent").replace("posthog-event: book_a_call", "posthog-event: null"),
    "utf8",
  );
  process.env.POSTHOG_API_KEY = "phx_test";
  process.env.POSTHOG_PROJECT_ID = "123";
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ results: [[10, 1, 1]] }) });

  const { experimentPull } = freshModule();
  await experimentPull([]);

  const ids = readQueue().cards.map(c => c.experimentId).sort();
  expect(ids).toEqual(["landing-live-loop-2026-06"]); // only the running, wired one
});
