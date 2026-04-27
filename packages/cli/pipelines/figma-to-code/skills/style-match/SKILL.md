---
name: style-match
description: Scrape the visual identity (colors, typography, radius) from any live URL and propose a globals.css diff that transforms Systemix to match that look and feel. Each proposed change gets a Hermes-authored contract entry. HITL gates the final apply.
disable-model-invocation: false
argument-hint: <url>
version: "1.0.0"
last_updated: "2026-04-27"
min_cli_version: "1.1.0"
---

# Style Match: $ARGUMENTS

Scrape the visual identity from the target URL, map it to Systemix tokens, and propose a look-and-feel change set for HITL approval.

## When to use

- You want to match the aesthetic of a reference site (multica.ai, a client's brand, a competitor)
- You're starting a new project and want to use an existing site as a visual baseline
- You want to generate a theme variation from any live URL

## Prerequisites

- Node 18+ (for built-in fetch)
- `src/app/globals.css` must exist — it's the target

## Steps

### Step 1 — Validate input

Extract the URL from $ARGUMENTS. If no URL is provided, stop and ask the user.

Validate the URL is reachable:
```bash
curl -sI "$URL" | head -1
```

If it returns a non-2xx status or times out, warn the user and stop. Some sites block scrapers — tell the user they can provide a manual CSS file path instead.

### Step 2 — Run the style scraper

```bash
npx tsx scripts/scrape-style.ts "$URL"
```

Parse the JSON output. Key fields:
- `mappedTokens.colors` — extracted colors mapped to Systemix var names
- `mappedTokens.other` — non-color tokens (radius, etc.)
- `fonts` — detected font families
- `extraColors` — additional CSS custom properties found on the site
- `currentValues` — current Systemix values for the same tokens
- `cssBytes` — if 0 or very small, the site may be JS-rendered (see Step 2b)
- `hasMappings` — false means no CSS custom properties found

### Step 2b — JS-rendered sites

If `hasMappings` is false or `cssBytes < 5000`, the site likely renders CSS via JavaScript. Tell the user:

> This site appears to be JS-rendered. The style scraper uses fetch-only, so it may have missed dynamic styles. Options:
> 1. Open browser DevTools → Elements → `:root` computed styles → paste the CSS variables here
> 2. Continue with partial results

If the user pastes CSS variables, parse them manually using the same mapping logic.

### Step 3 — Show the extracted palette

Display the findings in a clear table before proposing changes:

```
Source: <url>
Extracted: <N> CSS custom properties, <N> mapped to Systemix tokens

MAPPED TOKENS
─────────────────────────────────────────────────────────────
Token              Extracted value      Current value
──────────────────────────────────────────────────────────────
--background       <value>              <current>
--foreground       <value>              <current>
--primary          <value>              <current>
--muted            <value>              <current>
--border           <value>              <current>
--radius           <value>              <current>
...

FONTS DETECTED
  <font 1>, <font 2>

EXTRA COLORS (not mapped — show up to 8)
  --<var>: <value>
```

Ask the user:
> These are the tokens I can map from <url>. Shall I:
> A) Apply all mapped tokens
> B) Let me select which tokens to apply
> C) Cancel

Wait for response before proceeding.

### Step 4 — Build the diff

For each token the user approved, compute the change:

```
--background: <old_value> → <new_value>
```

Only include tokens that actually differ from the current value. Skip no-ops.

Also check: if `--radius` maps to a px value (e.g. `8px`) but the current globals.css uses `rem` (e.g. `0.5rem`), normalize to rem: `8px → 0.5rem`.

For fonts: if the site uses a Google Font that isn't loaded, note it — don't blindly set `--font-sans` to a font name that won't render.

### Step 5 — Show the full globals.css diff

Generate and display the proposed diff in a unified format:

```diff
-  --background: oklch(98% 0.002 250);
+  --background: <new_value>;

-  --foreground: oklch(0.145 0 0);
+  --foreground: <new_value>;
```

Show the diff for both light and dark sections if the site has dark mode variants (check if the CSS has `@media (prefers-color-scheme: dark)` or `[data-theme="dark"]` blocks).

Ask the user to confirm before applying.

### Step 6 — Apply the changes

For each confirmed token change:

1. **Update `src/app/globals.css`** using exact string replacement. Be surgical — only touch the specific variable lines, not the surrounding context.

2. **Update `contract/tokens/<slug>.mdx`** for each changed token:
   - Set `value` to the new value
   - Set `figma-value` to `null` (it's now unsynced)
   - Set `status` to `drifted` (code changed, Figma not updated)
   - Set `resolved` to `false`
   - Set `last-updated` to today's ISO date
   - Set `last-resolver` to `style-match`
   - Add a `style-source` frontmatter field: the URL

3. **Write Hermes rationale** to the contract prose body:
   > This token was updated by /style-match on <date>. The new value `<value>` was extracted from `<url>`. The previous value was `<old_value>`. The visual intent was to match the look and feel of the source site. Figma has not been updated — this is code-side only. Run /sync-to-figma to propagate.

   Write this even without Ollama running (it's a template, not an LLM call).

### Step 7 — Run the token converter

```bash
npm run tokens
```

This regenerates `.systemix/tokens.bridge.json` with the new values.

### Step 8 — Report

Print a summary:

```
✓ Style match applied from <url>
  <N> tokens updated in globals.css
  <N> contract files updated (status: drifted)
  Bridge file regenerated (.systemix/tokens.bridge.json)

Next steps:
  npm run dev           — preview the changes in the browser
  /sync-to-figma        — push new values to Figma variables
  /design-system        — review drift report (these tokens are now drifted)
```

## Notes

- This skill does not use Figma, Storybook, or PostHog. It reads the web and writes to `globals.css` + `contract/`.
- Some sites compress or minify CSS with hashed class names — the scraper will find fewer custom properties. This is expected.
- If the source site uses `@layer` at-rules, the CSS parser may miss some root variable declarations. The user can manually add any missed mappings.
- Color space conversions (hex → oklch) are left as-is. The browser renders both. Run `/tokens` after to normalize if needed.
- The skill sets `status: drifted` on updated tokens because Figma no longer matches code — this is correct. The quality score will drop until `/sync-to-figma` runs.
