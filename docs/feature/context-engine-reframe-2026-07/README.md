# Context-engine reframe — 2026-07

Systemix repositioned as **the design-system context engine — run by workflows built from skills.** One meta learning-loop drives the product's self-improvement; five personas (business, design, engineer, marketer, and **agent as a first-class actor**) each have their own job, operational loop, setup, and data-flow, and each feeds the meta-loop.

## Why

Prior feedback: Systemix read as *a concept* trying to be two products — a hypothesis-validation loop (founders/vibe-coders/growth) **and** a design-system fixer (drift/tokens/slop). The `agentic-loop-thesis` DIVERGE work (DIV-2, HIGH confidence) already resolved these as **one job at three zoom levels**. The reframe makes that explicit and gives each persona a first-class place in one loop.

## The locked positioning rules (the guardrail)

1. **Keep** main's "AI-native design system that learns" as the recognizable category and the running hero A/B (`landing-rebrand-hifi-2026-07`). Never edit `hero.variants` / `LandingHero` / the hero `SectionTrack`.
2. **Add** "context engine" as the mechanism, the 6-step meta-loop, and the 5-persona "one architecture" spine (`audiences`).
3. **Claim the full architectural vision** in marketing (parallel workflows, per-persona loops, context engine) — but the **product feeds** (`/experiments`, `/config`, drift, `LiveLoopProof`) must keep showing **real state**. No fabricated running workflows in product UI. The meta-loop diagram uses concrete file nouns and sits beside the live feed so the vision and the honest proof coexist.
4. **Gating, payment, and parallel-workflow runtime are unbuilt.** All pricing CTAs resolve to mailto/command today. Copy must not imply instant automated delivery beyond what email honors.

## What shipped this pass (copy + diagram + personas + docs)

- The 6-step meta-loop diagram (`src/components/loop/LoopDiagram.tsx`, `variant="meta"` with per-step persona owner chips + `highlightPersona`; `variant="operational"` keeps the honest 4-step loop for the docs).
- `personas.ts` extended with `job / loop / setup / signals / feedsMeta / metaStep`; the **agent** persona made a first-class actor; new render blocks + a per-persona meta-lane view on `/for/*`.
- Pricing re-mapped to the 4 EUR tiers; the build-hours table replaced with a per-persona value table.
- Positioning layered: `audiences` → "context engine", the meta diagram on the landing, a new `content/docs/concepts/the-meta-loop.mdx`.

## The docs in this bundle

| File | What it is |
|---|---|
| `conceptual-model.md` | the 6-step meta-loop, per-persona jobs/loops, agents first-class |
| `current-state-vs-vision.md` | **the guardrail** — ships-today vs may-claim; check every claim here |
| `architecture-simplification.md` | the cruft + cleanup plan (later builds) |
| `pricing-packaging-reorg.md` | the €99 gating/packaging plan (unbuilt) |
| `audit-productization.md` | the €249 automated audit plan (engine exists, delivery unbuilt) |
| `per-persona-workflows-and-parallelism.md` | the real build behind the vision |
