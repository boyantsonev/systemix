#!/usr/bin/env node

const { add } = require("../src/add");
const { list } = require("../src/list");
const { doctor } = require("../src/doctor");
const { init } = require("../src/init");
const { sync } = require("../src/commands/sync");
const { tokenProfile } = require("../src/commands/token-profile");
const { schedule } = require("../src/commands/schedule");
const { tokenGuard } = require("../src/commands/token-guard");
const { update } = require("../src/commands/update");
const { tokens } = require("../src/commands/tokens");
const { watch } = require("../src/commands/watch");
const { socialSignal } = require("../src/commands/social-signal");
const { evidence } = require("../src/commands/evidence");
const { config } = require("../src/commands/config");
const { experiment } = require("../src/commands/experiment");
const { goal } = require("../src/commands/goal");
const { loop } = require("../src/commands/loop");
const { propose } = require("../src/commands/propose");
const { skills } = require("../src/commands/skills");
const { mcp } = require("../src/commands/mcp");
const { audit } = require("../src/commands/audit");
const { design } = require("../src/commands/design");

const [, , command, ...args] = process.argv;

const HELP = `
  systemix — agentic design system ops for Claude Code

  Usage:
    npx @getsystemix/cli audit                   Install the zero-setup design-system audit skill
    npx @getsystemix/cli design [show|feed|init] Read the design system + HITL feed; init = greenfield interview
    npx @getsystemix/cli init                    Interactive setup wizard (run once per project)
    npx @getsystemix/cli init --reconfigure      Re-run the wizard, overwrite systemix.config.yaml
    npx @getsystemix/cli init --global-mcp       Also register systemix-mcp in the global Claude Desktop config
    npx @getsystemix/cli mcp register [--force]  (Re-)register systemix-mcp; --global includes Claude Desktop
    npx @getsystemix/cli config show             Print the active instance topology
    npx @getsystemix/cli workflow add <name>     Install a workflow into this repo's .claude/skills/
    npx @getsystemix/cli workflow list           List available workflows
    npx @getsystemix/cli add <name>              Alias for: workflow add
    npx @getsystemix/cli update                  Check npm + skill-pack updates and apply
    npx @getsystemix/cli update --packs-only     Only refresh external skill packs
    npx @getsystemix/cli update <pack-name>      Refresh a specific skill pack
    npx @getsystemix/cli list                    Show installed skills and workflows
    npx @getsystemix/cli doctor                  Health check for all dependencies
    npx @getsystemix/cli sync [options]          Sync design tokens and components
    npx @getsystemix/cli schedule [sub]          Schedule workflow runs to off-peak windows
    npx @getsystemix/cli token-profile [dir]     Scan for token inefficiency patterns
    npx @getsystemix/cli tokens                  Convert globals.css → .systemix/tokens.bridge.json
    npx @getsystemix/cli watch                   Continuous Hermes run — watch CSS + poll Figma
    npx @getsystemix/cli social-signal           Log social post metrics into PostHog + hypothesis contract
    npx @getsystemix/cli token-guard [sub]       Manage TokenGuard (status|reset|remove)
    npx @getsystemix/cli evidence <sub>          PostHog evidence → HITL queue: experiment|engagement|close|check
    npx @getsystemix/cli experiment <sub>        Drive the loop: new|list|measure|close|learnings|audit
    npx @getsystemix/cli goal <sub>              Declare what experiments are for: new|list (experiments/goals/)
    npx @getsystemix/cli loop [<id>]             Ralph runner — advance running experiments to decision-ready (HITL close)
    npx @getsystemix/cli propose <sub>           Engine generate stage: context|queue — propose the next bet (HITL approve)
    npx @getsystemix/cli skills sync [--global]  Refresh installed loop skills from the CLI's bundled source

  Workflows (install with: npx @getsystemix/cli workflow add <name>):
    design-system                        Product A — Figma↔code token sync (6 skills)
    hypothesis-validation                Product B — ship → measure → loop (4 skills)
    figma-to-code  (alias: figma)        Full 18-skill pipeline
    token-guard    (alias: guard)        MCP proxy auto-register + token cache layer

  Sync options:
    --dry-run                            Estimate token cost without executing
    --node <name>                        Target a single component by name
    --page <name>                        Target a specific Figma page
    --only tokens|components|styles      Narrow the sync scope
    --incremental                        Only sync nodes changed since last run
    --budget <n>                         Abort if estimated token cost exceeds N
    --file <key>                         Figma file key (overrides project-context.json)
    --schedule <when>                    Defer run to off-peak window

  Examples:
    npx @getsystemix/cli workflow add design-system
    npx @getsystemix/cli workflow add hypothesis-validation
    npx @getsystemix/cli init
    npx @getsystemix/cli init --defaults
    npx @getsystemix/cli sync --dry-run
    npx @getsystemix/cli sync --incremental --budget 20000
    npx @getsystemix/cli watch

  Learn more: https://getsystemix.vercel.app
`;

async function main() {
  switch (command) {
    case "audit":
      await audit(args);
      break;
    case "design":
      await design(args);
      break;
    case "init":
      await init({
        reconfigure: args.includes("--reconfigure"),
        defaults: args.includes("--defaults"),
        globalMcp: args.includes("--global-mcp"),
        forceMcp: args.includes("--force-mcp"),
      });
      break;
    case "config":
      await config(args);
      break;
    case "add":
      await add(args[0]);
      break;
    case "workflow":
      if (args[0] === "add") {
        await add(args[1]);
      } else if (!args[0] || args[0] === "list") {
        await add(undefined);
      } else {
        console.error(`\n  Unknown workflow subcommand: ${args[0]}\n`);
        console.log("  Usage: npx @getsystemix/cli workflow add <name>\n");
        process.exit(1);
      }
      break;
    case "list":
    case "ls":
      list();
      break;
    case "doctor":
      await doctor();
      break;
    case "sync":
      await sync(args);
      break;
    case "token-profile":
      await tokenProfile(args);
      break;
    case "schedule":
      await schedule(args);
      break;
    case "token-guard":
      await tokenGuard(args);
      break;
    case "update":
      await update(args);
      break;
    case "tokens":
      await tokens(args);
      break;
    case "watch":
      await watch(args);
      break;
    case "social-signal":
      await socialSignal(args);
      break;
    case "evidence":
      await evidence(args);
      break;
    case "experiment":
      await experiment(args);
      break;
    case "goal":
      await goal(args);
      break;
    case "loop":
      await loop(args);
      break;
    case "propose":
      await propose(args);
      break;
    case "skills":
      await skills(args);
      break;
    case "mcp":
      await mcp(args);
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`\n  Unknown command: ${command}\n`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch(err => {
  console.error("\n✗", err.message, "\n");
  process.exit(1);
});
