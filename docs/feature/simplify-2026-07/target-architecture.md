# Target architecture — the loop, simplified (2026-07-08)

If Systemix started today as a new project, this is all of it.

## The one sentence

> Systemix runs little experiments on your website, writes down what it learned
> and why, and suggests the next one — you approve every decision.

## The loop (the whole product)

```
        ┌──────────────────────────────────────────────┐
        ▼                                              │
   PROPOSE ──✋──▶ BUILD ──▶ MEASURE ──✋──▶ LEARN ──────┘
 queue.json    experiments/   PostHog     LEARNINGS.md
 (card)        <id>.mdx       (daily)     (the notebook)
```

Two hands = the two human gates: accepting a proposal, closing an experiment.
A third standing gate: any change to the loop's own skills/rules.

## The files (the entire state)

| File | Role |
|---|---|
| `experiments/<id>.mdx` | one experiment: bet, variants, metric, evidence, decision |
| `experiments/LEARNINGS.md` | the notebook — one cited line per closed experiment |
| `experiments/goals/*.mdx` | the outcomes experiments aim at (human-declared) |
| `.systemix/queue.json` | every card waiting for a human |
| `systemix.config.yaml` | thresholds + autonomy setting |

No database, no service. Any tool that reads a directory participates.

## The runner's full state machine (daily cron)

Per running experiment (one action per pass, file re-read fresh each time):

```
status ≠ running          → already-complete
no posthog-event          → blocked:not-measured   (→ /measure)
no creds                  → blocked:not-wired      (→ /connect-signal)
evidence stale            → pull + write back      (one action; re-enter)
evidence weak             → waiting:insufficient-evidence
evidence clears gate      → queue close-proposal   → decision-ready
```

After the sweep, the propose stage (`lib/propose.js`):

```
pending proposal exists                    → dedupe, stop
0 running experiments                      → propose (from LEARNINGS + goals)
fresh learning (≤7d) not yet cited         → propose
otherwise                                  → nothing
```

Covenants, test-pinned: the runner **never closes** and **never creates** —
cards only.

## The core code (all of it)

- `packages/cli/src/lib/loop.js` — evidence pull, evaluate, close-proposal
- `packages/cli/src/lib/propose.js` — the propose stage
- `packages/cli/src/lib/experiments.js` — file ops + the memory (append, parse, recall, backlink)
- `packages/cli/src/lib/goals.js` — goal file ops
- `packages/cli/src/commands/loop.js` — the CLI/cron door

~800 lines. Everything else is a door (CLI subcommands, MCP tools, Claude Code
skills — three doors, same files) or an optional adapter.

## Optional adapters (in the box, out of the story)

- **design/** — tokens.css + guardrails.mdx + drift reports. For teams whose
  experiments are design-system-shaped.
- **Figma pipeline** — sync tokens/components for design-engineer teams.
- Neither is required by the loop; neither appears in the headline docs.

## What stays out of the core (deliberately)

- LLM-synthesized proposals (templates first; `/hermes` enriches on accept)
- usage telemetry, component analytics
- any control-plane service, auth, or dashboard state not derivable from files
