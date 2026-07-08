---
name: readiness-audit
description: Produce a scored AI-native Readiness Audit for a repo — the deliverable report behind the paid audit tier. Combines design-system health (from /design-audit), design-code drift (from /drift-report), and an ODI-scored AI-native readiness rubric into one structured report: an overall readiness score, the three sub-scores, a prioritized opportunity list (most underserved first), and the recommended setup path. Read-only; the report is a record, and any files it would create are proposed for approval.
argument-hint: "[path]"
version: "0.1.0"
last_updated: "2026-07-08"
min_cli_version: "1.1.0"
---

# /readiness-audit — AI-native Readiness Audit

Score how ready a repo is for **agent-driven development without slop**, and hand back
a deliverable report: **$ARGUMENTS**

This is the **paid audit tier's engine**. Where `/design-audit` is the free, zero-setup
front door (what you have, where it drifts, the seed of the fix), `/readiness-audit`
synthesizes a **scored, prioritized report** a team (or a client) can act on and a
consultant can deliver. It orchestrates the pieces that already exist — it doesn't
re-implement them.

## What it produces

One structured report with:
1. **Overall AI-native readiness score** (0–100).
2. **Three sub-scores** — design-system health · drift control · readiness rubric.
3. **A prioritized opportunity list** — the most underserved dimensions first (ODI).
4. **The recommended setup path** — reusing `/design-audit`'s stage-5 recommendation.

## Ingredients (reuse — do not re-implement)

- **Design-system health** — run the `/design-audit` discovery (§1–4): inferred tokens,
  drift density, component duplication → its **health score (0–100)**.
- **Drift control** — run `/drift-report` if a `design/` system exists (OKLCH perceptual
  diff against `design/tokens.css` + `design/guardrails.mdx`); otherwise use the drift
  density `/design-audit` inferred. Reduce to a **0–100 drift-control score** (100 = no
  drift).
- **Contract / rationale** — note whether the *why* is captured (`contract/**`,
  `design/DESIGN.md`, `decisions/`) or lives only in someone's head. `scripts/generate-design-md.ts`
  is how a contract becomes a DESIGN.md — its presence/absence is a readiness signal.

## The readiness rubric (ODI-scored)

Score each dimension **importance** (how much it matters for agent-native dev, 1–10) and
**satisfaction** (how well the repo does it today, 1–10). Compute the **opportunity**
score with the same ODI formula used in `docs/product/jobs.yaml`:

```
opportunity = importance + max(importance − satisfaction, 0)
```

Higher opportunity = more underserved = fix first. Dimensions:

| # | Dimension | Satisfied when… |
|---|---|---|
| 1 | **Token discipline** | colours/spacing/type reference tokens, not raw hex/px |
| 2 | **Component consistency** | one primitive per concept; no duplicate/mixed-library components |
| 3 | **Codified rules** | a `design/guardrails.mdx` (or equivalent) the agent can read exists |
| 4 | **Captured rationale** | the *why* is written down (contract/decisions/DESIGN.md), not tribal |
| 5 | **Drift control** | code is kept true to the system (low drift; a `/drift-report` habit) |
| 6 | **Agent legibility** | a `CLAUDE.md` + discoverable skills/guardrails orient the agent |

Derive **satisfaction** from real evidence (dimensions 1/2/5 from the design-audit +
drift numbers; 3/4/6 from file presence). State the evidence for each score — never a
bare number.

## Scoring

- **Overall readiness (0–100)** = the mean of the six dimensions' satisfaction × 10.
- Report the two other sub-scores (design-system health, drift-control) alongside it.
- Rank dimensions by **opportunity** — that ranking *is* the prioritized fix list.

## Output format

```
# AI-native Readiness Audit — <repo/path>
Overall readiness: 48/100
  design-system health 62 · drift control 55 · readiness rubric 48

## Readiness rubric (ODI — most underserved first)
| Dimension            | Imp | Sat | Opportunity | Evidence |
| Captured rationale   |  9  |  2  |     16      | no contract/ or DESIGN.md; rules are tribal |
| Codified rules       |  9  |  3  |     15      | no design/guardrails.mdx |
| Token discipline     |  8  |  4  |     12      | 41 raw hex across 12 files |
| Component consistency|  8  |  5  |     11      | 3 Button impls, shadcn+MUI mixed |
| Drift control        |  7  |  5  |      9      | no design/ to check against |
| Agent legibility     |  6  |  5  |      7      | CLAUDE.md present; skills sparse |

## Top opportunities
1. Capture the rationale — stand up contract/ + DESIGN.md so the why survives.
2. Codify the rules — approve a design/guardrails.mdx starter.
3. Consolidate tokens — 41 raw values → the inferred palette.

## Recommended setup   (class: partial → systemix init — you confirm each)
→ design: scaffold (seed from this audit) · signals: PostHog · autonomy: ghost · self-improve: on
```

## Delivery

The report is markdown — hand it over as-is, or render it as a portable, self-contained
artifact the same way `/workflow-artifact` does (baked-in data, CSP-safe, no network) so
it can be shared without the repo. Do **not** attempt a live/localhost fetch from an
artifact — the sandbox CSP blocks it.

## Guardrails

- **Read-only / a record.** The report scores and recommends; it writes nothing on its
  own. Producing it is safe at any autonomy tier.
- **Reuse, don't re-implement.** Orchestrate `/design-audit` and `/drift-report`; don't
  re-derive tokens or drift here.
- **Evidence, not vibes.** Every score cites what it's based on (counts, file presence,
  drift numbers). No bare numbers.
- **Writes stay HITL.** If the operator acts on the report (scaffold `design/`, write
  guardrails), that goes through the normal proposal path — a `guardrail` artifact,
  always HITL, even autonomous.
