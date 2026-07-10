# Recommendation — landing-rework

**Wave:** DIVERGE
**Feature ID:** landing-rework
**Date:** 2026-04-29
**Status:** Ready for founder review

---

## Scores Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | P — MCP/Developer First | 4.35 |
| 2 | C — Docs-as-Landing | 4.28 |
| 3 | A — Team Roster | 4.15 |
| 4 | E — Minimal One-Screen | 4.05 |
| 5 | M — Diagram Hero | 3.48 |
| 6 | S — Narrative Loop | 3.33 |

---

## Top 3 Options

### Option P — MCP/Developer First — Score 4.35

**Why it scores well:** Developer ICPs don't read landing copy. They look for the install command, then decide. Option P makes the install command the hero and defers the product explanation to the post-install sequence. It scores maximum on Subtraction and Speed-as-Trust — the two criteria most relevant to the actual buy decision for Tier 1 (AI-native design engineers already running Claude Code + PostHog). No new visual design assets required.

**Core trade-off:** The loop, the agents, the hypothesis validation — all deferred. A designer ICP visiting cold traffic gets no explanation of the product before seeing a code block. The landing converts the developer ICP efficiently but likely fails the designer ICP.

**Key risk:** The "install to understand" pattern requires that the post-install experience delivers the value explanation the landing withholds. If the onboarding sequence after `npx systemix init` is not excellent, the landing converts installs but not retained users.

**Hire criteria:** Choose this option when the primary distribution channel is GitHub trending, Hacker News, or Cursor extension store — contexts where the buyer is a developer arriving with high intent and zero need for persuasion about the problem.

---

### Option C — Docs-as-Landing — Score 4.28

**Why it scores well:** This option directly addresses the root confusion: the product explanation lives in docs, not the landing. By making the landing IS the explanation — specifically the 6-step hypothesis validation loop from `/docs/concepts/hypothesis-validation/page.tsx` — it gives designers and developers the context they need at the moment they arrive. Scores maximum on Concept Count (concepts are introduced in action, not as abstract nouns) and Progressive Disclosure (sequential steps are inherently staged).

**Core trade-off:** More content on the landing means longer time to CTA. The visitor who wants to install immediately has to scroll past six steps before reaching the install command — unless CTAs are embedded at strategic points in the loop (after step 3, after step 5).

**Key risk:** If the step-by-step structure feels like documentation (dry, academic, tutorial-like), the visitor bounces before the loop closes. The copy must feel like a product story, not a manual.

**Hire criteria:** Choose this option when the primary distribution channel is paid search, LinkedIn, or word-of-mouth referrals from designers — contexts where the buyer arrives with moderate intent and needs the product explained before they'll act.

---

### Option A — Team Roster — Score 4.15

**Why it scores well:** "Your design system team" directly implements the founder's repositioning direction. It frames the product as a team of agents with roles (Growth Agent, Ad Creative Agent, Hermes, HITL) rather than a tool with features. This maps onto how the Tier 1 buyer already thinks about their agentic setup. It collapses the complexity of "Hermes + skills + agents + contracts + HITL" into a single organizing metaphor. No critical weakness across any criterion.

**Core trade-off:** The team metaphor requires the visitor to trust that the agents described are real and useful. If the product's agent capabilities are still in development or inconsistent, the metaphor oversells. Also: "your design system team" is a reframing that requires updating the tagline, the nav, possibly the product name — scope creep risk.

**Key risk:** The team metaphor works if the agents are differentiated by role in a way that's immediately legible. If the role cards are too abstract ("Growth agent reads PostHog data" — okay, but what does that mean for me?), the metaphor collapses into jargon.

**Hire criteria:** Choose this option when the founder is ready to commit to the "platform of agents" repositioning and has a product roadmap where each agent role is shippable within a release cycle. This is the right long-term direction but carries more repositioning weight than the other options.

---

## Recommendation

**Proceed with a hybrid of Option C (Docs-as-Landing) as the primary structure, with Option P's hero mechanic above the fold.**

The scoring shows P at 4.35 and C at 4.28 — a gap of 0.07, which is within range of meaningful weight variance. The decision between them is not mathematical; it is strategic. Here is why the hybrid is the correct call:

