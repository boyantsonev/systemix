# Per-persona workflows + parallelism — the build behind the vision

The marketing claims per-persona operational loops and parallel workflows built from skills. Today those are **structure + vocabulary, not runtime.** This is the honest build plan.

## What exists to build on

- **Storage:** `src/lib/workflow/persistence.ts` (`PersistedWorkflow` → `.systemix/workflows/*.json`), with `saveWorkflow` / `listWorkflows` / `loadWorkflow` / `deleteWorkflow`.
- **API:** `POST /api/workflows` already saves one.
- **Step vocabulary (fixed):** Input · Agent reasoning · Router · **Parallel coordinator** · Tool call · HITL · Output (`docs/feature/systemix-rework/app-three-layers.md`). The catalog was already conceived **per persona** (persona tabs).
- **Authoring skill:** `/build-workflow` produces a `steps`+`edges` data artifact the Atlas graph draws (not executable); `/atlas` generates a `.claude/workflows/<slug>.js` from a template that wraps `systemix loop`.
- **Rendering:** the Atlas StepNode graph + the portable `/workflow-artifact`.

## The gaps

1. **No executor.** `PersistedWorkflow.steps` is drawn, never run. `src/lib/workflow/engine.ts` is a sequential app-side stepper (overlaps the Ralph runner — see `architecture-simplification.md` #2). The atlas template's `agent()/pipeline()` primitives live in an external runtime, never instantiated (`.claude/workflows/` is empty).
2. **No parallelism.** `sweepLoop` is a sequential `for … await`; `engine.ts` is sequential; the only `Promise.all`/`pipeline()` lives in the un-instantiated atlas template. `"parallel"`/`"parallelization"` are diagram Pattern/StepKind names only.
3. **No per-persona binding.** Personas share one loop + one generic pipeline; nothing ties a workflow (or a signal) to a persona in code beyond the copy shipped this pass.

## Proposed build (staged)

1. **One canonical executor.** Extend the Ralph runner (or fold `engine.ts` into it) to execute a `PersistedWorkflow.steps` DAG — one action per step, files-as-state, HITL at the gate steps. Reuse the existing card-writing path.
2. **A real parallel step.** Implement the "Parallel coordinator" StepKind: fan out independent steps (e.g. pull PostHog + run drift concurrently) with `Promise.all`, join, continue. Start with the safe, idempotent reads.
3. **Per-persona workflows.** Bind a `PersistedWorkflow` to a `persona` tag (align with `PERSONA_TAG` in `personas.ts`). Seed one real workflow per persona (marketer: init→write-variants→measure→evaluate; designer: interview→drift→approve; agent: read→act→write-back→HITL). Render them in the per-persona catalog + the meta-lane view.
4. **Agent-as-actor runtime.** The agent's automated loop (read context → act → write evidence → yield) is the same executor with the MCP door; the first genuinely-unattended producer of evidence.

Only after (1)–(2) land can the product UI show a *running* workflow without contradicting `current-state-vs-vision.md`. Until then the diagrams stay architecture, the feeds stay real.
