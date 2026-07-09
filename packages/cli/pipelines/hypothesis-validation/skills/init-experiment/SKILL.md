---
name: init-experiment
description: Start the next experiment end-to-end — frame the bet via tight questions, scaffold via the CLI door (systemix experiment new) and enrich the MDX, wire the metric for real, ship through the existing variant seam, verify, and open a PR. Use before writing any variant code.
disable-model-invocation: false
argument-hint: <experiment-id>
version: "0.2.0"
last_updated: "2026-07-06"
min_cli_version: "1.1.0"
---

# Init Experiment: $ARGUMENTS

## Purpose

Take the next bet from an idea to a running, measured, PR'd experiment in one
motion. The experiment MDX in `experiments/` is the contract; the ship is only
done when the declared metric actually fires and the change is up for review.

**You never merge.** The PR is the HITL gate — a human ships it.

## Steps

### Step 0a — Check for a runner proposal

The daily runner queues an `experiment-proposal` card in `.systemix/queue.json`
when the loop is idle or a fresh learning landed (it proposes; it never creates
the file). Check for one first:

- Read `.systemix/queue.json` for a card with `type: "experiment-proposal"` and
  `status: "pending"`.
- If present, offer it to the user as the prefilled draft: its `goal`,
  `suggestedId`, `draftHypothesis`, `rationale`, and `sourceLearnings` seed
  Steps 1–2 (the user edits, confirms, or discards — never auto-accept).
- Once the experiment file is created from it, mark the card
  `status: "accepted"` with `resolution: { experimentId: "<id>" }` and
  `resolvedAt`. If the user discards it, mark it `status: "dismissed"` — a
  dismissed proposal's learnings stay cited, so the runner won't re-propose the
  same bet.
- No card → continue normally.

### Step 0 — Recall prior learnings

