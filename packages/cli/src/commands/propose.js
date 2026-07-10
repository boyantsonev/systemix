"use strict";

// `systemix propose` — the generate stage's two deterministic halves.
//
//   propose context   print the read-only evidence digest (learnings, running
//                     experiments, goals, ODI ranking) the LLM reasons over
//   propose queue     validate + queue the drafted bet as ONE hypothesis-proposal
//                     card in .systemix/queue.json (dedupe: one pending max)
//
// The LLM (the /propose-experiment skill) sits between the two calls and never
// touches the files itself. Approval happens on Home (/config) — approving
// scaffolds the experiment contract; it never ships code.

const fs = require("fs");
const { buildProposalContext, pushHypothesisProposal } = require("../lib/propose");

const PROPOSE_HELP = `
  systemix propose — the engine's generate stage (propose-only, HITL at approve)

  Usage:
    systemix propose context [--recent <n>] [--odi-top <n>]   Print the evidence digest (JSON)
    systemix propose queue --stdin                            Queue a hypothesis-proposal card from stdin JSON
    systemix propose queue --file <path>                      … or from a JSON file

  The proposal JSON shape:
    { "hypothesis": "...", "context": "cites a learning bullet, ODI id, or product workflow",
      "confidence": 0.55, "citedLearnings": ["<experiment-id>"], "citedOdi": ["ODI-1"],
      "citedWorkflow": ["<product-workflow-id>"],
      "payload": { "id", "section", "icp", "jtbd", "goal", "hypothesis", "given",
                   "conclusion", "metric", "control", "variant_b", "rationale" } }

  payload maps 1:1 onto \`systemix experiment new\` — approving the card creates
  experiments/<id>.mdx. At most ONE proposal is pending at a time.
`;

function num(args, flag, fallback) {
  const i = args.indexOf(flag);
  const v = i !== -1 ? Number(args[i + 1]) : NaN;
  return Number.isFinite(v) ? v : fallback;
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function propose(args = [], opts = {}) {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(PROPOSE_HELP);
    return;
  }
  const root = opts.projectRoot ?? process.cwd();
  const sub = args[0];

  if (sub === "context") {
    const digest = buildProposalContext(root, {
      recent: num(args, "--recent", 5),
      odiTop: num(args, "--odi-top", 5),
    });
    console.log(JSON.stringify(digest, null, 2));
    return digest;
  }

  if (sub === "queue") {
    let raw;
    if (args.includes("--stdin")) {
      raw = opts.stdin ?? (await readStdin());
    } else {
      const i = args.indexOf("--file");
      const file = i !== -1 ? args[i + 1] : null;
      if (!file) throw new Error("propose queue needs --stdin or --file <path>");
      raw = fs.readFileSync(file, "utf8");
    }
    let proposal;
    try {
      proposal = JSON.parse(raw);
    } catch {
      throw new Error("propose queue: input is not valid JSON");
    }
    const { card, deduped } = pushHypothesisProposal(root, proposal, {
      ...(opts.now ? { now: opts.now } : {}),
    });
    console.log(
      deduped
        ? `\n  proposal already pending: ${card.id} — resolve it on Home (/config) before proposing again\n`
        : `\n  hypothesis-proposal queued: ${card.id}\n  review it on Home (/config) — approving scaffolds experiments/${card.payload.id}.mdx\n`,
    );
    return { card, deduped };
  }

  console.log(PROPOSE_HELP);
  throw new Error(`unknown propose subcommand: ${sub ?? "(none)"}`);
}

module.exports = { propose, PROPOSE_HELP };
