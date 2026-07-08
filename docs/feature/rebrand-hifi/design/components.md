# TVA · Amber Mainframe — Component Reference

**Version 1.0.0** · Companion to [`design.md`](design.md). Every component follows one template: **Anatomy · Variants · Sizes · States · Tokens · Accessibility · Do / Don't.** States are always: default, hover, focus-visible, active, disabled, and (where relevant) error/selected. All components map to shadcn/Radix primitives — preserve their built-in keyboard and ARIA behavior when customizing.

Legend for tokens: semantic tokens (`--primary`, `--destructive`, …) are defined in [`tva-theme.css`](tva-theme.css) / [`design.md` §4](design.md#4-design-tokens). "Derived tint" = `color-mix(in srgb, var(--role) var(--tint-*), transparent)`.

---

## Contents
**Actions & input:** Button · Checkbox · Radio · Switch · Text input · Textarea · Select · Slider
**Data & display:** Status chip · Badge/Tag · Avatar · Table · Progress · Meter · Stepper · Spinner · Code · Kbd
**Feedback:** Alert · Toast · Tooltip · Empty state
**Navigation & overlay:** Tabs · Breadcrumb · Pagination · Dropdown menu · Dialog

---

## Actions & input

### Button
- **Anatomy:** container (border + optional fill) · label (`--font-label`, uppercase-tracked) · optional leading/trailing icon.
- **Variants:** `solid` (primary fill) · `default`/ghost (bordered) · `subtle` (muted) · `danger` (destructive).
- **Sizes:** `sm` 8/11px · base 12/16px · `lg` 15/22px.
- **States:** default (border `--line-hot`) · hover (fill +8% brightness, `--glow-strong`) · focus-visible (`--ring`/`--glow-focus`) · active (translateY 1px, no shadow) · disabled (`--disabled-opacity`, no pointer events).
- **Tokens:** `--primary`/`--primary-foreground`, `--destructive`, `--border`, `--radius`, `--glow-*`.
- **Accessibility:** ≥44×44px touch target; visible focus ring always; label ≥4.5:1 (solid primary uses paired `-foreground` ink — verified 4.9:1 light); state signaled by fill+shadow+position, not color alone.
- **Do / Don't:** Do keep one `solid` primary per view. Don't ship two competing primaries or hover-only affordances.

### Checkbox
- **Anatomy:** native `input[type=checkbox]` + label.
- **States:** unchecked · checked (brand fill via `accent-color`) · focus-visible · disabled · indeterminate (set via JS `indeterminate`).
- **Tokens:** `accent-color: var(--primary)`; label uses `--foreground`.
- **Accessibility:** always pair with a `<label>` (clickable); group related boxes in a `<fieldset>`/`legend`; indeterminate must also set `aria-checked="mixed"`.
- **Do / Don't:** Do use for multi-select. Don't use a checkbox for a single mutually-exclusive on/off — use Switch.

### Radio
- **Anatomy:** native `input[type=radio]` + label, in a group.
- **States:** as Checkbox minus indeterminate; one selected per group.
- **Tokens:** `accent-color: var(--primary)`.
- **Accessibility:** wrap the set in `<fieldset>` with a `<legend>`; arrow keys move selection (native); never leave a group with no default unless intentionally optional.
- **Do / Don't:** Do use for 2–5 exclusive options. Don't exceed ~6 — use Select.

### Switch
- **Anatomy:** hidden checkbox · track (`.tk`) · thumb (`::after`) · label.
- **States:** off (thumb `--fg-dim`, track `--bg-3`) · on (thumb `--primary`, track derived-primary tint) · focus-visible (`--glow-focus`) · disabled.
- **Tokens:** `--primary`, `--line-hot`, `--radius`, `--glow-focus`.
- **Accessibility:** the real control is the checkbox (keyboard-operable); `role="switch"` + `aria-checked` if rebuilt without a native input; label is clickable.
- **Do / Don't:** Do use for immediate on/off of a single setting. Don't use for actions needing a submit — use Checkbox + button.

### Text input
- **Anatomy:** field container · value (`--font-mono`) · label · optional error message.
- **States:** default (`--input` border) · focus (`--glow-focus`, border `--primary`) · error (`--destructive` border + `.msg`) · disabled (`--disabled-opacity`) · placeholder (`--fg-dim`).
- **Tokens:** `--input`, `--primary`, `--destructive`, `--bg-3`, `--radius`, `--glow-focus`.
- **Accessibility:** every field has a programmatic `<label>`; error text linked via `aria-describedby` and `aria-invalid="true"`; never signal error by border color alone (include the message).
- **Do / Don't:** Do keep labels visible. Don't use placeholder as the only label.

### Textarea
- Same tokens/states as Text input; adds `resize: vertical`, `min-height`. Accessibility identical. Do provide a sensible min-height; don't disable resize without reason.

### Select
- **Anatomy:** native `select` (or Radix Select) styled as Text input.
- **States:** mirror Text input; add open/expanded when using Radix.
- **Tokens:** as Text input; menu uses `--popover`/`--shadow-pop`.
- **Accessibility:** labelled; for custom (Radix) selects, preserve typeahead, arrow navigation, and `aria-expanded`.
- **Do / Don't:** Do use for 6+ options. Don't use for 2–3 exclusive options — use Radio/segmented.

### Slider (range)
- **Anatomy:** native `input[type=range]`.
- **States:** default · focus-visible · disabled; value driven by user.
- **Tokens:** `accent-color: var(--primary)`.
- **Accessibility:** labelled; arrow keys adjust (native); expose current value in text nearby or `aria-valuetext` for non-obvious units.
- **Do / Don't:** Do show the current value. Don't use a slider where a precise numeric input is expected.

---

## Data & display

### Status chip
- **Anatomy:** dot (`.d`, glowing `currentColor`) · label (`--font-mono`, uppercase).
- **Variants:** `ok` (`--success`) · `warn` (`--warning`) · `bad` (`--destructive`).
- **Tokens:** the status color via `currentColor`; dot uses `box-shadow` glow.
- **Accessibility:** the label text carries meaning, not just the dot color; keep labels short and literal (NOMINAL / ATTENTION / VARIANCE).
- **Do / Don't:** Do use inside tables/cards for row state. Don't rely on the dot alone.

### Badge / Tag
- **Anatomy:** container (derived `--highlight`/`--accent` tint fill + tint border) · text.
- **Tokens:** derived tints from `--highlight` (neutral) or a status color; `--radius`.
- **Accessibility:** decorative-plus-text; if a tag is a filter/removable, it's a Button with `aria-label`.
- **Do / Don't:** Do keep to one or two words. Don't encode critical status in a tag color alone.

### Avatar
- **Anatomy:** square-rounded container · initials (`--font-label`) or image.
- **Tokens:** derived `--primary` tint background, `--line-hot` border, `--radius`.
- **Accessibility:** image avatars need `alt`; initials avatars get an accessible name via adjacent text or `aria-label`.
- **Do / Don't:** Do fall back to initials. Don't rely on color to distinguish users.

### Table
- **Anatomy:** `thead` (labels, `--font-label` uppercase) · `tbody` rows (`--font-mono`) · hairline row borders · hover row tint.
- **States:** row hover (derived `--primary` 8% tint) · optional selected.
- **Tokens:** `--border`, `--muted-foreground` (headers), `--font-mono`, derived primary tint (hover).
- **Accessibility:** real `<table>` semantics; `<th scope>` on headers; don't linearize data into divs without roles; keep row hover as an enhancement, not the only affordance.
- **Do / Don't:** Do right-align numeric columns. Don't pack interactive controls without keyboard access.

### Progress
- **Anatomy:** track (`--bg-3` + `--line-hot`) · bar (`--primary`, glow).
- **Tokens:** `--primary`, `--glow-soft`, `--radius`.
- **Accessibility:** `role="progressbar"` with `aria-valuenow/min/max`; pair with a text percentage.
- **Do / Don't:** Do label what's progressing. Don't use for indeterminate waits — use Spinner.

### Meter
- **Anatomy:** track · bar with a `--success`→`--warning`→`--destructive` gradient (magnitude, not progress).
- **Tokens:** `--success`, `--warning`, `--destructive`.
- **Accessibility:** `role="meter"` (or `progressbar`) with values; describe the scale.
- **Do / Don't:** Do use for a level within a known range (risk, capacity). Don't use for task progress.

### Stepper
- **Anatomy:** steps (number chip `.n` + label) joined by connectors `.ln`.
- **States:** done (`--primary` fill) · active (`--primary` border + `--glow-focus`) · upcoming (`--fg-dim`).
- **Tokens:** `--primary`, `--line-hot`, `--glow-focus`.
- **Accessibility:** mark current with `aria-current="step"`; convey done/active with icon/number, not color only.
- **Do / Don't:** Do keep to ≤5 steps. Don't make past steps look clickable if they aren't.

### Spinner
- **Anatomy:** ring with a `--primary` top arc, rotating.
- **Tokens:** `--line-hot`, `--primary`, `--glow-soft`.
- **Accessibility:** `role="status"` + visually-hidden "Loading"; under `prefers-reduced-motion` the spin slows dramatically (already handled).
- **Do / Don't:** Do use for indeterminate waits. Don't spin forever without a timeout/error path.

### Code block & Kbd
- **Code:** `--screen-*` (lit-terminal look), `--font-mono`; scrollable, preserves whitespace. Wrap in `<pre><code>`.
- **Kbd:** `<kbd>` with a raised bottom border; use for shortcuts (`⌘ K`). Don't use `kbd` for non-key text.

---

## Feedback

### Alert / Callout
- **Anatomy:** container (derived tint + border) · icon glyph · message.
- **Variants:** `info` (`--highlight` amber) · `success` · `warning` · `danger`.
- **Tokens:** derived tints from the variant color; message uses `--fg-bright`.
- **Accessibility:** `role="status"` (info/success) or `role="alert"` (warning/danger); always icon + text, never color alone; dismiss control is a focusable button with `aria-label="Dismiss"`.
- **Do / Don't:** Do keep to 1–2 actionable lines. Don't stack multiple `danger`; don't use `info` amber for a real warning.

### Toast
- **Anatomy:** container (`--shadow-pop`, left accent border `--primary`) · optional spinner/icon · message · optional action.
- **States:** enter/exit (short, mechanical); auto-dismiss timer optional.
- **Tokens:** `--shadow-pop`, `--primary`, `--popover`.
- **Accessibility:** live region (`aria-live="polite"`, or `assertive` for errors); don't auto-dismiss critical messages; keep actions reachable before dismissal.
- **Do / Don't:** Do keep brief. Don't put the only copy of important info in a transient toast.

### Tooltip
- **Anatomy:** trigger · floating bubble (`--popover`, `--shadow-pop`, `--font-mono`).
- **States:** hidden → shown on hover/focus (short fade + rise).
- **Tokens:** `--popover`, `--line-hot`, `--shadow-pop`.
- **Accessibility:** must appear on keyboard focus, not hover only; content referenced via `aria-describedby`; never put essential/only info in a tooltip.
- **Do / Don't:** Do use for terse hints. Don't hide actions or long content in tooltips.

### Empty state
- **Anatomy:** dashed container · headline (`--font-display`) · supporting line (`--fg-dim`) · optional action.
- **Tokens:** `--line-hot` (dashed), `--fg-bright`/`--fg-dim`.
- **Accessibility:** it's content, not decoration — real heading + text; include a next action where one exists.
- **Do / Don't:** Do keep copy institutional and helpful ("No active cases. The Sacred Timeline is nominal."). Don't leave a blank region.

---

## Navigation & overlay

### Tabs
- **Anatomy:** tablist (buttons, `--font-label` uppercase) · active underline (`--primary`) · panels.
- **States:** default (`--fg-dim`) · active (`--fg-bright` + underline) · focus-visible · hover.
- **Tokens:** `--primary`, `--foreground`, `--border`.
- **Accessibility:** `role="tablist/tab/tabpanel"`, `aria-selected`, arrow-key roving focus, `aria-controls` linking tab→panel (Radix Tabs provides all of this).
- **Do / Don't:** Do keep labels to 1–2 words. Don't exceed ~5 tabs — consider a Select or nav.

### Breadcrumb
- **Anatomy:** links (`--highlight`/accent) separated by a glyph, current item non-link (`--fg-bright`).
- **Tokens:** `--highlight`, `--fg-dim`, `--fg-bright`.
- **Accessibility:** wrap in `<nav aria-label="Breadcrumb">`, ordered list, current has `aria-current="page"`.
- **Do / Don't:** Do truncate long trails from the middle. Don't make the current page a link.

### Pagination
- **Anatomy:** prev/next + numbered page buttons; current has `--primary` fill.
- **States:** default · current (`.on`) · disabled (ends) · focus-visible.
- **Tokens:** `--primary`, `--line-hot`, `--bg-3`.
- **Accessibility:** `<nav aria-label="Pagination">`; current page `aria-current="page"`; disabled ends are truly disabled.
- **Do / Don't:** Do show first/last + neighbors. Don't render dozens of raw page numbers.

### Dropdown menu
- **Anatomy:** trigger · floating menu (`--popover`, `--shadow-pop`) · items (with optional kbd) · separators · destructive item.
- **States:** item hover (derived `--primary` tint) · focus (roving) · disabled.
- **Tokens:** `--popover`, `--shadow-pop`, `--primary`, `--destructive`, `--border`.
- **Accessibility:** `role="menu/menuitem"`, arrow navigation, Esc closes and returns focus to trigger, `aria-expanded` on trigger (Radix DropdownMenu provides this).
- **Do / Don't:** Do group and separate destructive actions. Don't nest more than one submenu level.

### Dialog / Modal
- **Anatomy:** scrim (`--overlay`, blur) · panel (`--shadow-pop`, `--radius-screen`) · heading · body · key-value block · footer actions · close (`.x`).
- **States:** closed/open; open traps focus.
- **Tokens:** `--overlay`, `--shadow-pop`, `--radius-screen`, `--destructive` (for destructive confirm).
- **Accessibility:** `role="dialog"` + `aria-modal="true"`, labelled by its heading (`aria-labelledby`); focus moves in on open and is trapped; Esc and scrim-click close; focus returns to the invoker on close (Radix Dialog provides this).
- **Do / Don't:** Do use for focused confirmations/short forms. Don't use a modal for long content or non-critical info.

---

*See [`design.md`](design.md) for foundations, tokens, accessibility, voice, and implementation. Independent interpretation inspired by Marvel's* Loki*. Not an official asset.*
