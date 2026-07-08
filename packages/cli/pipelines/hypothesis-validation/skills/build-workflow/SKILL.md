---
name: build-workflow
description: Turn a short guided conversation into a visual, composable agentic workflow — a steps+edges graph saved to .systemix/workflows/<slug>.json that renders via the Atlas StepNode graph (and can be pasted into an experiment's `workflow` frontmatter). You pick the trigger, the step order, which steps are human-in-the-loop, and where it branches or fans out; the skill composes valid steps from the fixed StepKind vocabulary and wires the edges. Propose-only — the workflow file is written only after you approve it.
disable-model-invocation: false
argument-hint: "[workflow name]"
version: "0.1.0"
last_updated: "2026-07-08"
min_cli_version: "1.1.0"
---

# Build a workflow

## Purpose

Author a **visual, composable workflow** — a `steps + edges` graph — from a short
guided conversation, and save it where the app already renders it. This is the
"middle of the loop" authoring gap: the graph and the storage already exist; this
skill is the front door that turns a conversation into a valid workflow.

**How this differs from `/atlas`.** `/atlas` generates an *executable* runner
(`.claude/workflows/<slug>-loop.js`) that the `Workflow` tool runs to advance
experiments. `/build-workflow` produces the *data* artifact —
`.systemix/workflows/<slug>.json` — that the Atlas **StepNode graph** draws
(`toFlow` → `src/components/atlas/node-types`, the same renderer an experiment's
`workflow` frontmatter uses). Different artifact, different job: this one is for
*seeing and composing* a flow, not running it.

No new storage and no new rendering are introduced — this skill only writes a file
that conforms to the shape the app already consumes (`src/lib/ports/atlas.ts`).

## The shape you produce

A single JSON file `.systemix/workflows/<slug>.json`:

```json
{
  "id": "<slug>",
  "name": "<Display Name>",
  "description": "<one line: what this workflow does>",
  "steps": [
    { "id": "start",    "kind": "input",  "label": "Trigger",        "note": "what starts it" },
    { "id": "classify", "kind": "router", "label": "Classify",       "note": "branch condition", "agent": "hermes" },
    { "id": "fix",      "kind": "agent",  "label": "Propose fix",    "note": "what the agent does" },
    { "id": "review",   "kind": "human",  "label": "Approve",        "note": "HITL checkpoint" },
    { "id": "done",     "kind": "output", "label": "Result",         "note": "terminal output" }
  ],
  "edges": [
    { "from": "start",    "to": "classify" },
    { "from": "classify", "to": "fix",    "label": "needs change" },
    { "from": "classify", "to": "done",   "label": "already clean" },
    { "from": "fix",      "to": "review" },
    { "from": "review",   "to": "done" }
  ],
  "tags": ["<optional>"]
}
```

### The step vocabulary — `kind` MUST be one of these (from `src/lib/ports/atlas.ts`)

| `kind`       | glyph | use it for |
|--------------|-------|------------|
| `input`      | ▷ | the human/system trigger that starts the flow |
| `agent`      | ✦ | an agent does reasoning/generation |
| `router`     | ⋔ | classify-and-branch (2+ outgoing edges, each `label`ed with its condition) |
| `parallel`   | ≣ | fan-out / fan-in coordinator (splits to concurrent steps, then rejoins) |
| `tool`       | ⌗ | a deterministic tool/skill/CLI/MCP call |
| `human`      | ⊙ | a human-in-the-loop checkpoint (approval/decision) |
| `output`     | ✓ | the terminal result |

Step fields: `id` (unique, kebab-case), `label` (short), `kind` (above), `note`
(one phrase). Optional: `agent` (one of `hermes · orchestrator · scout · flux · ada ·
echo · prism · sage · ship`) on `agent`/`router` steps; `screen` (an in-app route
like `/experiments`) to link a step to a rendered prototype.

Edge fields: `from`, `to` (must reference real step `id`s), and `label` (required on
`router` branches — the condition that selects the edge).

## Steps

### Step 0 — Recall context

- List existing workflows so you don't duplicate one and can reuse a shape:
  `ls .systemix/workflows/` (or `systemix config show` / MCP `list_workflows`).
- List the skills available to compose from — `.claude/skills/*/SKILL.md` (each is a
  candidate `tool` or `agent` step). Prefer wiring existing skills over inventing
  generic steps.
- Keep the StepKind table above open — every step's `kind` must be one of those.

### Step 1 — Interview (short, structured)

Ask with **AskUserQuestion** where the answer is enumerable, free text otherwise.
Offer defaults inferred from the repo (routes under `src/app/`, the skills list):

1. **Name + problem** — what is this workflow called, and the one-line problem it solves.
2. **Trigger** (`input`) — what kicks it off (a signal, a schedule, a human action)?
3. **Steps in order** — the sequence of work. For each: a short label, what it does
   (→ `note`), and its `kind` (agent reasoning? a tool/skill call? a router?).
   Suggest mapping named skills to `tool`/`agent` steps.
4. **Human checkpoints** — which steps must a human approve or decide (→ `kind: human`)?
   Default: at least the final decision, matching Systemix's propose-only contract.
5. **Branching / parallel** — does it ever branch (→ a `router` with labelled edges) or
   run steps concurrently (→ a `parallel` coordinator)? If neither, it's a straight chain.
6. **Output** (`output`) — what's the terminal result?

Derive `<slug>` (kebab-case) from the name.

### Step 2 — Compose the graph (do NOT write yet)

Turn the answers into the JSON shape above:
- One `input` step first, one (or more) `output` step last.
- Each middle step gets a valid `kind`; attach an `agent` where an agent owns it.
- Wire `edges` in order. For a straight chain, one edge per adjacent pair. For a
  `router`, emit one labelled edge per branch. For `parallel`, edge the coordinator to
  each concurrent step and each back to the join point.
- **Validate before proposing**: every `edge.from`/`edge.to` references a real step
  `id`; every `kind` is in the table; the graph is connected (no orphan steps); every
  `router` has ≥2 labelled outgoing edges. Fix any violation before Step 3.

### Step 3 — HITL gate (always)

The workflow file is a **`workflow`-class artifact** under `write-policy` — it is
**always proposed first, at every autonomy tier** (ghost/assisted/autonomous). Show
the full composed JSON as one diff and get explicit approval. On approval, write it:

- **File-first (default, no server needed):** write `.systemix/workflows/<slug>.json`
  directly with the shape above.
- **If the dev app is running:** `POST /api/workflows` with the body — the route wraps
  it with `id`/`version`/timestamps via `saveWorkflow`. (Do **not** use
  `/api/workflows/save`; that is a divergent legacy `{nodes,edges}` shape the graph
  does not read.)

Never write without approval; never edit an existing workflow silently — a change is a
new proposal.

### Step 4 — Report

Confirm the saved path and how to see it: the workflow renders in the Atlas StepNode
graph, and its `steps`+`edges` can be pasted into an experiment's `workflow`
frontmatter to draw that experiment's flow. Suggest the natural next move (wire it to
an experiment, or hand a runnable version to `/atlas`).

## Guardrails

- **Propose-only**: the workflow file is always an HITL write, at every autonomy tier.
- **Valid vocabulary only**: `kind` must be one of the seven StepKinds; edges must
  reference real step ids; routers must have labelled branches.
- **One shape**: emit `steps` + `edges` (the shape `toFlow`/StepNode consumes). Do not
  invent a second workflow shape or use the legacy `/api/workflows/save` `{nodes,edges}`
  path.
- **Reuse, don't reinvent**: compose existing `.claude/skills/` as `tool`/`agent` steps
  before writing generic ones.
- **Compose, don't execute**: this skill authors a workflow to *see*; it does not run
  it. For an executable multi-agent loop, that's `/atlas`.
