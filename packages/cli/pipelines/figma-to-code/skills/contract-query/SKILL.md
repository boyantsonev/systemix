---
name: contract-query
description: Query the design system contract for token or component rationale. Returns Hermes-authored prose and frontmatter for a given token name, CSS variable, or component slug. Use when an agent or developer needs a sourced answer about a design decision without hallucinating.
disable-model-invocation: true
argument-hint: <token-name-or-component-slug>
version: "1.0.0"
last_updated: "2026-04-27"
min_cli_version: "1.1.0"
---

# Query Design System Contract: $ARGUMENTS

## Purpose

Return the sourced, Hermes-authored rationale for a design token or component from the contract. This is the skill that makes the contract queryable — not a search engine, but a lookup with prose.

## Steps

### Step 1 — Parse the query

Extract the query from $ARGUMENTS. Normalize it:
- Strip leading `--` (e.g. `--color-primary` → `color-primary`)
- Convert kebab-case to match MDX filenames (already kebab: `color-primary.mdx`)

### Step 2 — Search contract files

List all MDX files in `contract/tokens/` and `contract/components/`. For each file:
1. Check if the filename (without `.mdx`) matches the query (exact or substring)
2. Also check the `token:` or `component:` frontmatter field for a match

Use a fuzzy match: if the query is `color-primary`, match `color-primary.mdx`, `color.primary.mdx`, or any file whose `token` field contains `color-primary`.

### Step 3 — Display the result

For a matching token contract, display:

```
Token: <fm.token>
Status: <fm.status>            Collection: <fm.collection>
Value (code): <fm.value>       Value (Figma): <fm.figma-value>
Last updated: <fm.last-updated>  Resolved by: <fm.last-resolver>
Decision: <fm.resolve-decision>

Rationale:
<prose content>
```

For a matching component contract, display:

```
Component: <fm.component>
Parity: <fm.parity>            Path: <fm.path>
Last updated: <fm.last-updated>

Rationale:
<prose content>
```

### Step 4 — Handle no match

If no file matches:
1. List all available token slugs and component slugs (one per line)
2. Say: "No contract found for '<query>'. Available contracts listed above."

## Notes

- The contract is the source of truth. If a token isn't in the contract, it hasn't been through Hermes yet — run `npm run generate-contracts` to populate it.
- This skill does not call any MCP or external service. It reads local MDX files only.
- For the full rationale behind all tokens at once, open `/design-system` in the browser.
