---
description: Trigger Hermes to synthesize evidence from an experiment and queue a HITL decision. Engine = Claude Code (no local model).
argument-hint: [experiment-id or "all"]
---

# /hermes — Run Hermes Synthesis

Hermes is **you** — Claude, reading the experiment against its evidence and prior
decisions, then queuing a recommendation for a human to approve. There is **no local
model / Ollama** (ADR-019: engine = Claude Code). Evidence numbers are pulled
deterministically from PostHog by the CLI; the reasoning is yours.

## Usage
```
/hermes landing-live-loop-2026-06
/hermes all   # every running experiment with a wired posthog-event
```

## Steps

1. **Resolve the target(s)** — read `experiments/<id>.mdx` (or, for `all`, every
   `experiments/*.mdx` with `status: running` and a non-null `posthog-event`).

2. **Pull fresh evidence (deterministic — no LLM):**
   ```bash
   npx systemix evidence experiment pull --experiment <id>   # or: --all
   ```
   This queries PostHog with `POSTHOG_API_KEY`/`POSTHOG_PROJECT_ID`, writes the
   `evidence-posthog` block into `experiments/<id>.mdx`, and queues a pending
   `experiment-validation` card in `.systemix/queue.json`. With no creds it queues an
   honest `configure-posthog` card instead — never invents numbers.

3. **Synthesize (this is the Hermes reasoning):** read the experiment frontmatter +
   prose, the `evidence-posthog` block just written, and any prior `## Production
   Evidence` / LEARNINGS history. Judge the evidence against the decision criteria in
   the contract. Do **not** invent numbers beyond what the block reports.

4. **Enrich the queued card** (optional): update the pending card's `context`
   (your one-paragraph read) and `proposal` (`promote` / `iterate` / `kill` with a
   one-sentence rationale) in `.systemix/queue.json`. Keep `confidenceLevel` honest —
   it is data-strength (sample size), not statistical significance.

5. **Report**: point the human to **Home (`/config`)** to approve or reject. Approval
   writes `result`/`decision`/`confidence` back to `experiments/<id>.mdx` and appends a
   cited line to `experiments/LEARNINGS.md`. Nothing lands without a human approve
   (ghost autonomy).

## Notes
- No Ollama, no API key beyond PostHog's read key. Synthesis is Claude + a deterministic
  PostHog read.
- The full close path (write-back + LEARNINGS) is the `/config` queue or
  `/close-experiment`; `/hermes` prepares the card, the human decides.
