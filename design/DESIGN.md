---
title: DESIGN.md
description: Systemix's own design system — TVA · Amber Mainframe, v1.1.
---

# TVA · Amber Mainframe — the Systemix design system

**v1.1** · warm amber phosphor on a dim, lifted base with a *scoped* soft-CRT
treatment. Renders the product as a warm 1971 computer room — bureaucratic,
quietly powerful, legible. Full spec:
`docs/feature/rebrand-hifi/design/design.md` (+ `tva-theme.css`, the token
source of truth). Live tokens: `src/app/globals.css`.

## Principles

1. **Warm, never cold.** The palette is fully warm — no blue, no cool grey.
2. **Glow is elevation.** Importance is a soft bloom and a hotter border,
   never a hard neon edge.
3. **Legibility first, atmosphere second.** Since v1.1, dark body text is warm
   white (`#EFE5D3`); amber lives in labels, values, glows, and actions. The
   CRT effect is scoped to screen surfaces (`.terminal`, `.crt-panel`) — text
   sections sit on clean paper/ink inside the soft grid.
4. **Mechanical, not organic, motion.** Short transitions that settle hard.
5. **Tokens over forks.** Light/dark, radius, and CRT strength are attribute-
   driven token swaps; component CSS never branches on theme.
6. **Bureaucracy as identity.** Mono labels, reference IDs, deadpan copy.

## The token model

Three tiers (W3C style): primitives (hex ramps, `--screen-*`, glow values) →
**semantic** (`--background`, `--primary`, `--highlight`, … — the layer
components consume) → component (kept near-empty; state tints are *derived*
via `color-mix` + the `--tint-*` knobs, never stored).

Key semantics: `--accent` is the *subtle hover surface* (warm neutral), NOT
the brand amber — the vivid amber is `--highlight`. Status = `--success`
(olive) / `--warning` / `--destructive`. The terminal stays a lit CRT in both
themes via the theme-independent `--screen-*` set.

## Layout

Marketing surfaces use the **soft grid**: a hairline-framed container
(`GridFrame`, max 1200px) whose sections are bordered cells; hero rows split
into copy | facts | tools columns. App surfaces use panel cards on the
`--radius-screen` radius with `--shadow-panel` elevation.

## Voice

The interface is a polite, faintly menacing institution. Confirmations are
deadpan ("Timeline filed."), empty states are institutional, errors stay calm.
Never chirpy, never emoji. Marketing copy is plain English, outcome-first —
and never says "the loop".
