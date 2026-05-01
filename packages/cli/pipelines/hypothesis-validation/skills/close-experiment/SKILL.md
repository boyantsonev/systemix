---
name: close-experiment
description: Close a running experiment by recording the result, decision, and confidence in the hypothesis contract. Calls contract_write_hypothesis_result and pushes a synthesis card to the HITL queue for human review. Use when PostHog evidence is decision-ready.
disable-model-invocation: false
argument-hint: <experiment-id>
version: "0.1.0"
last_updated: "2026-04-30"
min_cli_version: "1.1.0"
---

# Close Experiment: $ARGUMENTS

## Purpose

Record the outcome of a running experiment in its hypothesis contract and push a decision card to the Systemix HITL queue. This closes the evidence loop: data flows from PostHog → contract → human decision → codebase action.

## Steps

### Step 1 — Load the experiment

Call MCP tool `contract_get_hypothesis` with the ID from `$ARGUMENTS`.

Display the full hypothesis, variants, and current evidence summary.

### Step 2 — Load the evidence

Call MCP tool `contract_get_evidence` with the hypothesis `section` field to retrieve the latest PostHog data.

Show:
- Total renders
- Per-variant render counts and % share
- Leading variant and lift over control (% difference)
- Confidence estimate: if the leading variant has ≥ 20% lift over control AND ≥ 100 total renders, confidence = `high`. If lift 5–20%, confidence = `medium`. Below 5%, confidence = `low`.

### Step 3 — Determine decision

Map the evidence to a decision:

| Evidence | Decision |
|----------|----------|
| High confidence, variant beats control | `promote` |
| Medium confidence, positive direction | `iterate` |
| Low confidence or no clear winner | `iterate` or `no-action` |
| Variant worse than control, high confidence | `kill` |

Ask the user to confirm: "Recommended decision: `<decision>`. Confirm or override? [y / type override]"

### Step 4 — Collect result summary

Ask for a one-line result summary, e.g.: "Variant B: +34% signup rate, 1,247 total renders, p≈0.03"

Or auto-generate from evidence data if the user confirms.

### Step 5 — Write the result to the contract

Call MCP tool `contract_write_hypothesis_result` with:
- `id`: experiment ID
- `status`: `"complete"`
- `result`: result summary string
- `decision`: confirmed decision
- `confidence`: numeric value (0.0–1.0, derived from lift and sample size)

Confirm the file was updated and display the new frontmatter state.

### Step 6 — Push HITL card

Call MCP tool `push_hitl_task` with:
```json
{
  "type": "synthesis",
  "hypothesis": "<hypothesis statement truncated to 120 chars>",
  "context": "Experiment <id> closed. Decision: <decision>. Result: <result>",
  "recommendation": "<decision>",
  "confidence": <confidence>,
  "component": "<section>"
}
```

This queues the decision for human review in the Systemix dashboard at `/queue`.

### Step 7 — Recommend next action

Based on the decision:

- `promote`: "Apply the winning variant permanently. Run `/write-variants <id>` with the winner text and choose 'apply to source', then delete or archive the losing variant."
- `iterate`: "The direction is promising but inconclusive. Run `/write-variants <id>` to generate a stronger variant and re-run for another 14 days."
- `kill`: "No winner found. Archive this experiment and revisit the ICP or section. Consider running `/init-experiment` with a different framing."
- `no-action`: "Monitor for more signal. Re-run `/growth-audit <id>` in 7 days."