Before authoring, pull the loop's recent memory so this experiment starts from
evidence, not a blank slate (curated recall — don't load the whole ledger):

- MCP: `experiment_learnings({ recent: 5 })`
- CLI: `systemix experiment learnings --recent 5`
- Lineage of a specific prior bet: `experiment_learnings({ for: "<id>" })` / `--for <id>`

Surface anything related to the user ("we already tested X — it promoted/killed;
confidence Y"). If this experiment builds on a prior learning, note that
learning's `[<id>]` — `/close-experiment` records the backlink (`Used by:`) when
this one closes. If the ledger is empty (a fresh instance), say so and continue.

### Step 1 — Frame the bet (tight questions, one round)

Ask these together, then reflect the frame back before touching files:

1. **The bet + section** — what is the one-sentence bet, and which surface does
   it change? (e.g. `hero`, `pricing`, `onboarding`). Construct the ID:
   `<section>-<short-description>-<YYYY-MM>` (or use `$ARGUMENTS`).
2. **Fate of running experiments on the same surface** — run
   `systemix experiment audit`. If a running experiment owns this surface,
   decide explicitly: does the new experiment take over the surface's
   attribution (repoint tracking to the new ID), or must the old one close
   first? A prior experiment's *site-wide* signal (e.g. a global
   `book_a_call` event) can keep running untouched — only the contested
   surface needs an owner.
3. **Measurement approach** — real A/B split or ship-and-compare? Be honest
   about traffic: at a handful of visitors per month a split cannot resolve,
   so ship variant_b at 100% and compare the before/after window
   directionally. Say which one you chose in the MDX.
4. **ICP + JTBD** — reuse the existing `icp`/`jtbd` values from prior
   experiments whenever the bet allows; LEARNINGS compound only when the same
   ICP strings recur across bullets.
5. **Which goal it serves** — run `systemix goal list`. If an existing goal
   (status `active`/`validated`) fits, use its id; if none does, use `/new-goal`
   (or `systemix goal new`) to declare one first. Don't leave an experiment
   goal-less by default — the goal is what LEARNINGS compound toward.
6. **Review-by window** — when is the evidence worth reading? (typically
   created + 30 days; low traffic → longer).
7. **Ship scope** — which files/copy does variant_b actually touch? Name the
   seam (see Step 4) and anything explicitly out of scope.

### Step 2 — Scaffold via the CLI door, then enrich

Scaffold with everything the CLI can set (one command, no hand-rolled frontmatter):

```
systemix experiment new <id> \
  --section <section> --icp <icp> --jtbd "<jtbd>" --goal <goal> \
  --hypothesis "<if X then Y measured by Z>" \
  --given "<the situation the visitor/user is in>" \
  --conclusion "<the win-state in plain words>" \
  --metric <primary-metric> --review-by <YYYY-MM-DD> \
  --control "<what exists today>" --variant "<the proposed change>"
```

Then enrich `experiments/<id>.mdx` with what the CLI can't set — model it on a
prior complete experiment in `experiments/`:

- **`workflow:` frontmatter** — the AI-workflow DAG this experiment runs
  (`steps` with `id/kind/label/note` and optional `agent`, plus `edges`).
  `kind` ∈ `input | agent | tool | human | output`; the decide step is always
  `kind: human`.
- **Body sections**, replacing the one-line stub:
  - `## Why this hypothesis` — the rationale; cite prior learnings by `[<id>]`.
  - `## Given` — the concrete situation (who lands where, with what context).
  - `## The AI workflow` — the DAG in prose, including the measurement
    approach chosen in Step 1 ("ship-and-compare, not a split, because …").
  - `## Measurement notes` — exactly which events prove the metric, any
    baseline approximations for the before-window, and how neighboring
    experiments' signals stay uncontaminated.
  - `## Conclusion` — the win-state.
  - `## Decision criteria` — what `promote` / `iterate` / `kill` each mean
    *and what happens next* in each case.

### Step 3 — Wire the metric for real

The `posthog-event` in the frontmatter is a claim; make it true:

1. **Every surface the variant changes must fire the event.** Grep the
   components the variant touches for `capture(` — if a CTA on the surface
   doesn't fire the declared event, add it. (In the Systemix POC,
   `hero_cta_click` fired only on the GitHub link; the install CTA in
   `LandingEvents.tsx` had to fire it too, disambiguated by a `cta` property.)
2. **Tag every capture with the variant** (`variant: <key>`) so results can be
   segmented even in a ship-and-compare.
3. **Repoint the surface's attribution to the new experiment** — whatever
   section-level tracking wraps the surface (in the POC: the hero's
   `SectionTrack experimentId` in `src/app/page.tsx`) must reference the new
   experiment's ID, per the Step-1 decision.
4. Record it in the contract: `systemix experiment measure <id> --event <name>`
   (or edit `posthog-event:` directly).

For deeper instrumentation work, hand off to `/measure`.

### Step 4 — Ship through the existing variant seam

Don't fork components — ship through the content-level variant seam the
codebase already exposes (in the POC: `hero.variants` in
`src/lib/landing/content.ts`, keyed `control` / `variant_b`):

- **`control` keeps the old copy verbatim** — it's the record of what was
  live, and the seam for a future real split.
- `variant_b` gets the new copy. In ship-and-compare, everyone gets
  `variant_b`; note that in a comment on the seam.
- Keep the MDX `variants:` frontmatter and the code seam telling the same story.

For copy iteration on an already-running experiment, use `/write-variants`.

### Step 5 — Verify, then open a PR (never merge)

1. Run the project's tests and build (in the POC: `npm test` + `npm run build`).
2. Load the changed surface in the browser: the variant renders, the events
   fire (watch the network/console), no errors.
3. Confirm the contract file parses: `systemix experiment list` shows the new
   ID as `running`.
4. Open a PR whose description states the bet, the metric + measurement
   approach, and the review-by date. **Do not merge it** — the human decision
   to ship is part of the experiment.
5. After merge, the loop takes over: the runner / `/growth-audit` evaluates
   evidence, and `/close-experiment` records the decision.