**The developer ICP and the designer ICP arrive at the same landing from different contexts.** P converts the developer but abandons the designer. C converts the designer but delays the developer. The synthesis: lead above the fold with the install command (P's hero mechanic) AND a one-line problem statement that hooks the designer ("Every design decision your team ships is either a hypothesis or evidence. Systemix writes the evidence back to the contract."). Then: immediately below the fold, the loop in 6 steps (C's structure), with the install command embedded again at step 3 (for the developer who is ready) and at step 6 (for the designer who needed the explanation).

This is not a compromise. It is a sequencing decision: the hero satisfies the developer in the first viewport; the loop satisfies the designer in the second and third. The CTA appears at both moments.

**Option A's team metaphor should be incorporated into the section framing, not the hero.** The section that explains the loop steps can introduce "the agents" as a team — the 6 steps become the team's workflow. This captures the founder's repositioning direction without requiring a full rename or overhaul of the brand.

---

## Explicit Answers to Founder's Questions

### What should the new H1 be?

Replace "Every component is a guess until production proves it." with:

**"Your design system learns. Every decision, every experiment, written back to the contract."**

Or the shorter variant:

**"Design decisions that learn from production. Not just from your best guess."**

Rationale: The current H1 ("Every component is a guess") leads with uncertainty — it names a problem state, not a direction. The new H1 leads with the loop's outcome (learning) and the mechanism (written back to contract). It answers the designer's question ("why do I need this?") and the developer's question ("what does it do?") in one sentence. The word "learns" carries the hypothesis-validation value prop without requiring the visitor to already know what hypothesis validation means.

If the founder wants shorter, the single-line H1:

**"Your design system team. Agents that ship, measure, and learn."**

This is the team-roster variant — appropriate if the agent repositioning is being committed to fully.

---

### Should drift detection stay above the fold, move below, or disappear from the landing?

**Move below the fold. Not to section 2 — to section 4 or later.**

The current landing treats drift as a parallel value prop (the Problem section leads with the Storybook/drift framing). The competitive brief is clear: drift detection is the contested axis. It is a feature of the evidence layer, not the lead.

Drift detection should appear in the landing as a supporting detail inside the hypothesis validation loop, not as a standalone section. Specifically: in the loop step that explains "Hermes synthesizes the result," drift detection can be mentioned as part of what Hermes reads — "Hermes reads the result against the contract: past experiments, current drift status, prior decisions." That is the right depth for drift on the landing. It stays in the product. It disappears from above-the-fold positioning.

**The "Storybook tells your agent what exists. Nobody tells it what worked." H2 is the one exception.** This line is strong and should stay — but it works better as a transition header between the loop section and the QualityGate section, not as a standalone section leader. Keep the line. Move the section.

---

### Should the landing use the circular diagram? What does it show?

**Yes, but not as the hero. Use it as a visual anchor in the "How it works" section (step 0 — overview before the 6 steps).**

The founder explicitly asked for "diagrams explaining the loop, similar to the architecture graph but in a circle view." The circular diagram belongs in the product, not as the H1 replacement. Here is why: the loop diagram (Option M) scored 3.48 — it loses on Progressive Disclosure and Concept Count because it shows "how" before the visitor knows "why." As a secondary visual inside a section that has already established "why," it works.

**What the circular diagram should show:**
Five nodes, counterclockwise to signal that it's a feedback loop (not a pipeline):

```
PostHog (measures) → Hermes (synthesizes) → Contract (records) → Agent (reads) → Ships → PostHog (measures again)
```

Each node has a one-sentence label on hover or in a legend below. The diagram communicates "this is a closed loop, not a one-way sync" in under 5 seconds. No competitor shows this. The diagram is the differentiation argument made visual.

**What it does not show:** drift scores, GIGO numbers, Figma node IDs. Those are product details for the design-system page, not the landing.

---

### What's the one-line new tagline if we rename/reframe to "your design system team"?

**"The agents that keep your design system learning."**

Alternative (if the word "agents" is too charged with AI hype for the current moment):

**"Your design system team — built from contracts, skills, and production evidence."**

Or, if staying closer to the evidence-layer brand:

**"The system that turns design decisions into evidence."**

The founder should pick based on whether the "agents as team" repositioning is being fully committed to. If yes: "The agents that keep your design system learning." If no (evidence layer framing stays primary): "The system that turns design decisions into evidence."

