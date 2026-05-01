# Brainstorming — Options Raw
# landing-rework

**Phase:** DIVERGE / Phase 3
**Date:** 2026-04-29

---

## HMW Question

How might we communicate to AI-native design teams that every design decision they ship can be grounded in production evidence — and that Systemix is the layer that makes that true — in a way that creates immediate understanding, not more questions?

**Validity check:**
- No embedded solution: yes (not "how might we redesign the hero")
- Outcome-oriented: yes (understanding + commitment, not page scrolls)
- Broad enough for multiple approaches: yes
- Positive framing: yes

---

## SCAMPER Options

### S — Substitute: Replace the "tool demo" mechanism with a live loop narrative

**Core idea:** Instead of showing UI screenshots or a product diagram, the landing opens with a story that moves — the life of one design decision, from design to experiment to evidence to agent re-read. The user experiences the loop as a narrative before seeing any product chrome.

**Key mechanism:** A single animated prose block — written like a git commit timeline — shows the decision being made, tested, improved, and written back to the contract. Product screenshots appear only after the narrative lands.

**Key assumption:** The buyer responds to narrative tension ("the variant you killed in March is still being proposed by your agent") before they respond to feature lists or architecture diagrams.

**SCAMPER origin:** Substitute — replaces the "product UI first" mechanism with "story first, UI second"

**Closest competitor:** Stripe's old landing pages used narrative-over-product to explain complex developer infrastructure. No design system tool uses this approach.

---

### C — Combine: Merge the hypothesis validation docs page and the landing into one surface

**Core idea:** The landing IS the `/docs/concepts/hypothesis-validation` page, restructured for marketing density. Visitors arrive at a page that explains the loop step by step — 6 numbered steps, exactly as in the docs — but with marketing weight (benefit statements, social proof anchors, CTA gates at each step).

**Key mechanism:** Each step in the loop becomes a landing page section with a CTA embedded at the bottom: "Want to see what step 3 looks like for your stack? Install now." The docs and the landing share a single mental model and a single flow.

**Key assumption:** The buyer who is confused by the current landing is confused because the product explanation lives in docs, not the hero. Bringing the loop to the surface removes the confusion by making the explanation the landing itself.

**SCAMPER origin:** Combine — merges the docs concept page with the marketing landing

**Closest competitor:** Posthog's landing page uses docs-density and technical depth at marketing-page density. Closest in spirit.

---

### A — Adapt: Borrow the "team roster" framing from AI agent orchestration tools

**Core idea:** Lead with "Your design system team" — four named agents (Growth Agent, Ad Creative Agent, Hermes, Human-in-the-Loop) — as the above-the-fold hook. The landing sells a team, not a tool. Each agent has a role card. The loop is explained via the team's collaboration, not via a product architecture.

**Key mechanism:** A 2×2 grid of agent role cards sits above the fold. Each card is one sentence: what the agent reads, what the agent writes. Below: "The loop closes when Hermes synthesizes the result and writes the evidence back to the contract." Then: install command.

**Key assumption:** The buyer (AI-native design engineer who is already building with Claude Code) thinks in terms of agents and roles, not in terms of tools and features. The metaphor of "hiring a team" maps to how they already organize agentic workflows.

**SCAMPER origin:** Adapt — borrows the team-roster metaphor from multi-agent orchestration tools (CrewAI, Autogen, LangGraph) and applies it to design system tooling

**Closest competitor:** CrewAI's landing positions agents-as-team-members. No design system tool uses this frame.

---

### M — Modify/Magnify: Make the circular loop diagram the hero

**Core idea:** The above-the-fold element is a single animated circular diagram: PostHog → Hermes → Contract → Agent reads → ships → PostHog. No H1 at all for the first viewport. The diagram IS the message. Text appears on hover or scroll. The H1 lives below the diagram.

**Key mechanism:** SVG or CSS-animated loop ring with five labeled nodes. Each node is interactive: hover reveals what happens at that node in one sentence. The diagram communicates "this is a loop" in under 3 seconds without any reading.

**Key assumption:** The buyer processes visual systems faster than prose. A loop diagram at the right level of abstraction communicates the core differentiation (closed loop, not one-way sync) more efficiently than any headline.

**SCAMPER origin:** Modify/Magnify — takes the secondary architecture diagram that currently lives deep on the landing and makes it the primary hero

