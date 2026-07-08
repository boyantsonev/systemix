---
name: design-audit
description: Zero-setup design-system audit for any repo. Read-only. Infers the de-facto tokens, colors, and components straight from the code, classifies drift (Critical/Warning/Info), flags AI-slop inconsistency (duplicate components, mixed libraries, one-off screens), and scores design-system health. Outputs a report plus a proposed design/guardrails.mdx + design/tokens.css starter — nothing is written without approval. No Figma, no prior design system required.
argument-hint: [path]
---

# /design-audit — Zero-setup Design-System Audit

Audit the frontend for design-system health: **$ARGUMENTS**

This is the front door. Point it at a messy repo with **no design system defined**
and it tells you what you have, where it's inconsistent, and hands you the seed of
the fix. It reads only — every file it would create is proposed for your approval.

## Usage
```
/design-audit                 # audit the whole repo
/design-audit src/            # scope to a directory
/design-audit apps/web/ui/    # scope to a component library
```

## What it does (four read-only stages)

### 1. Discover the de-facto system
There may be no `design/tokens.css` yet — so infer it.
- **Detect a token source, if any:** CSS custom properties in `globals.css` /
  `theme.css` (`--background`, `--radius`, …), a Tailwind config (`theme.extend`),
  a `tokens.*` file. If one exists, treat it as the intended system.
- **Scan for raw values** across CSS + TSX/JSX (and `.vue`/`.svelte` if present):
  - colors — hex (`#3B82F6`), `rgb()/rgba()`, `hsl()`, `oklch()` literals, and
    Tailwind arbitrary colors (`bg-[#0af]`)
  - spacing / radius — arbitrary px/rem (`mt-[24px]`, `p-[13px]`, `rounded-[7px]`)
  - type — arbitrary font sizes/weights/line-heights (`text-[15px]`, `leading-[1.4]`)
- **Cluster** the raw values into an inferred palette + spacing/type scale
  (group near-duplicates: `#3b82f6`, `#3B82F7`, `rgb(59,130,246)` → one blue).
  Count occurrences — the most-repeated literals are the real de-facto tokens.

### 2. Classify drift
For every raw value found, assign a severity:
- **Critical** — a token for this value already exists (in the detected token
  source); the code should reference it instead. Give the exact token to use.
- **Warning** — no token matches, but the value recurs (≥ N uses / appears across
  files) → it *should* become a token. Propose a name.
- **Info** — a one-off or plausibly intentional exception (a gradient stop, a
  third-party embed, an inline SVG). Flag, don't nag.

### 3. Detect AI-slop / inconsistency
This is what "my frontend is a mess" actually looks like. Look for:
- **Near-duplicate components** — multiple `Button`/`Card`/`Modal` implementations,
  or the same UI rebuilt inline instead of reused. List each cluster with paths.
- **Mixed component sources** — e.g. shadcn + MUI + hand-rolled in the same tree.
- **One-off screens** — pages that re-implement primitives instead of importing the
  shared ones.
- **Inconsistent prop / variant patterns** — the same concept spelled differently
  (`variant="primary"` vs `type="main"` vs `isPrimary`).
Report each as a finding with the offending paths and the consolidation to make.

### 4. Score + propose the fix
- Compute a **design-system health score** (0–100) from token coverage, drift
  density, and component-duplication count. Show the three sub-scores.
- **Propose starters** seeded from what you discovered (do NOT write them yet):
  - `design/tokens.css` — the inferred palette + scale, as CSS custom properties,
    in the shape of the template (semantic names, `:root` + `.dark`).
  - `design/guardrails.mdx` — the rules to enforce next, pre-filled from the
    findings (e.g. "no raw hex — 41 instances found", "one Button — 3 found").
  Present them inline and ask before writing. This is the operator's system to
  sign off on — it carries *their* signature, not the tool's defaults.
- **Push the proposal to the HITL feed** (`.systemix/queue.json`) so the decision is
  visible in the dashboard and readable by other agents (`systemix design feed` /
  MCP `design_list_proposals`):
  ```json
  {
    "id": "design-proposal-audit-<timestamp>",
    "type": "design-proposal",
    "filePath": "design/guardrails.mdx",
    "proposed": "Adopt inferred design system: <n> tokens, <m> guardrail groups",
    "context": "<health score + top findings, one line>",
    "status": "pending",
    "requestedAt": "<ISO>"
  }
  ```
  On approval, write `design/tokens.css` + `design/guardrails.mdx` and resolve the card.

## Output format
```
# Design-System Audit — <repo/path>
Health: 62/100   (tokens 70 · drift 55 · components 60)
Files scanned: X · with issues: Y · raw values: Z · component clusters: N

## Inferred palette
| Token (proposed) | Value | Uses | Also seen as |
| --color-accent   | #3b82f6 | 41 | #3B82F7, rgb(59,130,246) |

## Drift
| File | Line | Hardcoded | Should use | Severity |
| src/Hero.tsx | 22 | #3b82f6 | var(--color-accent) | Critical |

## Inconsistency (AI slop)
- **3 Button implementations** — src/ui/Button.tsx, src/Hero.tsx (inline),
  src/legacy/Btn.jsx → consolidate to one.
- **Mixed libraries** — shadcn (src/ui/*) + MUI (src/legacy/*).

## Proposed next step
→ design/tokens.css starter (N tokens)   [awaiting approval]
→ design/guardrails.mdx starter (M rules) [awaiting approval]
```

## Notes
- **Zero-setup & read-only.** Works with no `design/` folder. It only *reads* code;
  the tokens/guardrails starters are proposed for approval, never auto-written.
- **The magnet.** This is the shareable entry point — run it, screenshot the report,
  fix from the starter. After you approve the guardrails, `/drift-report` keeps the
  code true to them on every change.
- **Autonomy.** The audit report itself is a `record` (safe to produce at any tier).
  Writing `design/guardrails.mdx` or `design/tokens.css` is a `guardrail` artifact —
  **always HITL**, even in autonomous mode (self-modification covenant). Never inline
  a token "just this once"; add it to `design/tokens.css` first.
- **Code-first.** No Figma, no design tool. Pushing tokens *out* to a design tool is
  the optional Figma adapter (`/sync-to-figma`), not this skill.
- After the operator has a design system, the two doors converge: greenfield builds
  from the interview, messy repos build from this audit — both land in `design/`.
