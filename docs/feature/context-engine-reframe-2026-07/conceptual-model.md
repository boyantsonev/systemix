# The conceptual model

## One sentence

> Systemix is the design-system **context engine** — the one place decisions, tokens, and evidence are written down, so every persona and every agent works from the same source. Design systems always connected these roles; this one is AI-native, and it improves itself on a loop.

## The meta-loop (self-improvement; emits ideas + HITL cards)

Six steps, then it feeds its own next hypothesis. Each step is owned by the people (and agents) closest to it; two steps wait for a human.

| # | Step | What happens | Owners | Gate |
|---|---|---|---|---|
| 1 | **Hypothesis** | the next bet, framed (`queue.json`) | Business · Marketing · Design | ✋ you approve before build |
| 2 | **Build** | prototype it, together (`experiments/<id>.mdx`) | Engineering · Design · Business | |
| 3 | **Measure** | real numbers, pulled (PostHog) | Marketing · Business · Design | |
| 4 | **Evaluate** | does it clear the bar? | everyone, incl. agents | ✋ you approve the decision |
| 5 | **Ideate** | what we learned, what's next (`LEARNINGS.md`) | Business · Design · Marketing | |
| 6 | **Document** | synthesized, written back (`LEARNINGS.md` · contract) | Engineering · AI agents · Design | |

The **operational loop** (Propose → Build → Measure → Learn) is one turn of this, and the part that runs on a daily cron today (`packages/cli/src/lib/loop.js`).

## The five personas — each a participant, not just an audience

Every persona has its own **job**, **operational loop**, **setup**, and **data-flow** (what it puts into the loop and reads back). Encoded in `src/lib/landing/personas.ts` and rendered on `/for/<persona>`.

| Persona | Job | Produces → | ← Consumes | Owns (meta-step) |
|---|---|---|---|---|
| **Business** | frame the bets, make the calls | goals, close decisions | weekly synthesis, LEARNINGS | Hypothesis · Ideate |
| **Design** | hold the rationale, catch the drift | rationale, token decisions, drift resolutions | drift scores, live-site scrape | (touches all) |
| **Engineering** | build it, keep the code true | tokens, contracts, the built variant | drift reports, evidence, decisions | Build · Document |
| **Marketing** | run experiments, read numbers | experiments, variant copy, conversion evidence | PostHog numbers, close proposals, the ledger | Measure · Evaluate |
| **AI agents** | operate the system as machine-readable context | evidence records, events, HITL cards | tokens, contracts, drift, learnings | Evaluate · Document |

### Agents as first-class

The pivotal change: the **agent** is a participant with its own loop (read context → act → write evidence back → yield to HITL), not merely an MCP integration surface. It reads the context layer via `contract_get_*`, acts by opening/measuring experiments, and writes back via `contract_write_evidence` / `emit_event` / `push_hitl_task`. It appears as an **owner** on the meta-loop diagram. Guardrails hold: agents propose, humans close.

## Why this unifies the two identities

The hypothesis-validation loop and the design-system fixer are the same job at three zoom levels (mechanism → outcome → system): evidence permanently co-located with the artifact → the next decision is higher quality → agents read verified ground truth and act correctly (see `docs/product/jobs.yaml` DIV-2 / JOB-001). A design system is, and always was, the connective tissue between these personas. The context engine is the AI-native form of that tissue.