**Closest competitor:** The Systemix landing already has a `PipelineBeam` architecture diagram. This option promotes the circular variant (not the linear beam) to hero position. No competitor leads with a loop diagram.

---

### P — Put to other use: Lead with the MCP/developer integration story as the primary hook

**Core idea:** The hero addresses the developer ICP directly: "One MCP server. Works with Claude Code, Cursor, Gemini CLI. Your design system, any model." The install command is the H1. The learning loop is secondary — explained as what happens after install. Hypothesis validation is positioned as a feature of the MCP, not the primary product frame.

**Key mechanism:** The hero is a code-first surface: `npx systemix init` displayed large, with a live "what just happened" block showing the contract being created in real time. The loop is explained in a subsequent section.

**Key assumption:** The developer ICP doesn't read landing copy — they look for the install command and the integration story. Get them to install first; explain the loop in the onboarding sequence, not the landing.

**SCAMPER origin:** Put to other use — repurposes the BottomCTA section (currently "Run it locally") as the above-the-fold hero

**Closest competitor:** shadcn/ui landing leads with the CLI command and lets the product explain itself after install. Tailwind CSS did the same. This is the "developer PLG" landing pattern.

---

### E — Eliminate: Strip to the loop's core tension — one sentence, one diagram, one CTA

**Core idea:** Remove all sections except: (1) a single H1 that names the paradox, (2) the circular loop diagram, (3) the install command. No problem section, no glossary, no use cases, no quality gate. The landing is a one-screen statement with a single action. Everything else lives in docs.

**Key mechanism:** H1 candidates: "Your agent ships. Your contract learns." or "The loop that turns design decisions into evidence." One diagram. One `npx systemix init`. A link to docs for everything else.

**Key assumption:** The current landing is confusing because it has too many concepts (drift, evidence, Hermes, contracts, HITL, scoring) competing for attention. The minimal landing bets that the buyer will install based on the loop alone, then learn the product in-product.

**SCAMPER origin:** Eliminate — removes every section not strictly required for conversion

**Closest competitor:** Anthropic's early Claude API landing was a single hero + CTA. Vercel's first landing was "deploy frontend with git." This is the radical simplicity pattern.

---

### R — Reverse: Make the visitor the agent — position the landing as a contract being written

**Core idea:** The landing opens with a HITL card addressed to the visitor: "You are reviewing a proposed product. Here is the evidence." The page is formatted like a Systemix contract review — sections labeled "Hypothesis," "Evidence," "Prior art," "Recommendation." The visitor approves ("Install now") or rejects ("Tell me more"). The copy is the product demo.

**Key mechanism:** The hero is a styled card that reads:

```
type: hypothesis
section: landing-page
hypothesis: "AI-native design teams need a layer that closes
  the loop from production evidence back to design contracts"
evidence: [PostHog write-back, Hermes synthesis, MDX contracts]
recommendation: Install and validate
```

The CTA is styled as a HITL decision: "Promote" / "Run longer." The entire landing IS the product, not a description of it.

**Key assumption:** The buyer is a developer/designer who will find the meta-joke delightful and immediately understand the product by experiencing it as its own artifact. Cognitive complexity is high; engagement ceiling is also high.

**SCAMPER origin:** Reverse — inverts the usual landing structure (product explains itself to visitor) so the visitor is inside the product's UX on the landing itself

**Closest competitor:** Linear's early landing was famously product-demo-dense. No design system tool has done the "landing is the product UX" pattern.

---

## Crazy 8s Supplements

### Crazy 8s A — The "Before / After contract" comparison

**Core idea:** Split the hero into two panels: left is a raw design token with no context; right is the same token with its contract — value, rationale, 3 experiment results, Hermes note. The hero is literally "this is what your design system looks like with Systemix vs without." No copy needed; the artifact is the argument.

**Key mechanism:** Two side-by-side code blocks. Left: `--color-primary: oklch(0.205 0 0)` with nothing else. Right: the full DESIGN.md frontmatter block from the copy spec — value, figma-value, status, experiment result, confidence, rationale. The visitor sees the difference in 2 seconds.

**Key assumption:** Developers and design engineers are persuaded by artifacts, not descriptions of artifacts. The contract block IS the product.

**SCAMPER origin:** Crazy 8s supplement (structural diff not covered by SCAMPER)

**Closest competitor:** Stripe's API documentation uses before/after code blocks to sell the API. No design system tool shows the contract artifact in the hero.

---

### Crazy 8s B — The question-first landing

