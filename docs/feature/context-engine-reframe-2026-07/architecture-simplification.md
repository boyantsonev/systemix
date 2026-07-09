# Architecture simplification plan

The honest core is good and should be kept: files-as-memory, the Ralph runner, the write-policy/autonomy gate, atomic tmp+rename writes, one card-writing path. The cruft below accumulated around it. Each item is tagged **[Zero-risk]** (safe now) or **[Later-build]** (own PR).

## 1. "contract" means three unrelated things — [Later-build]

The single biggest naming liability for a "context engine" reposition:
- root `contract/` — a design-system **docs tree** (tokens/components/engagement MDX)
- `src/lib/contract/` — **TypeScript readers/writers** (code, no data)
- the **write-policy artifact vocabulary** — `contract` as a policy noun

Proposal: pick one meaning per layer and rename the other two. Candidate: keep `src/lib/contract/` (code), rename the root docs tree to `design/records/` or fold it into `design/`, and rename the policy noun to "artifact". A rename ripples through imports, MDX links, and the app — do it as its own PR with a codemod, not inline.

## 2. Two-plus workflow engines → pick one canonical — [Later-build]

- `packages/cli/src/lib/loop.js` — the Ralph runner (real, working). **Recommend canonical.**
- `src/lib/workflow/engine.ts` — an app-side sequential step engine persisting to `.systemix/runs/`; overlaps the runner's job, no shared code.
- the atlas `loop.template.js` — a generator template whose `agent()/pipeline()` primitives live in an external Claude Code runtime, never instantiated here.

Proposal: declare the Ralph runner the engine; mark the app engine + atlas template for consolidation into it (or deletion if unused).

## 3. Dead / vestigial readers to cut — [Zero-risk to delete, do in a follow-up]

- MCP `list_workflows` / `get_workflow` (`packages/mcp-server/src/tools/workflow.ts`) read a **non-existent** `src/lib/data/workflows.ts` (with a 200-line regex TS-parser fallback for a file that isn't there) and a `.systemix/workflows.json` snapshot that also isn't there — always "No workflows found."
- `.systemix/atlas.catalog.json` — `{"workflows": []}`, never populated.
- `agent-state.json` — 7 vestigial design-system-era agents (ada/flux/scout/…), 0 runs, unrelated to the loop's Hermes vocabulary.
- `src/lib/workflow/skill-chain.ts` — `SKILL_CHAINS` describe design-system pipelines that no longer match the shipped loop skills; nothing executes them (static UI metadata).

Cut-safety: these are read-only surfaces with no writers depending on them. Removing them changes no live behavior; verify by grep for importers first.

## 4. The fragile 3-writer Memory coupling — [Later-build]

The most load-bearing invariant is the LEARNINGS Memory-line template, emitted **byte-identically** by three separate packages coupled only by convention + one test:
- `packages/cli/src/lib/experiments.js` `appendLearning`
- `packages/mcp-server/src/tools/experiment.ts` `appendLearning`
- `src/lib/contract/memory-mdx.ts` `renderMemoryLine`

Proposal: extract a tiny shared package (or have the CLI/app emit via one imported function) so the template has a single source. Guard remains the round-trip test.

## 5. State-dir sprawl — [Later-build, follows #1]

`contract/` · `src/lib/contract/` · `design/` · `experiments/` · `.systemix/`. Once #1 lands, document the canonical map (what each dir owns) in `packages/cli/src/lib/layout.js` and the docs, so "context engine" has one legible storage story.

## Done this pass (zero-risk)

- Fixed `PersonaJtbd` hardcoded H2 (rendered the constant "What changes for you", ignoring `persona.jtbd.heading`).
- Widened `PricingTier.cta.event` to include `"audit_requested"`.
- This documentation.
