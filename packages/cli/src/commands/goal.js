"use strict";

// `systemix goal …` — the CLI door onto experiments/goals/. Thin wrapper over
// src/lib/goals.js; a Claude Code skill (new-goal) is the other door onto the
// same files. Humans give goals — the engine never self-assigns one.

const path = require("path");
const goalsLib = require("../lib/goals");

const GOAL_HELP = `
  systemix goal — declare what this instance's experiments are for (experiments/goals/)

  Usage:
    systemix goal new <id> [--title "…"] [--given "…"] [--goal-type <kind>] [--icp …] [--status active|validated|parked|killed] [--success-criteria "…"] [--kill-if "…"]
    systemix goal list
`;

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next === undefined || next.startsWith("--")) flags[key] = true;
      else { flags[key] = next; i++; }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

const str = (v) => (typeof v === "string" ? v : undefined);

async function goal(args = [], opts = {}) {
  const root = opts.projectRoot ?? process.cwd();
  const [sub, ...rest] = args;
  const { flags, positional } = parseFlags(rest);

  switch (sub) {
    case "new": {
      const id = positional[0] ?? str(flags.id);
      const file = goalsLib.createGoal(root, id, {
        title: str(flags.title),
        given: str(flags.given),
        goalType: str(flags["goal-type"]),
        icp: str(flags.icp),
        status: str(flags.status),
        successCriteria: str(flags["success-criteria"]),
        killIf: str(flags["kill-if"]),
      });
      console.log(`  ✓  created ${path.relative(root, file) || file} (status: active)`);
      console.log(`     next: frame an experiment against it — systemix experiment new <id> --goal ${id}`);
      break;
    }

    case "list":
    case "ls": {
      const items = goalsLib.listGoals(root);
      if (!items.length) {
        console.log("  (no goals yet — `systemix goal new <id>`)");
        break;
      }
      for (const g of items) {
        console.log(`  ${String(g.status).padEnd(9)} ${g.id}  ${g.title ?? ""}`);
      }
      break;
    }

    case undefined:
      console.log(GOAL_HELP);
      break;

    default:
      console.log(`\n  Unknown goal subcommand: ${sub}`);
      console.log(GOAL_HELP);
      process.exitCode = 1;
  }
}

module.exports = { goal, GOAL_HELP };
