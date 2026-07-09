# Current state vs. vision — the guardrail

The founder chose to **claim the full architectural vision** in marketing. This file keeps that honest: it names exactly what ships today vs. what the copy claims, so any "claim" line on the landing/docs is checkable here. Rule: **marketing may claim the architecture; the product UI must not fabricate it.**

## The load-bearing distinction

- **Marketing surfaces** (landing `audiences`/`TheLoop`, `/kit`, `/audit`, `/for/*` copy, the meta-loop diagram) may describe the complete model: context engine, one meta-loop, five personas each with a loop, parallel workflows built from skills.
- **Product surfaces** (`/experiments`, `/config`, `/contract/memory`, `LiveLoopProof`, the drift feed) show **real files, real state** — no invented running workflows, no fake evidence. The meta-loop diagram is honest-by-construction: its nodes are concrete file nouns (`queue.json`, `experiments/<id>.mdx`, `LEARNINGS.md`), and `LiveLoopProof` sits directly below it.

## Ships today (real)

| Claim | Reality |
|---|---|
| Files-as-memory context layer | ✅ Real — `experiments/`, `LEARNINGS.md`, `contract/`, `.systemix/`, atomic writes, graceful degradation. |
| The operational loop runs daily | ✅ Real — `packages/cli/src/lib/loop.js` Ralph runner: pull PostHog evidence → evaluate thresholds → queue a close-proposal card. Never closes. |
| The autonomy/HITL gate | ✅ Real — `src/lib/contract/write-policy.ts` (one enforcement table, UI derived from it). |
| Three doors (CLI/MCP/skills) over the same files | ✅ Real. |
| The €249 audit *report* | ✅ Engine exists — `readiness-audit/SKILL.md` (ODI 0–100, 6 dimensions). |
| Every skill free, installed by `init` | ✅ Real (all MIT, in the public npm tarball). |

## Claimed but not yet built (roadmap)

| Claim | Reality | Where scoped |
|---|---|---|
| Per-persona **operational loops** as running software | Net-new structure; today the personas share one loop, differentiated by copy + door. The `/for/*` "your loop" blocks describe the intended loop, not a per-persona runtime. | `per-persona-workflows-and-parallelism.md` |
| **Parallel workflows** | Zero runtime today — `"parallel"` is diagram/step vocabulary + an un-instantiated generator template. | same |
| **Workflows built from skills**, executed | `PersistedWorkflow` storage + `POST /api/workflows` exist; there's no executor; `.claude/workflows/` is empty; MCP `list_workflows`/`get_workflow` read a non-existent file. | `architecture-simplification.md` |
| **€99 downloadable Kit** | No gating exists (all skills MIT, in the public tarball); the "purchase" is a mailto. The download must be delivered manually until checkout + a private artifact exist. | `pricing-packaging-reorg.md` |
| **€249 automated, 24–48h** audit | The report engine exists; the *automation/SLA/payment* around it does not (mailto + human runs the skill). | `audit-productization.md` |
| Agent as a running **data-producing actor** | The framing is first-class; the automated agent loop that produces evidence unattended is the same net-new build as the per-persona loops. | `per-persona-workflows-and-parallelism.md` |

## The copy honesty line

- `/kit` says "download" but fulfillment is a mailto today — deliver the artifact manually until checkout ships. Don't promise instant download.
- `/audit` says "emailed in 24–48h" — that SLA is a human commitment, honored by hand until automated. Keep it a promise a person can keep.
- The landing may say "the context engine · one loop · every persona" — all true as architecture. It must not render a fake live workflow run.
