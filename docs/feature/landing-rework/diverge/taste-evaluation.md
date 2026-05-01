# Taste Evaluation — landing-rework

**Phase:** DIVERGE / Phase 4
**Date:** 2026-04-29

---

## Weights Selected

This is a **developer tool** with a secondary designer audience. Weight adjustments from default:

| Criterion | Default | Selected | Rationale |
|-----------|---------|----------|-----------|
| DVF (avg) | 30% | 25% | Desirability is high across all options (same validated job); DVF differentiates primarily on Feasibility |
| Subtraction (T1) | 20% | 20% | Current landing suffers from concept overload; subtraction discipline is high priority |
| Concept Count (T2) | 20% | 25% | Designer + developer ICPs are confused by concept density (Hermes, agents, skills, contracts, drift) — this criterion is the live problem |
| Progressive Disclosure (T3) | 15% | 15% | Unchanged; still important for managing complexity |
| Speed-as-Trust (T4) | 15% | 15% | For a landing page this is primarily about load speed and perceived simplicity of setup path, not latency |

**Weights locked. Scoring proceeds from these weights.**

---

## Phase 1: DVF Filter

| Option | Desirability (1-5) | Feasibility (1-5) | Viability (1-5) | Total | Eliminate? |
|--------|-------------------|-------------------|-----------------|-------|-----------|
| S — Narrative loop | 4 | 2 | 4 | 10 | No (10 = borderline, keep) |
| C — Docs-as-landing | 5 | 4 | 4 | 13 | No |
| A — Team roster | 4 | 4 | 4 | 12 | No |
| M — Diagram hero | 4 | 3 | 3 | 10 | No (borderline, keep) |
| P — MCP/developer first | 4 | 5 | 3 | 12 | No |
| E — Minimal one-screen | 4 | 5 | 3 | 12 | No |

**DVF notes:**

**S (Narrative loop):** Desirability is real — narrative tension is proven persuasion. Feasibility is low (2): animated prose timeline requires motion design Systemix doesn't currently have; the visual language doesn't exist. Viability is 4: if it works, it creates genuine brand differentiation. DVF total 10 — survives at borderline.

**C (Docs-as-landing):** Highest desirability (5): directly answers the confusion ("the explanation is the product"). Feasibility is 4: most content already exists in the hypothesis-validation page; restructuring is copy work, not engineering. Viability is 4: deep technical landing pages convert well for developer PLG (Posthog, Linear).

**A (Team roster):** Desirability 4: the "your design system team" framing is explicitly endorsed by the founder and maps to how the Tier 1 buyer thinks. Feasibility 4: role-card grid is achievable with existing visual design patterns. Viability 4: the team metaphor is differentiated and memorable.

**M (Diagram hero):** Desirability 4: visual loop communicates the core differentiation efficiently. Feasibility 3: requires an animation-quality circular SVG diagram that doesn't exist yet; the current PipelineBeam is linear, not circular. Viability 3: diagrams as heroes are rare and risky — if the diagram isn't immediately legible, bounce rate spikes.

**P (MCP/developer first):** Desirability 4: directly addresses the developer ICP's stated confusion ("how do I install it?"). Feasibility 5: CLI command and code blocks exist; this is a copy restructure. Viability 3: PLG install-first works at scale (shadcn) but requires the post-install experience to explain the value; the loop learning is deferred.

**E (Minimal one-screen):** Desirability 4: radical clarity is desirable in principle. Feasibility 5: subtraction is the easiest engineering work. Viability 3: single-screen landings work for viral/word-of-mouth products (Vercel in 2019) but Systemix needs explanation to justify intent; the minimal bet may under-convert in cold traffic.

**No options eliminated. All 6 proceed to taste scoring.**

---

## Phase 2: Taste Scores per Option

### Option S — Narrative Loop

**T1 Subtraction (1-5):** 3
The narrative concept requires building new motion design vocabulary (animated prose timeline) that doesn't exist. The goal is fewer concepts but the implementation adds a new interaction concept (animated timeline) on top of the existing ones. Something can be removed (the UI screenshots could be entirely absent below the fold) but the core requires new elements.

**T2 Concept Count (1-5):** 4
The narrative introduces one new concept (the loop as a story) and maps it onto a familiar mental model (a timeline / git commit log). Two concepts maximum in the above-the-fold: "design decision" and "loop that validates it." The ICP already knows both.

**T3 Progressive Disclosure (1-5):** 4
Narrative-first means the buyer receives the story before the UI — they understand the problem before they see the product. This is correct sequencing. Secondary UI follows once the hook is set.

**T4 Speed-as-Trust (1-5):** 2
Animated prose timeline introduces motion overhead. If the animation doesn't load instantly or plays at wrong timing, the trust signal inverts. The entire option's effectiveness is contingent on animation performance — a single bad animation frame undermines the "this team knows what they're doing" signal.

