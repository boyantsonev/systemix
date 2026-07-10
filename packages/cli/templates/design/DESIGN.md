---
type: design-system
instance: your-instance
icp: your-icp
created: 2026-01-01
updated: 2026-01-01
version: alpha
name: your-instance
description: An optional substrate for the loop — the design-system-as-object your prototypes build from.
# The values below are a MIRRORED SNAPSHOT of tokens.css — CSS stays
# canonical (code-first). Update tokens.css first, then re-sync this block.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  border: "oklch(0.922 0 0)"
rounded:
  base: 0.625rem
spacing:
  base: 0.25rem
---

# Design System

Format: this file follows the open [DESIGN.md spec](https://github.com/google-labs-code/design.md)
(Apache-2.0) — YAML frontmatter carries machine-readable tokens, the sections
below carry the human-readable rationale. Unlike a static Stitch export, this
instance also documents a [Loop](#loop) — the design system is meant to
evolve from evidence, not just describe current state.

> The learning loop lives in **`experiments/`** and does not depend on this
> folder. Validated learnings are captured in `experiments/LEARNINGS.md`.

## Overview

<!-- One paragraph: what is this design system for, who is the ICP? Replace this. -->

A code-first, context-based design system. Tokens live in `design/tokens.css`; the
rules the engine enforces live in `design/guardrails.mdx`. This starter ships
with a neutral grayscale palette — replace the frontmatter and the sections
below as the instance's brand and components take shape.

## Colors

Canonical token values live in [`tokens.css`](./tokens.css) (the app imports
these). `background` / `foreground` / `primary` / `muted` / `border` are the
semantic roles a fresh instance starts with — extend as the palette grows.

## Typography

Not yet defined. Add role tokens (e.g. `--font-sans`, `--font-display`,
`--font-mono`) to `tokens.css` as they're introduced, then mirror them here.

## Layout

Not yet defined. Document spacing scale and grid conventions here once the
instance has real page layouts to describe.

## Elevation & Depth

Not yet defined. Document shadow/elevation tokens here once introduced.

## Shapes

Radius is a single dial: `rounded` (`0.625rem` above) is the base scale value
in `tokens.css`. Document derived radii (`sm`/`md`/`lg`) here as they're added.

## Components

Not yet defined. As components stabilize, document their token mappings here
(background/text color, typography, radius, padding, size).

## Do's and Don'ts

- **Do** reference a semantic token (`bg-primary`, `var(--muted)`) — never a
  raw hex or px value in components or styles.
- **Do** add a token to `tokens.css` first, then use it — don't invent
  one-off values inline.
- **Do** reuse existing components; don't rebuild a primitive inline.
- **Don't** self-modify this system silently. If a change needs a value,
  component, or rule that isn't in the system yet, stop and propose it —
  with rationale — and wait for a human.

## Loop

Once the system holds, close a learning loop in `experiments/`:
`/init-experiment` → `/write-variants` → `/measure` → `/close-experiment`
appends the decision to `experiments/LEARNINGS.md`. Before any product/UI
change, recall what's already been learned:
`npx systemix experiment learnings --recent 5` — don't contradict a
high-confidence learning without flagging it.

When drift or a learning suggests a rule change, propose a tighter
[`guardrails.mdx`](./guardrails.mdx) entry — self-modification of skills and
guardrails is **always human-in-the-loop**, at any autonomy tier
(`systemix.config.yaml`: ghost / assisted / autonomous).
