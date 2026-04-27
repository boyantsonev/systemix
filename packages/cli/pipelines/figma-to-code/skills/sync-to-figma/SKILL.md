---
name: sync-to-figma
description: Push CSS custom property values from the codebase back to Figma variables. Reverse of /tokens. Use when you've made code-side token changes that should be reflected in Figma.
disable-model-invocation: true
argument-hint: [figma-url]
version: "1.1.0"
last_updated: "2026-04-27"
min_cli_version: "1.1.0"
---

Sync CSS token values back to Figma: $ARGUMENTS

## When to use

Run this after you've intentionally changed token values in `globals.css` and want Figma to reflect those changes. This is the reverse of `/tokens` — code is the source here, not Figma.

**Do not run this to "fix" Figma drift** — if Figma has newer values than code, run `/tokens` instead.

## Steps

### Step 0 — Staleness check (always run first)

Check whether `.systemix/tokens.bridge.json` is up to date with `globals.css`:

```bash
node -e "
const fs = require('fs');
const css = fs.statSync('src/app/globals.css').mtimeMs;
const bridge = fs.statSync('.systemix/tokens.bridge.json').mtimeMs;
if (css > bridge) {
  console.log('STALE: globals.css is newer than tokens.bridge.json');
  process.exit(1);
} else {
  console.log('OK: bridge file is current');
}
"
```

If STALE: **stop and tell the user to run `npm run tokens` first**, then re-run this skill. A stale bridge means the push will write wrong values to Figma silently.

### Step 1 — Bootstrap detection

Read `.systemix/systemix.json` and check whether Figma variables have been created:

```bash
node -e "
const cfg = require('./.systemix/systemix.json');
const collections = cfg.figma?.collections ?? {};
const allEmpty = Object.values(collections).every(c =>
  Object.keys(c.variableIds ?? {}).length === 0
);
if (allEmpty) {
  console.log('BOOTSTRAP: no Figma variables exist yet');
} else {
  console.log('UPDATE: existing Figma variables found');
}
"
```

**If BOOTSTRAP**: Figma has no variables yet. Inform the user:

> This is a first-time push. The skill will update existing Figma variables only — it cannot create them. To bootstrap the Figma file, open Figma and manually create a variable collection named `Semantic` with a Light and Dark mode, then re-run this skill. Alternatively, run `/figma-inspect` on the Figma file to verify what collections exist.

Do not proceed silently — the push will produce a "0 tokens updated, 31 no counterpart" result that looks like success but does nothing.

**If UPDATE**: continue to Step 2.

### Step 2 — Parse the Figma URL

- If URL provided in $ARGUMENTS, extract the `fileKey`
- If not, check `.systemix/project-context.json` for `figma.fileKey`
- If neither exists, ask the user for the Figma URL

### Step 3 — Spawn the `token-writer` agent

Spawn the `token-writer` agent with the Figma URL and current working directory. It will:
- Read CSS custom properties from `globals.css`
- Compare against current Figma variable values
- Build a diff (only changed values)
- Show a summary table
- Spawn `figma-writer` with a variables manifest (which will show its own HITL gate before writing)

### Step 4 — Report results

Report: tokens updated / tokens in sync / tokens with no Figma counterpart.

If any tokens have no Figma counterpart, list them by name. This is expected on a partial Figma setup — it is not an error, but it should be visible.

## Notes

- Variables are updated only, never created. Bootstrap requires manual Figma setup (see Step 1).
- The `figma-writer` agent will always ask for confirmation before writing to Figma.
- The Figma Console MCP requires Figma Desktop to be running on port 3845. This will fail silently in CI — only run from a local machine with Figma Desktop open.
