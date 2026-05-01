---
name: storybook
description: Read, verify, and update Storybook stories. Compares screenshots against the Figma spec, reports drift, and writes evidence-storybook and storybook-drift back to the component contract.
disable-model-invocation: true
argument-hint: [Component] [--verify figma-url?] [--fix?]
---

Storybook operation for: $ARGUMENTS

## Usage
```
/storybook                                    # list all components
/storybook [Component]                        # inspect + write evidence-storybook to contract
/storybook [Component] --verify [figma-url]   # compare vs Figma spec + write storybook-drift to contract
/storybook [Component] --fix                  # update story to match Figma
```

## Steps

1. **Resolve mode from arguments**
   - No args → list mode: run `list-all-components` and `list-all-documentation`
   - Component name only → inspect: `get-documentation` + `get-story-urls` + screenshot + write contract
   - `--verify [figma-url]` → compare screenshots vs Figma spec, report drift, write contract
   - `--fix` → auto-fix: token mismatch → update CSS var, missing story → add `StoryObj`

2. **Inspect** (if component name given)
   - Locate the component file in `src/components/`
   - Read the `.stories.tsx` file alongside it
   - Collect: total story count, exported story names (variant names), `storybook-story` slug from
     `contract/components/{Component}.mdx` frontmatter

3. **Write evidence-storybook to contract** (always after inspect)
   - Read `contract/components/{Component}.mdx`
   - Write or update the `evidence-storybook` block in the frontmatter. If the block already exists,
     replace lines from `evidence-storybook:` through the last indented line that follows it.
   - Target format (2-space indent):
     ```yaml
     evidence-storybook:
       stories-count: {N}
       variants-covered:
         - {variant1}
         - {variant2}
       last-verified: {YYYY-MM-DD}
       storybook-url: {slug from storybook-story frontmatter field, or null}
     ```
   - Also update `last-updated: {YYYY-MM-DD}` in the frontmatter
   - Write atomically: write to `{path}.tmp`, then rename to `{path}`

4. **Verify** (if `--verify` flag)
   - Extract Figma design context from the provided URL
   - Take a screenshot of each story at `localhost:6006`
   - Compare against the Figma screenshot — check: dimensions, token values, visual drift score
   - Classify drift into one category:
     - `none` — all stories match the Figma spec within acceptable tolerance
     - `token-mismatch` — a story uses a hardcoded value instead of a CSS custom property
     - `missing-variant` — a Figma variant has no corresponding `StoryObj`

5. **Write storybook-drift to contract** (after verify)
   - Patch `storybook-drift:` in the MDX frontmatter (replace existing line or append after
     `evidence-storybook` block):
     ```yaml
     storybook-drift: none
     ```
   - If drift is `token-mismatch` or `missing-variant`, also write:
     ```yaml
     storybook-drift-detail: "{one concise description of the first drift instance}"
     ```
   - Write atomically via `.tmp` rename

6. **Fix** (if `--fix` flag)
   - Token mismatch → replace hardcoded values with CSS custom properties
   - Missing variant → add a new `StoryObj` for each uncovered Figma variant
   - Write the updated `.stories.tsx` file

7. **Verify build**
   - Run `npx storybook build --quiet 2>&1 | tail -20`
   - If build fails: read error, fix, retry once

## Contract write rules
- Always use atomic writes: `{path}.tmp` → rename to `{path}`
- Do not touch prose body below the closing `---`
- If `evidence-storybook:` does not exist in the frontmatter, append it before the closing `---`
- If `storybook-drift:` does not exist, append it after `evidence-storybook` block
- `storybook-drift-detail:` is only written when drift is non-`none`; remove it when drift is `none`

## Notes
- Requires Storybook running at `localhost:6006` for screenshot comparisons (`--verify` only)
- Do not delete existing stories without explicit user confirmation
- Run `/figma [url]` first to cache design context before `--verify`
- The `storybook-drift` value feeds the component's contribution to the quality score
