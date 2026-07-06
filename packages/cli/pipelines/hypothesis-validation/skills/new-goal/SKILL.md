---
name: new-goal
description: Declare a new goal in experiments/goals/ — the north-star outcome a set of experiments pursues. Humans give goals; the engine never self-assigns one. Use before framing an experiment that doesn't yet have a goal to serve, or when the instance's priorities change.
disable-model-invocation: false
argument-hint: <goal-id>
version: "0.1.0"
last_updated: "2026-07-06"
min_cli_version: "1.1.0"
---

# New Goal: $ARGUMENTS

## Purpose

Create a new goal MDX file in `experiments/goals/`. A goal is the outcome an
experiment is in service of (a KPI, a business result) — it's declared by a
human, never inferred or self-assigned by the engine. Experiments link to a
goal via their own `goal:` frontmatter field; nothing on the goal file itself
needs to be hand-maintained as experiments are added — the link and the
experiment count are both derived live from the experiment side, at read time.

## Steps

### Step 0 — Check for an existing goal first

List current goals — CLI: `systemix goal list`. If the outcome you're about to
frame an experiment for is already covered by a goal (status `active` or
`validated`), use that goal's id instead of creating a near-duplicate. Only
create a new goal when the outcome is genuinely distinct.

### Step 1 — Determine the goal ID

If `$ARGUMENTS` is provided, use it as the goal ID (short kebab-case, e.g.
`consultancy-leads`, `signup-conversion`). Otherwise ask the user for a short
id and a human-readable title.

### Step 2 — Collect the goal's shape

Ask the user:
1. **Given** — one or two sentences: why this goal exists, what's true about
   the product/market that makes it worth pursuing.
2. **ICP** — who the goal is about (e.g. `pre-pmf-founder`); may differ from
   any single experiment's ICP if the goal is broader.
3. **Goal type** — freeform, e.g. `surface` (a page/section converts better)
   or `business` (a revenue/retention outcome).
4. **Success criteria** — one sentence: what "working" looks like.
5. **Kill-if** — one sentence: the condition under which you'd stop pursuing
   this goal (revisit the ICP, the pitch, or drop it).

### Step 3 — Create the goal

CLI (file-first, no MCP required):

```
systemix goal new <goal-id> \
  --title "<Human title>" \
  --given "<why this goal exists>" \
  --goal-type <surface|business|…> \
  --icp <icp> \
  --success-criteria "<what working looks like>" \
  --kill-if "<when to stop pursuing it>"
```

This writes `experiments/goals/<goal-id>.mdx` with `status: active` and an
`order` appended after the highest existing goal (keeps the goals index sorted
without hand-picking a number).

### Step 4 — Confirm and hand off

Read the created file back and confirm with the user:
- File path, goal ID, status: `active`
- Next step: frame an experiment against it —
  `systemix experiment new <experiment-id> --goal <goal-id>` or `/init-experiment`
  and tell it which goal this experiment serves.

## Updating an existing goal

There's no CLI mutator today — a goal's `status` (e.g. `active` → `validated` /
`parked` / `killed`), `success-criteria`, or `kill-if` are edited by hand,
directly in `experiments/goals/<goal-id>.mdx`. It's a plain file; no cache to
invalidate.
