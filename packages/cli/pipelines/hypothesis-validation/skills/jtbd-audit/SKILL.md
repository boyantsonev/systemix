---
name: jtbd-audit
description: Run a Jobs-to-be-Done + Outcome-Driven Innovation (ODI) analysis on any product — interview the core job, capture desired outcomes in canonical ODI form, score each by importance vs satisfaction, and rank the underserved opportunities. Generalizes docs/product/jobs.yaml (Systemix's own JTBD source of truth) into a reusable methodology; the opportunity ranking seeds what to build and which hypotheses to test. Read-only; any jobs file it would write is proposed for approval.
argument-hint: "[product / feature]"
version: "0.1.0"
last_updated: "2026-07-08"
min_cli_version: "1.1.0"
---

# /jtbd-audit — Jobs-to-be-Done + ODI opportunity analysis

Find where a product is **underserved** and should build next: **$ARGUMENTS**

This packages the method behind `docs/product/jobs.yaml` — the JTBD/ODI analysis
Systemix runs on itself — as a skill you can point at **any** product. It turns a
fuzzy "what should we build?" into a **ranked opportunity landscape**: the outcomes
customers care about most and are least satisfied on. Those opportunities are exactly
what `/init-experiment` should form hypotheses against.

## The method (Ulwick ODI, in brief)

People "hire" a product to get a **job** done. They measure success by **desired
outcomes**. An outcome that is **important** but poorly **satisfied** by today's
solutions is an **opportunity**. Score it:

```
opportunity = importance + max(importance − satisfaction, 0)
```

(importance and satisfaction each 1–10 — the same formula and scale as
`docs/product/jobs.yaml`.) Higher = more underserved = build here first.

## Steps

### 0. Recall context
- If `docs/product/jobs.yaml` (or a `product/jobs.*`) exists, read it — this may be an
  **update**: reuse its jobs/outcomes as the starting point and re-score, don't restart.
- Otherwise start fresh from the interview.

### 1. Frame the job (interview)
Ask (AskUserQuestion where enumerable, free text otherwise):
- **Job executor** — who is getting the job done (the persona)?
- **Functional job** — the core task, phrased job-first and solution-agnostic:
  *"When ⟨situation⟩, I want to ⟨goal⟩, so I can ⟨outcome⟩."* Avoid naming any product.
- **Emotional / social jobs** — how they want to *feel*, and how they want to be *seen*.
- **Job steps** — the sequence they move through (define → locate → prepare → confirm →
  execute → monitor → modify → conclude). For each, note the current-state pain.

### 2. Capture desired outcomes (canonical ODI form)
Write **8–15** outcome statements, each in the strict ODI syntax so they're measurable
and solution-agnostic:

> **Minimize** the **⟨time | effort | likelihood | frequency⟩** it takes to ⟨do X⟩
> **when/that** ⟨context⟩.

Mirror the shape in `jobs.yaml`'s `odi_outcomes` (`id`, `statement`, …). Bad: "make it
easy to find decisions." Good: *"Minimize the time it takes to retrieve the rationale
behind a prior decision when a related decision must be made."*

### 3. Score importance + satisfaction
For each outcome, score:
- **importance** (1–10) — how much the executor cares about this outcome.
- **satisfaction** (1–10) — how well today's solutions deliver it.
Compute **opportunity** with the formula above. **Derive from evidence** — interviews,
support tickets, reviews, analytics. If you're estimating, say so (tag `estimated`,
exactly as `jobs.yaml` does) — never launder a guess as a finding.

### 4. Rank + classify
Sort by opportunity, descending. Classify each: **under-served** (opportunity high →
build here), **appropriately-served** (leave it), **over-served** (importance low, high
satisfaction → possible simplification / cost to cut). The top under-served band *is*
the build list.

### 5. Report — and (optionally) persist
Present the opportunity landscape. If the operator wants it captured, propose a
`jobs.yaml`-shaped file (jobs + `odi_outcomes` + a changelog entry) — a **proposed
write, HITL**, never auto-written.

## Output format

```
# JTBD / ODI Opportunity Audit — <product>
Job: When <situation>, <executor> wants to <goal>, so they can <outcome>.

## Opportunity landscape (most under-served first)
| ID    | Desired outcome (ODI)                                   | Imp | Sat | Opp | Class |
| ODI-1 | Minimize the time to retrieve the rationale behind …    |  9  |  2  | 16  | under-served |
| ODI-2 | Minimize the likelihood a result is disconnected from … |  8  |  2  | 14  | under-served |
| …     |                                                         |     |     |     |              |

## Top opportunities → what to test
1. ODI-1 — <one line on the bet it implies>  → /init-experiment
2. ODI-2 — …
```

## Guardrails

- **Evidence, not vibes.** Importance/satisfaction come from research; estimates are
  labelled `estimated` (as in `jobs.yaml`). No bare numbers.
- **Solution-agnostic outcomes.** Outcomes describe the job's success metric, never a
  feature. If a statement names your product, rewrite it.
- **Read-only / a record.** The analysis writes nothing on its own. A `jobs.yaml` is a
  proposed, HITL write.
- **Feeds the loop.** The top opportunities are inputs to `/init-experiment`, not
  decisions — you still test the bet before you build it.
