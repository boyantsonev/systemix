"use strict";

// The propose stage — the loop's missing half. After the daily sweep, the
// runner asks: should the next experiment exist yet? If the loop is idle
// (nothing running) or a fresh learning landed in LEARNINGS.md, it queues an
// `experiment-proposal` card in .systemix/queue.json for a human.
//
// Covenant (mirrors the close covenant): the runner NEVER creates the
// experiment file. It proposes; you decide — accept via /init-experiment
// (which reads the card and prefills) or `systemix experiment new`.
//
// Deterministic — no LLM, so it runs in CI. The draft is built from the
// newest learnings (memory recall, finally automated) + the top active goal.

const fs = require("fs");
const path = require("path");
const layout = require("./layout");
const exp = require("./experiments");
const goals = require("./goals");

const DAY_MS = 24 * 60 * 60 * 1000;

function readQueue(root) {
  const file = layout.abs(root).queue;
  if (!fs.existsSync(file)) return { cards: [] };
  try {
    const queue = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(queue.cards)) queue.cards = [];
    return queue;
  } catch {
    return { cards: [] };
  }
}

function writeQueue(root, queue) {
  const file = layout.abs(root).queue;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(queue, null, 2) + "\n", "utf8");
  fs.renameSync(tmp, file);
}

/** `<goalId>-<YYYY-MM>`, suffixed -b/-c/… if the experiment file already exists. */
function suggestId(root, goalId, now) {
  const base = `${goalId ?? "next"}-${now.toISOString().slice(0, 7)}`;
  let id = base;
  for (let i = 0; fs.existsSync(layout.abs(root).experimentFile(id)); i++) {
    id = `${base}-${String.fromCharCode(98 + i)}`; // -b, -c, …
  }
  return id;
}

/**
 * Queue an experiment-proposal card when the loop has room for a next bet.
 * Triggers (either): the loop is idle (0 running experiments), or a learning
 * landed within `sinceDays` that no prior proposal has cited.
 * Dedupe: at most one pending proposal at a time.
 */
function proposeNextExperiment(root, { now = new Date(), sinceDays = 7 } = {}) {
  const queue = readQueue(root);

  const pending = queue.cards.find(
    (c) => c.type === "experiment-proposal" && c.status === "pending",
  );
  if (pending) return { proposed: false, deduped: true, card: pending };

  const running = exp.listExperiments(root, { status: "running" });
  const learnings = exp.parseLearnings(exp.readLearnings(root) ?? "");

  // A learning is "fresh" if it's recent AND no proposal (any status) cites it —
  // judged proposals don't reappear every day.
  const cited = new Set(
    queue.cards
      .filter((c) => c.type === "experiment-proposal")
      .flatMap((c) => c.sourceLearnings ?? []),
  );
  const cutoff = now.getTime() - sinceDays * DAY_MS;
  const fresh = learnings.filter(
    (e) => e.date && new Date(`${e.date}T00:00:00Z`).getTime() >= cutoff && e.id && !cited.has(e.id),
  );

  const idle = running.length === 0;
  if (!idle && fresh.length === 0) {
    return { proposed: false, reason: "experiments running, no uncited recent learning" };
  }

  const goal = goals.listGoals(root).find((g) => g.status === "active") ?? null;
  const goalLabel = goal ? goal.title ?? goal.id : null;
  const recall = (fresh.length ? fresh : learnings).slice(0, 3);

  let draftHypothesis;
  if (recall.length) {
    const l = recall[0];
    draftHypothesis =
      `Building on "${l.title}" (decision: ${l.decision ?? "—"}, confidence ${l.confidence ?? "—"}): ` +
      `the next bet${goalLabel ? ` toward "${goalLabel}"` : ""} — replace this line with the specific change you want to test.`;
  } else if (goalLabel) {
    draftHypothesis = `No learnings recorded yet. Goal "${goalLabel}" is active with no running experiment — draft the first bet against its metric.`;
  } else {
    draftHypothesis = "No learnings and no active goal yet. Declare a goal (`systemix goal new`), then draft the first bet against its metric.";
  }

  const rationale = recall.length
    ? `The loop's newest memory:\n${recall.map((e) => e.raw).join("\n")}`
    : idle
      ? "The loop is idle — no experiment is running, so nothing is being learned."
      : "A fresh learning landed and no proposal has used it yet.";

  const card = {
    id: `experiment-proposal-${now.getTime()}`,
    type: "experiment-proposal",
    status: "pending",
    proposedBy: "loop-runner",
    requestedAt: now.toISOString(),
    goal: goal?.id ?? null,
    suggestedId: suggestId(root, goal?.id, now),
    draftHypothesis,
    rationale,
    sourceLearnings: recall.map((e) => e.id).filter(Boolean),
    nextStep:
      "You decide: run /init-experiment in Claude Code (it reads this card and prefills the wizard), " +
      "or `systemix experiment new <suggestedId>`. The runner never creates the experiment file.",
  };

  queue.cards.push(card);
  writeQueue(root, queue);
  return { proposed: true, card };
}

module.exports = { proposeNextExperiment };