**Core idea:** The hero opens with four direct questions styled as terminal prompts:

```
> Did the button color change because of the experiment, or because someone forgot to revert it?
> Can your agent tell the difference?
> Does your next sprint start from evidence or from the last state that got committed?
> What does your design system know that your agent doesn't?
```

Then: "Systemix is the answer layer." Then: install command.

**Key mechanism:** Questions create felt need faster than statements. The buyer who feels the questions is already the buyer. No education needed after the questions land.

**Key assumption:** The buyer's pain is active, not latent — they have experienced all four of those situations in the last 30 days. The questions are recognition triggers, not education.

**SCAMPER origin:** Crazy 8s supplement (differs from all SCAMPER options in mechanism — question-first rather than answer-first)

**Closest competitor:** Basecamp's Signal v Noise posts used question-first persuasion. No SaaS landing has adopted this as the primary above-the-fold pattern recently.

---

## Curation to 6 Options

### All generated options (raw):
1. S — Narrative loop (story-first, UI-second)
2. C — Docs-as-landing (merge hypothesis-validation page with landing)
3. A — Team roster (agents as team members, 2×2 grid above fold)
4. M — Circular diagram hero (loop diagram as H1 replacement)
5. P — MCP/developer integration hero (code-first, install-command-led)
6. E — Minimal one-screen landing (H1 + diagram + install)
7. R — HITL card landing (visitor-as-agent, meta-UX)
8. C8A — Before/after contract comparison (artifact-as-argument)
9. C8B — Question-first terminal landing

### Curation decisions:

**Options 6 (Eliminate) and 9 (C8B — question-first):** Both strip to the minimal core but through different mechanisms (diagram vs questions). Different enough to keep both, but Crazy 8s B and Eliminate share "minimum viable understanding" as the core assumption. Merge: Eliminate subsumes the question-first energy — its H1 can be a tension statement that functions like a question. Keep Option 6 (Eliminate). Drop C8B.

**Options 7 (Reverse/HITL) and 8 (C8A — before/after artifact):** Both are developer-delight-first patterns. Reverse is higher-concept (meta-UX); C8A is more legible (literal artifact comparison). They serve the same assumption (developer reads artifacts faster than prose) through different mechanisms. Keep both — they differ in cognitive load profile. Reverse is high engagement ceiling / high drop-off risk. C8A is moderate engagement / low drop-off risk. Both pass the diversity test.

**Final 6 curated options:**
1. S — Narrative loop
2. C — Docs-as-landing
3. A — Team roster
4. M — Circular diagram hero
5. P — MCP/developer integration hero
6. E — Minimal one-screen landing

**Eliminated:**
- R (HITL meta-UX): High risk, low DVF feasibility for the current stage. Strong conceptually but would require significant new visual design and risks alienating designer ICP who doesn't know the product yet. Elements of this (HITL card as a demo artifact) can be incorporated into Option C (docs-as-landing) without becoming the primary mechanic.
- C8A (before/after contract): Strong execution concept but structurally a variation of Option P (developer-artifact-first). The mechanism overlaps enough that it collapses into P under diversity test. The before/after code block can be a component of P rather than its own option.
- C8B (question-first): Absorbed into Option E — the minimal landing's H1 can carry this energy without requiring a separate structural option.

---

## Diversity Test — Final 6

| Option | Different mechanism? | Different assumption? | Different cost profile? | Pass? |
|--------|---------------------|----------------------|------------------------|-------|
| S — Narrative loop | Animated prose timeline, not UI/diagram | Buyer responds to narrative tension first | High — needs copywriting + motion design | Yes |
| C — Docs-as-landing | Loop steps as landing sections | Confusion is solved by explanation depth, not brevity | Medium — copy-heavy restructure | Yes |
| A — Team roster | Agent role cards above fold | Buyer thinks in team/role terms, not tool terms | Medium — new conceptual frame, existing visual patterns | Yes |
| M — Diagram hero | Circular SVG animation as H1 replacement | Buyer processes visual systems faster than prose | High — needs animation and interactive diagram | Yes |
| P — MCP/developer first | Install command is the hero; loop is secondary | Developer doesn't read copy; they install first | Low — code block + existing CLI assets | Yes |
| E — Minimal one-screen | Single tension statement + one diagram + one CTA | The landing's job is to create a reason to install, not to explain the product | Low — subtract existing sections | Yes |

**All 6 pass the diversity test. Gate G3: PASS.**
