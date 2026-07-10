# Systemix — your design system, in this repo

This repo has a **design system you own**: tokens in `design/tokens.css`, the rules
in `design/guardrails.mdx`. Your job as the agent is to **follow the rules and keep
the interface consistent** — no drift, no duplicate components, no slop.

## Follow the rules (every change)
- **Read `design/guardrails.mdx` before you write UI**, and check your change
  against it. Tokens are code-first: reference the custom properties in
  `design/tokens.css`. **No raw hex/px, no ad-hoc font sizes** — add a token first,
  then use it. Reuse existing components; don't rebuild a primitive inline.
- **Ask before doing something new.** If a change needs a value, component, or rule
  that isn't in the system yet, **stop and propose it — with the rationale — and
  wait for the human.** Nothing about the system self-modifies silently.
- `/design-audit` (zero-setup) finds drift + duplicates and proposes a `design/`
  starter; `/drift-report` holds the line against `design/guardrails.mdx` on every
  change.

## Guardrails (the covenant)
- **Autonomy dial** (`systemix.config.yaml`): ghost / assisted / autonomous.
  Instances start at **ghost** (propose-only); raising the dial is itself a
  decision. **Self-modification (skills + guardrails) is always HITL**, even in
  autonomous mode.
- Skills live in `.claude/skills/` (Claude Code discovers them automatically).

## Recall before building (the memory is the point)
Before any product/UI change, recall what this repo has already learned:
`npx @systemix/cli experiment learnings --recent 5` (or the MCP `experiment_learnings`).
**Don't contradict a high-confidence learning without flagging it to the human.**
Cite learning ids in PR descriptions; when a change builds on a prior learning,
backlink it: `npx @systemix/cli experiment used <prior-id> --by <id>`. The full
evidence digest (learnings + running experiments + goals + ODI ranking) is
`npx @systemix/cli propose context`.

## Where it grows (the loop, optional)
Once the system holds, close a learning loop in `experiments/`:
`/init-experiment` → `/write-variants` → `/measure` → `/close-experiment` appends the
decision to `experiments/LEARNINGS.md`. General, not design-bound.
The **engine** closes the arc back to generate: the weekly cron
(`.github/workflows/systemix-engine.yml`) runs `/propose-experiment` to queue the
ONE next bet as a hypothesis-proposal card — a human approves it on Home; approval
scaffolds the contract, and nothing ships until `/write-variants` + a merged PR.
`/atlas` interviews the instance topology and generates a multi-agent loop workflow
that wraps `systemix loop` (propose-only, HITL like all self-modification).

## Where things are
- `design/DESIGN.md` — the design system: `tokens.css` (canonical) + `guardrails.mdx` (rules)
- `.systemix/queue.json` — the HITL decision queue (proposals wait here for a human)
- `experiments/` — the optional learning loop: `<id>.mdx` + `goals/` + `LEARNINGS.md`
