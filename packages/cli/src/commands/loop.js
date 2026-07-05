"use strict";

// `systemix loop [<id>]` — the Ralph runner CLI door. One pass advances a
// running experiment toward decision-ready (evidence → evaluate → HITL card);
// no id sweeps every running experiment (the cron entrypoint). Never closes.

const { loadConfig } = require("../config");
const { runLoop, sweepLoop, DEFAULT_THRESHOLDS } = require("../lib/loop");

const LOOP_HELP = `
  systemix loop — Ralph-drive running experiments to decision-ready (HITL at close)

  Usage:
    systemix loop <id> [--days <n>] [--max-iterations <n>]   One experiment
    systemix loop [--days <n>]                               Sweep all running (cron mode)

  Each iteration re-reads the experiment file (fresh context), does ONE action
  (pull evidence → evaluate → queue a close-proposal card), and stops on an
  explicit state. The runner never closes an experiment — a human does, via
  /close-experiment or \`systemix experiment close\`.
`;

const NEXT_HINT = {
  "decision-ready": (id) => `review the card, then: /close-experiment ${id}`,
  "blocked:not-measured": (id) => `run /measure ${id} to wire the posthog-event`,
  "blocked:not-wired": () => "run /connect-signal (or set POSTHOG_API_KEY + POSTHOG_PROJECT_ID)",
  "blocked:posthog-error": () => "check POSTHOG_HOST / POSTHOG_PROJECT_ID",
  "waiting:insufficient-evidence": () => "loop again after more traffic (the daily cron re-runs this)",
  "already-complete": () => null,
  "max-iterations": () => "re-run to continue (safety cap)",
};

function num(args, flag, fallback) {
  const i = args.indexOf(flag);
  const v = i !== -1 ? Number(args[i + 1]) : NaN;
  return Number.isFinite(v) ? v : fallback;
}

async function loop(args = [], opts = {}) {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(LOOP_HELP);
    return;
  }
  const root = opts.projectRoot ?? process.cwd();
  const id = args.find((a) => !a.startsWith("--"));
  const days = num(args, "--days", 30);
  const maxIterations = num(args, "--max-iterations", 5);

  // Thresholds come from the instance dial (systemix.config.yaml); defaults when absent.
  let thresholds = DEFAULT_THRESHOLDS;
  try {
    thresholds = loadConfig(root)?.hermes?.thresholds ?? DEFAULT_THRESHOLDS;
  } catch { /* uninitialised repo — run with defaults */ }

  const runOpts = {
    days,
    maxIterations,
    thresholds,
    log: (m) => console.log(m),
    // test seams
    ...(opts.fetchEvidence ? { fetchEvidence: opts.fetchEvidence } : {}),
    ...(opts.now ? { now: opts.now } : {}),
  };

  const report = (r) => {
    const hint = NEXT_HINT[r.stop]?.(r.id);
    if (hint) console.log(`     next: ${hint}`);
  };

  if (id) {
    console.log(`\n  systemix loop — ${id} (${days}d window)\n`);
    report(await runLoop(root, id, runOpts));
  } else {
    const results = await sweepLoop(root, runOpts);
    if (!results.length) {
      console.log("\n  (no running experiments — `systemix experiment new <id>` starts one)\n");
      return;
    }
    console.log(`\n  systemix loop — swept ${results.length} running experiment${results.length === 1 ? "" : "s"}\n`);
    for (const r of results) {
      console.log(`  ${r.id}: ${r.stop}${r.note ? ` — ${r.note}` : ""}`);
      report(r);
    }
  }
  console.log("");
}

module.exports = { loop, LOOP_HELP };