---

### Option C — Docs-as-Landing

**T1 Subtraction (1-5):** 3
The option explicitly brings more content to the landing (6 steps vs current 4 main sections). The subtraction discipline breaks slightly: it adds explanation depth while the current landing's problem is already explanation overload. But: the content being added is organized (numbered steps) rather than additive (new concept layers), so the cognitive cost is lower than it appears.

**T2 Concept Count (1-5):** 5
The loop steps ARE the product concepts. Rather than introducing concepts as abstract nouns (Hermes, evidence layer, HITL, contracts), the steps show concepts in action. The visitor doesn't learn that Hermes exists — they see "Hermes synthesizes the result" as step 5 in a flow they're already following. Concept count is high in terms of words but low in terms of cognitive new models required.

**T3 Progressive Disclosure (1-5):** 5
This is the strongest option on progressive disclosure. The loop structure is inherently sequential: Step 1 → Step 2 → Step 3. Each step reveals one layer of the product at exactly the moment the visitor is ready for it. Above the fold: "There's a loop." Section 2: "Here's step 1." Nothing is front-loaded.

**T4 Speed-as-Trust (1-5):** 4
The landing is copy-heavy, not animation-heavy. Static rendering. Perceived speed is high. The only risk: if the step-by-step structure feels academic (like reading a tutorial), the visitor might click away before reaching the install CTA. Mitigated by embedding CTAs at key steps.

---

### Option A — Team Roster

**T1 Subtraction (1-5):** 4
The team-roster pattern is inherently subtractive: 4 role cards, one sentence each. The "your design system team" frame collapses multiple concepts (agents, skills, Hermes, HITL) into a single organizing metaphor (team). Once the metaphor lands, concepts like "Hermes" and "growth agent" are characters, not abstract system components. Highly subtractive relative to the current landing.

**T2 Concept Count (1-5):** 4
One new concept: "your design system has a team of agents with roles." This maps cleanly onto existing mental models (a team, a workflow, roles and responsibilities). The buyer doesn't need to understand MDX, contracts, or scoring before they understand what each agent does. Those details layer in below the fold.

**T3 Progressive Disclosure (1-5):** 4
The team roster above the fold shows roles without implementation. Hovering a card or scrolling reveals what each agent reads/writes. The loop is explained via the team's interaction, not via architecture. Good sequencing: metaphor first, mechanics second.

**T4 Speed-as-Trust (1-5):** 5
Static role cards. No animation dependency. Extremely fast to render. The trust signal is the visual clarity of the card layout, not animation or complexity.

---

### Option M — Diagram Hero

**T1 Subtraction (1-5):** 5
The diagram replaces all copy in the above-the-fold. One visual, zero concepts explained in words. Maximum subtraction possible for above-the-fold.

**T2 Concept Count (1-5):** 3
The diagram introduces 5 labeled nodes (PostHog → Hermes → Contract → Agent → Ships). Each label is a concept. If the visitor doesn't already know PostHog or what a contract is, the diagram is opaque. The option assumes prior knowledge — which is valid for the Tier 1 buyer but risks all others. Concept count is moderate because the visual does heavy lifting but only works if labels are already familiar.

**T3 Progressive Disclosure (1-5):** 3
The diagram is above the fold without any surrounding explanation. This inverts the typical progression: the visitor sees "how" before they know "why." The diagram needs to be immediately legible to work as a hero. If it isn't, the visitor has nothing to hold onto while scrolling.

**T4 Speed-as-Trust (1-5):** 3
An animated circular SVG diagram needs to load and render correctly at first paint. If it flickers or loads partially, trust inverts. The option has higher animation risk than Option C but lower than Option S. If implemented as a CSS-only animation (no JS animation library), the risk is manageable.

---

### Option P — MCP/Developer First

**T1 Subtraction (1-5):** 5
The install command is the hero. Everything else is secondary. Maximum subtraction. The developer ICP sees the command and either installs or leaves — no intermediate decision required.

**T2 Concept Count (1-5):** 4
One concept above the fold: "one command, works with any MCP-compatible editor." The loop, the agents, the contracts — all come after install. Concept count is as low as it can get while still being specific enough to be meaningful.

**T3 Progressive Disclosure (1-5):** 4
Perfect sequential progression for the developer ICP: install → see what it created → read why → integrate. The landing is an onboarding sequence, not an explanation surface. But: this pattern defers the "why" to post-install — which is a bet that the buyer trusts the install enough to run an unknown CLI without understanding the value first. For cold traffic, this is a risk.

**T4 Speed-as-Trust (1-5):** 5
Static code blocks, no animation. Fastest possible render. The install command reads as "this team ships software" — the trust signal is the precision and simplicity of the command itself.

---

### Option E — Minimal One-Screen