---

### How should developer integration be addressed — MCP? CLI? Both?

**Both. In this order:**

1. **CLI as the install moment** (`npx systemix init`) — in the hero. This is the first action. It creates the contract directory, connects PostHog, and starts Hermes. One command, immediate value signal. This is what Option P gets right.

2. **MCP as the integration story** — in the loop section (step 3 or 4). After the visitor understands the loop, explain how their existing editor connects: "Claude Code, Cursor, and any MCP-compatible editor reads the contract via the Systemix MCP server. One install. Works with any model that supports tool calls — not just Hermes."

The question "Is it an MCP server? Is it a plugin?" is answered by this sequencing: "It installs via CLI. It integrates via MCP. It works with any model."

The founder's concern about Hermes lock-in is valid and should be addressed explicitly on the landing: add one line to the MCP integration description — "Hermes is the default. Swap it for any Ollama-compatible model in one config line." This answers the developer's question about local/hosted model flexibility without making Hermes sound proprietary.

---

## What Changes vs. Current Landing

| Element | Current | Recommended |
|---------|---------|-------------|
| H1 | "Every component is a guess until production proves it." | "Your design system learns. Every decision, every experiment, written back to the contract." |
| Tagline above H1 | "The Evidence Layer for design systems" | "Your design system team" OR keep "The Evidence Layer" — decision point |
| Section order | Hero → WorksWith → TwoUseCases → Problem → HowItWorks → Glossary → QualityGate → BottomCTA | Hero → WorksWith → Loop (6 steps, docs-density) → Team/Agents section → QualityGate → Integration (CLI + MCP) |
| Drift above fold | Yes (Problem section is #4, Storybook framing) | No — drift referenced only inside loop step, not as standalone section |
| Circular diagram | Absent | Added as visual anchor in loop section (step 0 overview) |
| MCP story | Mentioned in Skills glossary card | Dedicated integration section after loop, explicit model-agnostic note |
| Developer CTA | BottomCTA only | Embedded at loop step 3 AND at the end |
| Agent roster | Absent (glossary is tools, not agents) | New section between loop and QualityGate: 4 agent roles with one-sentence descriptions |

## What Stays

- The install command (`npx systemix init`) — keep as the primary CTA
- The "Works with" tool row (Claude Code, Cursor, Codex, Gemini CLI, OpenCode)
- The hypothesis validation card UI mockup (currently in HowItWorks) — it works, keep it
- The QualityGate section (evidence score 0–100, three tiers) — this is good and differentiating
- The "Storybook tells your agent what exists. Nobody tells it what worked." line — move, don't cut
- The local-first story (Hermes on Ollama, no API key) — move to integration section

---

## Dissenting Case

**The dissenting option is A (Team Roster, 4.15).**

If the founder commits to full repositioning — not just a landing update but a product rename/reframe to "your design system team" — then Option A is the correct starting point. The scoring places it third because it requires the most repositioning commitment. But repositioning commitment is exactly what the founder has signaled. The argument for A: the evidence-layer framing is already contested (Knapsack uses "Living System of Record"; the vocabulary is crowding up). "Your design system team" is uncontested, memorable, and maps directly to how AI-native teams think. The risk is that "team" implies humans and "agents" implies hype — the language needs precise execution.

If the founder's instinct is that the team/agent frame is the right long-term bet, Option A should be tested as a head-to-head variant against the hybrid C+P recommendation above. The test metric: 5-second test with Tier 1 buyers — "What does this product do?" If 3 of 5 say something about a team of agents or the learning loop without prompting, A wins.

---

## Decision Statement for DISCUSS Wave

**Proceed with the hybrid Option C+P landing, incorporating Option A's team-roster frame as a mid-page section.**

Key risk accepted: the "install to understand" bet (Option P's hero mechanic) requires that the post-install experience delivers the value explanation the landing withholds. If onboarding after `npx systemix init` is not yet excellent, de-risk by moving the install command from hero position to below the loop summary (Option C only).

Before DISCUSS proceeds to DELIVER: founder must decide whether the tagline becomes "Your design system team" (full repositioning, requires consistent rollout across docs, nav, and OG meta) or stays "The Evidence Layer" (incremental reframe, lower coordination cost).
