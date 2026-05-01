# Wave Decisions — landing-rework

**Wave:** DIVERGE
**Date:** 2026-04-29
**Status:** Complete — ready for DISCUSS

---

## Gate Summary

| Gate | Criterion | Status |
|------|-----------|--------|
| G1 | Job at strategic level, no feature references, 3+ ODI outcome statements | PASS (6 ODI statements, job at strategic level) |
| G2 | 3+ real competitors researched, non-obvious alternative included | PASS (absorbed from beta-brief: 13 named competitors, Luro as non-obvious partial-competitor on axis C) |
| G3 | 6 curated options, SCAMPER coverage documented, options-raw.md generated | PASS (7 SCAMPER options generated, 2 Crazy 8s supplements, curated to 6 with diversity test) |
| G4 | DVF filter applied, all criteria scored, weighted ranking complete, recommendation with dissenting case | PASS (weights locked before scoring, all 6 options scored on all 5 criteria, dissenting case for Option A documented) |

---

## Key Decisions Made in This Wave

### Decision 1: Job framing

The job was elevated from "rethink the landing page" (tactical) to "give AI-native design teams a way to calibrate their design decisions against production reality" (strategic). This elevation is what makes the brainstorming fruitful — options generated against the strategic job are structurally different from options generated against "fix the messaging."

### Decision 2: No new competitive research needed

The beta brief (`systemix-beta-brief.md`) is comprehensive and recent (2026-04-28). Absorbing existing research rather than re-running it saves material time and avoids contradicting the discovery wave's findings. The competitive landscape conclusion is unchanged: axis (c) — production evidence write-back — is the uncontested differentiator. The landing must lead with this.

### Decision 3: Hypothesis validation as the structural spine

The `/docs/concepts/hypothesis-validation/page.tsx` content is the clearest explanation of what Systemix does that currently exists in the codebase. The founder noted "the hypothesis validation page could become the landing itself." The scoring confirms this: Option C (Docs-as-Landing, built from that page) scores 4.28 — second overall — and strongest on the criteria that matter most for the confused ICPs (Concept Count and Progressive Disclosure).

### Decision 4: Hybrid over single option

The 0.07 scoring gap between the top two options (P at 4.35, C at 4.28) is within variance. Rather than forcing a single option, the recommendation identifies that P solves for the developer ICP (first viewport) and C solves for the designer ICP (second through fourth viewport). The hybrid delivers both without compromising either.

### Decision 5: Drift demoted, not deleted

Drift detection remains in the product and in the contract. It does not remain above the fold as a primary message. This is consistent with the beta brief's recommendation ("drift is the visual context part of the solution, not the primary idea") and avoids head-on competition with Fragments and Knapsack on the contested axis (b).

### Decision 6: Team roster framing deferred, not rejected

Option A (Team Roster, 4.15) is the right long-term repositioning direction and explicitly matches the founder's signal ("introduce agents which have skills and write to the .md"). It is deferred to a mid-page section rather than the hero because the hero needs to work for cold traffic without requiring the visitor to already understand the "agents as team members" metaphor. The dissenting case documents the conditions under which A should become the primary option.

---

## Weight Adjustments from Default

| Criterion | Default | Applied | Reason |
|-----------|---------|---------|--------|
| DVF | 30% | 25% | Desirability is uniform across options (same validated job); DVF differentiates on Feasibility only |
| T1 Subtraction | 20% | 20% | Unchanged |
| T2 Concept Count | 20% | 25% | Live user research confirms concept overload is the primary problem to solve |
| T3 Progressive Disclosure | 15% | 15% | Unchanged |
| T4 Speed-as-Trust | 15% | 15% | Unchanged |

---

## Open Questions for DISCUSS Wave

1. **Tagline decision:** Does the tagline become "Your design system team" (full agent-repositioning) or stay "The Evidence Layer" (incremental)? This is a brand decision, not a copy decision. Affects docs nav, OG meta, product name cadence.

2. **Onboarding readiness:** The hybrid P+C recommendation assumes the post-install experience (`npx systemix init`) delivers the product explanation the hero withholds. If onboarding is not yet excellent, the developer hero is a conversion-to-churn trap. DISCUSS must confirm: is the install sequence ready?

3. **Circular diagram asset:** The recommendation calls for a circular loop diagram in the "How it works" section. This asset does not exist (the current PipelineBeam is linear). DISCUSS must scope whether this is DELIVER scope or requires a design spike first.

4. **Agent roles — which are shippable?** Option A's team-roster section (incorporated into the hybrid) names 4 agent roles. For this to be credible on the landing, each role must correspond to a real, working skill. DISCUSS must confirm which of Growth Agent, Ad Creative Agent, Hermes, and HITL are demonstrably functional.

---

## Handoff Package

| File | Contents |
|------|---------|
| `diverge/job-analysis.md` | Strategic job statement, 5 Why chain, 6 ODI outcome statements, opportunity scoring |
| `diverge/options-raw.md` | HMW question, 7 SCAMPER options, 2 Crazy 8s, curation to 6 with diversity test |
| `diverge/taste-evaluation.md` | DVF filter, locked weights, full scoring matrix for all 6 options |
| `recommendation.md` | Top 3 with hire criteria, hybrid recommendation, explicit answers to all 5 founder questions, dissenting case |
| `wave-decisions.md` | This file — gate summary, key decisions, open questions for DISCUSS |

**Handoff to:** product-owner (DISCUSS wave)
**Decision statement:** Proceed with hybrid Option C+P landing, incorporating Option A's team-roster as mid-page section. Founder decides tagline direction before DELIVER begins.