**T1 Subtraction (1-5):** 5
Maximum subtraction by definition. H1 + diagram + install. Nothing else. The option is built on the subtraction principle.

**T2 Concept Count (1-5):** 4
One concept above the fold if the diagram is simple enough. Risk: the circular diagram introduces 5 nodes simultaneously with no narrative to sequence them. If the diagram is not instantly legible, the minimal landing leaves the visitor with nothing to hold.

**T3 Progressive Disclosure (1-5):** 2
Single-screen landings do NOT progressively disclose — they ask the visitor to take action before fully understanding the product. For Systemix, which requires explanation to justify the install, this is a significant weakness. The visitor who doesn't immediately understand the loop has no second section to read.

**T4 Speed-as-Trust (1-5):** 5
Minimal page = minimal load. Maximum speed trust.

---

## Phase 3: Weighted Scoring Matrix

**Weights:** DVF 25% | T1 Subtraction 20% | T2 Concept Count 25% | T3 Progressive Disclosure 15% | T4 Speed-as-Trust 15%

DVF score = average of D, F, V.

| Option | DVF avg | T1 Sub | T2 Concept | T3 Prog | T4 Speed | Weighted Total |
|--------|---------|--------|------------|---------|----------|----------------|
| S — Narrative loop | 3.33 | 3 | 4 | 4 | 2 | 3.33 |
| C — Docs-as-landing | 4.33 | 3 | 5 | 5 | 4 | **4.25** |
| A — Team roster | 4.00 | 4 | 4 | 4 | 5 | **4.20** |
| M — Diagram hero | 3.33 | 5 | 3 | 3 | 3 | 3.53 |
| P — MCP/developer first | 4.00 | 5 | 4 | 4 | 5 | **4.35** |
| E — Minimal one-screen | 4.00 | 5 | 4 | 2 | 5 | 4.00 |

**Calculation for top 3:**

P: (4.00 × 0.25) + (5 × 0.20) + (4 × 0.25) + (4 × 0.15) + (5 × 0.15) = 1.00 + 1.00 + 1.00 + 0.60 + 0.75 = **4.35**

C: (4.33 × 0.25) + (3 × 0.20) + (5 × 0.25) + (5 × 0.15) + (4 × 0.15) = 1.08 + 0.60 + 1.25 + 0.75 + 0.60 = **4.28**

A: (4.00 × 0.25) + (4 × 0.20) + (4 × 0.25) + (4 × 0.15) + (5 × 0.15) = 1.00 + 0.80 + 1.00 + 0.60 + 0.75 = **4.15**

E: (4.00 × 0.25) + (5 × 0.20) + (4 × 0.25) + (2 × 0.15) + (5 × 0.15) = 1.00 + 1.00 + 1.00 + 0.30 + 0.75 = **4.05**

M: (3.33 × 0.25) + (5 × 0.20) + (3 × 0.25) + (3 × 0.15) + (3 × 0.15) = 0.83 + 1.00 + 0.75 + 0.45 + 0.45 = **3.48**

S: (3.33 × 0.25) + (3 × 0.20) + (4 × 0.25) + (4 × 0.15) + (2 × 0.15) = 0.83 + 0.60 + 1.00 + 0.60 + 0.30 = **3.33**

**Ranked:**
1. P — MCP/developer first: **4.35**
2. C — Docs-as-landing: **4.28**
3. A — Team roster: **4.15**
4. E — Minimal one-screen: **4.05**
5. M — Diagram hero: **3.48**
6. S — Narrative loop: **3.33**

---

## Score Breakdown Notes

**Why P wins:** It scores maximum on the two criteria that matter most for this audience — Subtraction (developer-ICP responds to install-first with no preamble) and Speed-as-Trust (static code blocks, instant load). It scores well on Concept Count because the loop explanation is deferred, not absent. Its weakness is Progressive Disclosure — but for the developer ICP, the "install to understand" pattern is acceptable and is how shadcn, Tailwind, and Vite all launched.

**Why C is close:** It wins outright on Concept Count and Progressive Disclosure — both of which reflect the primary user-research pain (designers and developers don't understand what the product is). It loses on Subtraction because it adds content, not removes it. The 0.07 gap between P and C is within the margin where weight adjustment would change the winner — see recommendation.

**Why A holds at 4.15:** The team-roster option is the only one that directly implements the founder's repositioning direction ("introduce agents which have skills") while also scoring well across all criteria. It doesn't top any single criterion but has no critical weakness.

**Why E drops:** The 2/5 on Progressive Disclosure is a structural penalty. For a product at Systemix's current awareness level (low), the minimal landing bets the visitor already knows enough to act — which is incorrect for cold traffic.

**Gate G4: PASS** — all surviving options scored on all criteria, weights documented before scoring, recommendation traceable to scores.
