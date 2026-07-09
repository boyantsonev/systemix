# TVA · Amber Mainframe — Design System

**Version 1.0.0** · Status: Stable · Last updated: 2026-07-08

A retro-futurist design system inspired by the Time Variance Authority (Marvel's *Loki*): warm **amber phosphor** on a dim, lifted base with a *soft* CRT treatment. It renders software as a warm 1971 computer room — bureaucratic, quietly powerful, legible — rather than a bright office or a black hacker terminal. Ships as shadcn/Radix-compatible tokens with light/dark themes.

---

## Table of contents

1. [Overview](#1-overview)
2. [Design principles](#2-design-principles)
3. [Foundations](#3-foundations) — color · typography · spacing · radius · elevation · motion
4. [Design tokens](#4-design-tokens) — tier model · naming rules · reference tables
5. [Theming & configuration](#5-theming--configuration) — light/dark · dials
6. [Components](#6-components) — spec template + full specs + catalog
7. [Accessibility](#7-accessibility)
8. [Content & voice](#8-content--voice)
9. [Implementation](#9-implementation)
10. [Changelog & contribution](#10-changelog--contribution)
11. [Files](#11-files)

---

## 1. Overview

### What it is
An opinionated, warm, retro-CRT theme layer for shadcn/ui + Tailwind v4. It is a *theme and token system*, not a component library — it reskins standard shadcn/Radix primitives and adds a thin layer of CRT atmosphere (soft glow, feathered scanlines, a lit terminal surface).

### When to use it
Use it for products that benefit from character and warmth: internal tools, dashboards framed as "mission control," developer tools, landing pages, or anything where a distinctive institutional-retro identity is an asset.

### When *not* to use it
Avoid it for high-density data products that must feel neutral, regulated/medical contexts requiring maximum clarity, or brands that need a cool, minimal, or corporate-generic look. The CRT effects are decorative; if the product can't spend any legibility budget on atmosphere, set `data-crt="off"`.

### The core tension to preserve
*Warm vs. oppressive, friendly vs. institutional, obsolete vs. all-powerful.* When a screen feels too clean/modern, it has lost the TVA. When it feels too dark/Matrix, it has overshot. The target is a dim, warm, amber-lit control room.

---

## 2. Design principles

1. **Warm, never cold.** The palette is fully warm — no blue, no cool grey. Amber phosphor gives the retro-terminal read without the Matrix-green chill and stays close to TVA burnt-orange DNA.
2. **Glow is elevation.** Importance is expressed with a soft bloom and a hotter border, not a hard neon edge. Floating things glow/shadow more than inset things.
3. **Legibility first, atmosphere second.** Effects are a dial, not a default assumption. Body text stays high-contrast; scanlines/glow never sit on long-form reading.
4. **Mechanical, not organic, motion.** Transitions are smooth-mechanical, short, and settle hard. No springy or floaty easing.
5. **Tokens over forks.** Light/dark, radius, type, and CRT intensity are all attribute-driven token swaps. Component CSS never branches on theme.
6. **Bureaucracy as identity.** Case numbers, reference IDs, mono readouts, deadpan copy. The interface is paperwork that happens to be interactive.

---

## 3. Foundations

### 3.1 Color
The system is fully warm. Neutrals run paper→espresso; the single brand signal is burnt orange; amber is the highlight/glow; olive = success, red = destructive. Roles below; exact values in [§4.3](#43-color-reference).

| Role | Light | Dark | Meaning |
|---|---|---|---|
| Background | `#ECE3CB` | `#16100A` | The room you're in |
| Surface (card) | `#F4ECD6` | `#1E1710` | A document / panel |
| Primary | `#A8511A` | `#FF9E3D` | The one important action |
| Highlight (amber) | `#B07A16` | `#FFC24D` | Glow, seal, readouts, focus |
| Success | `#5D6626` | `#B7C46A` | Nominal / verified |
| Warning | `#8A5A00` | `#FFD84D` | Attention |
| Destructive | `#A8412C` | `#FF6A4A` | Prune / delete |
| Text | `#332815` | `#EFE5D3` | body is warm white; amber = accents (v1.1) |

**Rule:** primary orange is *earned* — one primary action per view. It is a fill/large-text color, never body text (see contrast in [§7](#7-accessibility)).

### 3.2 Typography
Type is **role-based** — `--font-display` (headings), `--font-sans` (body/UI), `--font-mono` (data + terminal), `--font-label` (labels/buttons) — so a pairing is four token swaps plus heading case/tracking. Two production pairings ship (see [§5.3](#53-type-dial-data-type)); the retro feel comes from amber + scanlines + mono, letting the letterforms stay modern.

Type scale (rem, 1.125–1.25 ratio in practice): `xs .75` · `sm .875` · `base 1` · `lg 1.125` · `xl 1.25` · `2xl 1.5` · `3xl 1.9`.

### 3.3 Spacing
4px base scale: `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 24 · `-6` 32. Use for padding, gaps, and stack rhythm.

### 3.4 Radius
A single `--radius` drives `--radius-sm/md/lg/xl` (shadcn convention); `--radius-screen` (= `--radius × 2`) is used on large "tube" panels and terminals. The radius dial ([§5.2](#52-radius-dial-data-radius)) sets the base.

### 3.5 Elevation
Two distinct layers, deliberately separated:

- **`--shadow-panel`** — inset/low, for resting surfaces (cards, panels). On dark it includes an inner darkening + soft glow; on light it's a soft warm shadow.
- **`--shadow-pop`** — higher and darker, for *floating* things (menus, tooltips, dialogs). `--overlay` is the modal scrim.

### 3.6 Motion
Easing `--ease: cubic-bezier(.33,0,.2,1)` (smooth-mechanical); base duration `--duration: 260ms`. CRT ambient motion (breathe, sweep) is slow and optional. **All ambient motion is disabled under `prefers-reduced-motion`.**

---

## 4. Design tokens

### 4.1 Tier model
Tokens follow a three-tier structure (per the W3C Design Tokens format and EightShapes naming guidance):

1. **Primitive (base)** — raw, context-free values. In this system these are the literal hex ramps and the CRT primitives (`--screen-*`, glow values). Not consumed directly by components.
2. **Semantic (system)** — role-named, theme-aware: `--background`, `--foreground`, `--primary`, `--destructive`, `--border`, `--ring`, etc. **This is the layer components consume.**
3. **Component** — only introduced when a component needs a value the semantic layer can't express. This system deliberately keeps this layer near-empty (state tints are *derived*, not stored — see [§4.5](#45-derived-state-tints)).

### 4.2 Naming rules
- Semantic color tokens use shadcn names: `--<role>` and `--<role>-foreground` (the paired text color). Example: `--primary` / `--primary-foreground`.
- Non-shadcn additions are namespaced by intent: status (`--success`, `--warning`), brand accent (`--highlight`), CRT (`--crt-*`, `--screen-*`, `--glow-*`), elevation (`--shadow-*`), layout (`--space-*`, `--radius-*`).
- Never bake a raw hex into a component; reference a semantic token. Never invent a `--x-bg` tint token — derive it ([§4.5](#45-derived-state-tints)).
- Theme differences live only in `:root` (light) and `.dark`. Structural tokens (radius, type, spacing, CRT multipliers) live in theme-independent `:root`.

### 4.3 Color reference

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `#ECE3CB` | `#16100A` | App background |
| `--foreground` | `#332815` | `#EFE5D3` | Body text (warm white on dark — v1.1) |
| `--card` / `--card-foreground` | `#F4ECD6` / `#332815` | `#1E1710` / `#EFE5D3` | Cards, panels |
| `--popover` / `-foreground` | `#F9F2E2` / `#332815` | `#0D0905` / `#EFE5D3` | Menus, tooltips |
| `--primary` / `-foreground` | `#A8511A` / `#FBF3E2` | `#FF9E3D` / `#1A1206` | Primary action |
| `--secondary` / `-foreground` | `#DFD3B4` / `#332815` | `#271E14` / `#EFE5D3` | Low-emphasis surface/button |
| `--muted` / `-foreground` | `#E4DED0` / `#7A6A48` | `#271E14` / `#B39B6E` | Muted surfaces / secondary text |
| `--accent` / `-foreground` | `#EAD9B0` / `#332815` | `#2B2417` / `#F5EDDD` | **Subtle** hover surface (not brand amber) |
| `--destructive` / `-foreground` | `#A8412C` / `#FBF3E2` | `#FF6A4A` / `#1A1206` | Delete / prune |
| `--success` / `-foreground` | `#5D6626` / `#FBF3E2` | `#B7C46A` / `#1A1206` | Nominal (extension) |
| `--warning` / `-foreground` | `#8A5A00` / `#FBF3E2` | `#FFD84D` / `#1A1206` | Attention (extension) |
| `--highlight` / `-foreground` | `#B07A16` / `#241C10` | `#FFC24D` / `#1A1206` | Brand amber: seal, readouts (extension) |
| `--border` / `--input` | `#CFC0A0` | `#3A2A12` | Hairlines, field outlines |
| `--ring` | `#A8511A` | `#FFC24D` | Focus ring |

> **Semantic note:** shadcn's `--accent` means "subtle hover surface," so it is a warm neutral here, **not** the vivid amber. The vivid amber is the extension `--highlight`, which also drives `--ring` on dark. This keeps stock shadcn hover/highlight behavior correct while preserving the amber accents.

### 4.4 Structural tokens

| Token | Value | Notes |
|---|---|---|
| `--radius` | `0` / `.3125rem` / `.625rem` | Set by radius dial (sharp/soft/round) |
| `--radius-sm/md/lg/xl` | derived from `--radius` | shadcn calc convention |
| `--radius-screen` | `--radius × 2` | Large tube panels, terminals |
| `--space-1…6` | 4/8/12/16/24/32px | Spacing scale |
| `--disabled-opacity` | `.42` | Applied to all disabled elements |
| `--ease` / `--duration` | `cubic-bezier(.33,0,.2,1)` / `260ms` | Motion defaults |
| `--font-sans/-display/-mono/-label` | per type dial | Role fonts |
| `--tracking-heading` / `--case-heading` | per type dial | Heading tracking / casing |

### 4.5 Derived state tints
Instead of storing `--danger-bg`, `--ok-bg`, etc., tinted fills/borders are **derived** from the semantic color with `color-mix` and three shared strength knobs — so every alert, tag, chip, and hover tint stays consistent and auto-adapts across themes and any recolor:

```css
--tint-weak: 12%;  /* fill   */
--tint-mid:  16%;  /* stronger fill */
--tint-line: 42%;  /* border */

/* usage */
background: color-mix(in srgb, var(--destructive) var(--tint-weak), transparent);
border-color: color-mix(in srgb, var(--destructive) var(--tint-line), transparent);
```

### 4.6 CRT & screen tokens
- **`--screen-*`** (background/foreground/border/success/destructive/warning/glow) are **theme-independent** — the terminal stays a lit CRT in both light and dark.
- **`--glow-text/-head/-soft/-strong/-focus`** recreate phosphor bloom; on light they degrade to soft shadows / `none`.
- **`--crt-*`** drive the effect layers (see [§5.4](#54-crt-dial-data-crt)).

---

## 5. Theming & configuration

All configuration is attribute-driven on the root element and can be wired to a settings UI or persisted per user.

### 5.1 Light / dark
`:root` = light, `.dark` = dark (shadcn's default class). Light is a *daylight printout* (warm paper, glow→soft shadow, sweep hidden, scanlines faint) — **not** a naive inversion. The terminal panel stays a lit dark screen in both, preserving the CRT identity with the lights on.

### 5.2 Radius dial (`data-radius`)
`sharp` (0), `soft` (5/10px — default, current look), `round` (10/20px).

### 5.3 Type dial (`data-type`)
| Value | Pairing | Character | Heading case |
|---|---|---|---|
| `launch` (default) | DM Sans + Space Mono | Modern neutral sans + complementary square mono (getdesign/launch-kit) | sentence |
| `square` | Chakra Petch + JetBrains Mono | Squared techno / control-panel signage | sentence |

### 5.4 CRT dial (`data-crt`)
Tokenized as a strength multiplier × per-theme ceiling. Effective scanline alpha = `calc(var(--crt-scan-strength) × var(--crt-scan-max))`.

| Value | scan-strength | sweep | breathe | Use |
|---|---|---|---|---|
| `off` | 0 | 0 | 0 | Dense content, max legibility |
| `soft` (default) | 1 | 1 | 1 | Recommended everyday |
| `med` | 1.8 | 1.2 | 1 | Hero / marketing screens |

---

## 6. Components

### 6.1 Component spec template
Every component in this system is documented with: **Anatomy** (parts), **Variants**, **Sizes**, **States** (default / hover / focus-visible / active / disabled / error), **Tokens used**, **Accessibility**, and **Usage do/don't**. Two fully-specced examples follow; the rest of the catalog ([§6.4](#64-catalog)) references the same template.

### 6.2 Button

**Anatomy:** container (border + fill) · label (`--font-label`, uppercase-tracked) · optional leading/trailing icon.

**Variants:** `solid` (primary fill), `default/ghost` (bordered), `subtle` (muted border/text), `danger` (destructive).
**Sizes:** `sm` (8/11px), base (12/16px), `lg` (15/22px).

**States**

| State | Treatment | Token |
|---|---|---|
| Default | transparent/fill + `--line-hot` border | `--primary`, `--border` |
| Hover | fill brightens ~8%, `--shadow-strong` bloom | `--glow-strong` |
| Focus-visible | focus ring | `--ring` / `--glow-focus` |
| Active | translateY(1px), shadow removed | — |
| Disabled | `opacity: var(--disabled-opacity)`, no pointer events | `--disabled-opacity` |

**Accessibility:** min 44×44px hit target for touch; focus-visible ring must be present (never `outline:none` without a replacement); label contrast ≥4.5:1 (solid primary uses dark ink on light theme, verified 4.9:1); state is conveyed by more than color (fill + shadow + position).

**Do / Don't:** Do keep one `solid` primary per view. Don't use two competing primaries; don't rely on hover-only affordances for touch.

### 6.3 Alert / Callout

**Anatomy:** container (tinted fill + border) · icon glyph · message.
**Variants:** `info` (amber/`--highlight`), `success`, `warning`, `danger`.

**States/behavior:** static; dismissible variants add a close control (focusable, `aria-label="Dismiss"`). Backgrounds and borders are **derived tints** ([§4.5](#45-derived-state-tints)), not stored tokens.

**Accessibility:** use `role="status"` (info/success) or `role="alert"` (warning/danger) so screen readers announce; never encode meaning by color alone — always include the icon glyph and text; tint contrast keeps message text ≥4.5:1.

**Do / Don't:** Do keep messages one to two lines and actionable. Don't stack more than one danger alert; don't use `info` amber for a genuine warning (reserve `warning`).

### 6.4 Catalog
Full per-component specs for the entire catalog live in **[`components.md`](components.md)**. The demo exercises the full set below; each follows the [§6.1](#61-component-spec-template) template. Buttons (3 sizes + disabled/subtle), checkbox, radio, switch, text input (default/focus/error/disabled), textarea, range, select, progress bar, meter, stepper, spinner, tabs, data table, tag, avatar, alert (4 variants), tooltip, dropdown menu, breadcrumb, pagination, kbd, code block, empty state, toast, dialog (with scrim).

**Cross-cutting rules the catalog surfaced:**
- Native `checkbox`/`radio`/`range` inherit brand via `accent-color: var(--primary)` (one line, no re-skin).
- Floating components (menu, tooltip, dialog) use `--shadow-pop` + `--overlay`, never `--shadow-panel`.
- "Info" stays warm (reuses `--highlight`) — the system has no blue.
- Corner rounding animates via a `border-radius` transition so the radius dial feels live.

---

## 7. Accessibility

**Target:** WCAG 2.1 AA.

**Contrast (measured):**

| Context | Ratio |
|---|---|
| Dark — body text on `#16100A` | 15.1:1 (v1.1 warm white) |
| Dark — headings 15.1:1 · muted 7.0:1 · primary 9.2:1 · highlight 11.8:1 · success 10.0:1 · destructive 6.7:1 |
| Light — ink on `#ECE3CB` | 11.3:1 |
| Light — headings 13.2:1 · success 4.8:1 · destructive 4.8:1 · primary-button ink | 4.9:1 |

- `--muted-foreground` sits ~3.5–4:1 — muted/large text only, never body.
- On light, `--primary`/`--highlight` are mid-tones — use as fills or large text, not small body copy.

**Focus:** every interactive element exposes a visible `--ring` / `--glow-focus` on `:focus-visible`. Do not remove outlines without a token-based replacement.

**Motion:** `prefers-reduced-motion: reduce` disables the CRT breathe and sweep and the cursor blink. Core state transitions remain (they're short and non-vestibular).

**Keyboard & semantics:** components map to Radix/shadcn primitives, which provide roving focus, `aria-*`, and escape/return behavior for menus, tabs, and dialogs. Preserve these when customizing.

**Targets:** interactive controls should meet a 44×44px touch target (AAA 2.5.5) where space allows.

**Color independence:** status is always conveyed by icon/text plus color (see Alerts), never color alone.

---

## 8. Content & voice

The interface is a polite, faintly menacing institution.

- **Nouns:** variance, timeline, case, dossier, requisition, sequence, nominal, pruned.
- **Reference numbers everywhere:** `CASE TVA-6162-A`, `SEQ 1.2.4`.
- **Confirmations are deadpan:** "Timeline filed." — not "Yay, done! 🎉"
- **Empty states are institutional:** "No active cases. The Sacred Timeline is nominal."
- **Errors stay calm and ominous:** "Variance detected. Escalate to a supervisor."
- Never chirpy, never emoji. Dry humor is fine; enthusiasm is not.

---

## 9. Implementation

**Stack:** Tailwind v4 + shadcn/ui. Colors are full values (hex) in `:root`/`.dark`, mapped to Tailwind utilities via `@theme inline` (`bg-background`, `text-primary`, `rounded-lg`, `font-display`, `text-highlight`, …).

**Adopt:**
1. `npx shadcn@latest init`
2. Replace the generated `:root` / `.dark` in `globals.css` with `tva-theme.css`.
3. Add the CRT overlay layers and base `body`/heading rules (commented block at the bottom of `tva-theme.css`) into `@layer base`.
4. Load the two type pairings' fonts (Google Fonts link in the theme header).

Existing shadcn components re-skin automatically. Add `--success` / `--warning` / `--highlight` where you need status or brand-amber.

**Reduced-motion & performance:** the effect layers are three fixed, `pointer-events:none` overlays; keep them outside frequently-repainting containers.

---

## 10. Changelog & contribution

### Changelog
- **1.1.0** (2026-07-08) — Readability revision: dark body text goes warm white (`#EFE5D3`; muted `#B39B6E`); amber reserved for labels, values, glows, and actions. CRT effect scoped to screen surfaces (`.crt-panel` / `.terminal`) — the three global fixed overlays are removed; the soft-grid (hairline-framed cells) becomes the marketing layout.
- **1.0.0** (2026-07-08) — First stable release. shadcn-semantic tokens; light/dark; radius (sharp/soft/round); type (launch/square); tokenized CRT (off/soft/med); derived state tints; component catalog; accessibility pass.
- **0.x** — Exploration: mid-century warm set, green/amber/glitch CRT channels, "console" in-between; converged on soft-amber CRT.

### Versioning
Semantic versioning. **Major:** token renames/removals or breaking semantic changes. **Minor:** new tokens/variants/components (additive). **Patch:** value tweaks, docs, contrast fixes.

### Contributing
1. Add colors at the **semantic** tier; never hard-code hex in components. Derive state tints ([§4.5](#45-derived-state-tints)).
2. New tokens must land in both `:root` and `.dark`, plus `@theme inline` if they should become Tailwind utilities.
3. Document any new component with the [§6.1](#61-component-spec-template) template and include a contrast check.
4. Preserve `prefers-reduced-motion` handling and focus-visible rings.

---

## 11. Files

- **`README.md`** — index & getting-started.
- **`tva-theme.css`** — the CSS. shadcn-semantic production theme: light/dark (`:root` / `.dark`), `[data-radius]` sharp·soft·round, `[data-type]` square·launch, tokenized CRT `[data-crt]` off·soft·med, `@theme inline` for Tailwind v4.
- **`design.md`** — this document (system reference).
- **`components.md`** — full per-component specs for the whole catalog.
- **`tva-demo.html`** — reference only. Self-contained live preview with every dial and the full component gallery; renders from its own inline tokens (it exposes extra exploratory type options). Treat it as the visual spec; `tva-theme.css` is the source of truth for a build.

---

*Independent interpretation inspired by the production design of Marvel's* Loki *(production designer Kasra Farahani). Not an official Marvel asset.*
