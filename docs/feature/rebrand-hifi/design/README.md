# TVA · Amber Mainframe — Design System

A retro-futurist design system inspired by the Time Variance Authority (Marvel's *Loki*): warm **amber phosphor** on a dim, lifted base with a *soft*, tunable CRT treatment. shadcn/Radix-compatible tokens, light + dark, Tailwind v4.

**Version 1.0.0** · Status: Stable

---

## The set

| File | What it is |
|---|---|
| **`tva-theme.css`** | The theme. shadcn-semantic tokens: light (`:root`) / dark (`.dark`), `[data-radius]` (sharp·soft·round), `[data-type]` (square·launch), tokenized CRT `[data-crt]` (off·soft·med), and `@theme inline` for Tailwind v4. |
| **`design.md`** | System reference — principles, foundations, token model + tables, theming, accessibility, voice, implementation, changelog. |
| **`components.md`** | Full per-component specs for the whole catalog (anatomy · variants · states · tokens · a11y · do/don't). |
| **`tva-demo.html`** | Reference only — a self-contained live preview with every dial and the full component gallery. |

---

## Quick start (shadcn + Tailwind v4)

```bash
npx shadcn@latest init
```

1. Replace the generated `:root` / `.dark` in `globals.css` with **`tva-theme.css`**.
2. Copy the commented base block at the bottom of `tva-theme.css` (body/heading rules + the three `.crt-*` overlay layers) into `@layer base`, and add the overlay divs to your root layout.
3. Add the fonts (Google Fonts link in the theme header) — the two pairings are **DM Sans + Space Mono** (`launch`, default) and **Chakra Petch + JetBrains Mono** (`square`).
4. Set defaults on `<html>`: `class="dark"` and `data-radius="soft" data-type="launch" data-crt="soft"`.

Existing shadcn components re-skin automatically. Use `--success` / `--warning` / `--highlight` for status and brand-amber.

---

## Configuration at a glance

| Attribute | Values | Default |
|---|---|---|
| `class` | `dark` present / absent | dark |
| `data-radius` | `sharp` · `soft` · `round` | soft |
| `data-type` | `launch` · `square` | launch |
| `data-crt` | `off` · `soft` · `med` | soft |

All four are token swaps — wire them to a settings UI or persist per user; the component CSS never forks.

---

## Principles (short form)

Warm never cold · glow is elevation · legibility first, atmosphere second · mechanical motion · tokens over forks · bureaucracy as identity. Full rationale in [`design.md`](design.md).

---

## Accessibility

Targets WCAG 2.1 AA. Body text 10.7:1 (dark) / 11.3:1 (light); visible focus rings on every control; `prefers-reduced-motion` disables ambient CRT motion; status is always icon + text, never color alone. Details in [`design.md` §7](design.md#7-accessibility).

---

*Independent interpretation inspired by the production design of Marvel's* Loki *(production designer Kasra Farahani). Not an official Marvel asset.*
