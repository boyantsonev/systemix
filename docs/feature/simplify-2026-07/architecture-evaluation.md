# Architecture evaluation — honest, 2026-07-08

The founder's question: *"Honestly, I'm not sure if it even works."* This is the
answer, traced through the code, not the marketing.

## What genuinely works today, end to end

The daily cron (`.github/workflows/systemix-loop.yml`, 07:30 UTC) runs
`sweepLoop` (`packages/cli/src/lib/loop.js`):

1. re-reads each running `experiments/<id>.mdx` fresh from disk,
2. pulls real PostHog evidence (HogQL, per-variant counts) and caches it in the
   frontmatter,
3. evaluates it against the thresholds in `systemix.config.yaml`,
4. queues a close-proposal card in `.systemix/queue.json` when the signal
   clears the gate — and **never closes** (closing is human, always).

The feeds are real: `/experiments`, `/contract/memory`, and `/config` render the
actual files, no mocks. Real evidence exists — but tiny (single-digit visitors
in the 30-day window).

## What did NOT exist (before this pass)

The two things the founder actually asked for:

1. **Nothing proposed a new experiment.** Every caller of `createExperiment`
   was human-initiated. "It learns and iterates" was false.
2. **Memory had never turned over once.** `experiments/LEARNINGS.md` was
   literally `*No entries yet.*` — zero experiments have ever closed. The recall
   path (`readLearnings`) existed but only fired when a human ran
   `/init-experiment`.

Both are fixed in this pass: the runner now has a **propose stage**
(`packages/cli/src/lib/propose.js`) that queues an `experiment-proposal` card
when the loop is idle or a fresh learning lands — drafted from `LEARNINGS.md` +
the active goal, never creating the file itself. The flywheel can now complete a
full turn: measure → learn → propose → (you approve) → build → measure…

**But note honestly:** the ledger is still empty. The first real turn happens
when `landing-ai-native-ds-2026-07` or `landing-live-loop-2026-06` closes.
Until then the compounding-memory claim is machinery, not evidence.

## Fixed debts (this pass)

- **Two evidence writers fighting.** `systemix evidence experiment pull` wrote a
  funnel shape without `variants`; the runner requires `variants` and treated
  the other shape as stale — so the two daily crons overwrote each other's
  `evidence-posthog` block. Now both write one canonical shape (`variants` is
  the load-bearing key); pinned by tests.
- **Skills docs drift.** The docs table was hardcoded (header said "Six",
  listed seven). Now generated from SKILL.md frontmatter at build time
  (`src/components/docs/SkillsReference.tsx`).
- **No single diagram.** `src/components/loop/LoopDiagram.tsx` is now THE
  diagram, rendered on the landing and in the docs from one source.

## The surface-area problem

The core the founder cares about is ~650 lines: `lib/loop.js` + `lib/propose.js`
+ `lib/experiments.js`. Around it:

| Surface | Count |
|---|---|
| Vendored skills (3 pipelines) | 44 |
| CLI commands | 26 |
| MCP tools | 27 |
| App API routes | 29 |

The figma-to-code pipeline (19 skills) and the design-system pipeline (11
skills) are parallel products, not the loop. Decision (locked): **demote, don't
delete** — they stay in the repo but leave the product story. Docs and landing
now lead with the loop only; the design system is "an optional adapter."

## Remaining known gaps

- LEARNINGS.md empty until the first close — do it when the evidence is ready,
  even at low confidence, to prove the full turn.
- Proposal drafts are deterministic templates, not synthesis. Good enough to
  close the loop; `/hermes` can enrich a card when accepted.
- Traffic is the real bottleneck: at ~6 visitors/30d no experiment can clear
  the evidence gate honestly. GTM (see gtm-strategy.md) matters more than more
  machinery.
- `evidence engagement pull` (the landing funnel) still writes its own record
  under `contract/engagement/` — separate concern, untouched.
