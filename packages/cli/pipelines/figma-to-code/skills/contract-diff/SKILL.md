---
name: contract-diff
description: Compare contract state between two git commits and produce a human-readable changelog of token and component decisions. Use after a sprint, before a deployment, or to audit what changed in the design system.
disable-model-invocation: true
argument-hint: [base-ref] [head-ref]
version: "1.0.0"
last_updated: "2026-04-27"
min_cli_version: "1.1.0"
---

# Contract Diff: $ARGUMENTS

## Purpose

Show what changed in the design system contract between two points in git history. Surfaces frontmatter field changes (status, value, resolve-decision) separately from prose changes — so you can see decisions, not just text edits.

## Steps

### Step 1 — Parse refs

From $ARGUMENTS:
- If two refs provided: `base=args[0]`, `head=args[1]`
- If one ref provided: `base=args[0]`, `head=HEAD`
- If no refs provided: `base=HEAD~1`, `head=HEAD` (last commit vs current)

### Step 2 — Get the raw diff

```bash
git diff <base> <head> -- contract/
```

If no output: report "No contract changes between <base> and <head>."

### Step 3 — Parse and format

Group changes by file. For each changed file:

**Frontmatter changes** (lines starting with `+` or `-` in the YAML block, i.e. before `---` separator):
- Extract field name and old/new value
- Highlight these: they represent decisions (status changes, value updates, resolver assignments)

**Prose changes** (lines after the frontmatter block):
- Summarize as "rationale updated" if any prose lines changed
- Do not show a full prose diff unless there are 5 or fewer changed lines

### Step 4 — Output format

```
Contract diff: <base>..<head>
<N> file(s) changed

── contract/tokens/color-primary.mdx ──
  status:           drifted → clean
  resolve-decision: "code-wins — oklch value confirmed by design lead"
  last-updated:     2026-04-20 → 2026-04-27
  rationale:        updated

── contract/components/button.mdx ──
  parity:           drifted → clean
  last-updated:     2026-04-18 → 2026-04-27
```

### Step 5 — Summary line

End with:
```
<N> tokens changed · <M> components changed · <K> decisions recorded
```

## Notes

- The git history is the snapshot store. There is no separate snapshot format — use git refs (commit hashes, branch names, tags) as your two points.
- To compare against a named release: `git tag v1.0.0` before a sprint, then `/contract-diff v1.0.0 HEAD` after.
- This skill reads git history only. It does not write to any file.
