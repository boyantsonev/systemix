---
# The per-component doc contract. Frontmatter is the machine-readable half —
# keep keys stable; agents key off them (see docs/README.md).
name: ComponentName
slug: component-name
group: general
status: skeleton # ported | skeleton | deprecated
source: src/components/ComponentName.tsx
reference: null
gallery: null
platforms: [web]
related: []
---

# ComponentName

## What & when

One or two sentences: what this component is and when to reach for it
(direct, no marketing).

## Props

| Prop | Type | Default | Notes |
| ---- | ---- | ------- | ----- |
|      |      |         |       |

The source file is canonical for props; this table summarizes it.

## Usage

```tsx
import { ComponentName } from 'your-ui-package'
```

## States & variants

Enumerate variants/sizes/states and which tokens carry them.

## Platform notes & deviations

Platform splits and any accepted deviations from the reference
(link the experiment/decision that recorded them).

## Do & don't

- **Do** …
- **Don't** …
