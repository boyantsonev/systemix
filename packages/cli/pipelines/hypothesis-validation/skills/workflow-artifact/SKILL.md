---
name: workflow-artifact
description: Turn a saved workflow (or an experiment's `workflow` frontmatter) into a portable, shareable Atlas view — a single self-contained artifact that renders the step-node graph with no repo, dev server, or network access required. The workflow data is baked in at generation time (a snapshot), so it works anywhere. Read-only; it renders an existing workflow, it does not author or run one.
argument-hint: "[workflow slug | experiment id]"
version: "0.1.0"
last_updated: "2026-07-08"
min_cli_version: "1.1.0"
---

# Render a workflow as a portable Atlas artifact

## Purpose

Take a workflow that already exists — one authored by `/build-workflow`
(`.systemix/workflows/<slug>.json`) or embedded in an experiment's `workflow`
frontmatter — and produce a **portable, self-contained view** of it: a single
artifact that draws the step-node graph and can be opened by anyone, with no repo
checked out and no dev server running.

This is the **light-weight / shareable** counterpart to the in-app Atlas (the full
ReactFlow graph, gated behind the running app). Use it to hand a workflow to someone
who doesn't have the repo open, or as a quick visual to drop into a doc or a message.

## The data rule (why the data is baked in)

**The artifact sandbox has a strict CSP: it blocks `fetch`/XHR/WebSocket to any
external host — including `http://localhost:3001`.** So the artifact **cannot** pull
live data from the running app. That path is closed; do not attempt a localhost fetch.

Therefore: **bake the workflow's `steps` + `edges` into the artifact at generation
time** — embed the JSON directly in the page. The artifact is a *snapshot*; regenerate
it (`/workflow-artifact <slug>`) to update. This always works and needs no network.

**Optional live-refresh (progressive enhancement only):** if a Cowork MCP bridge is
present at runtime (`window.cowork?.callMcpTool`), the artifact MAY offer a "refresh"
button that calls `list_workflows` / `get_workflow` and re-renders. This is a
privileged bridge, not a raw fetch. **Never depend on it** — if it's absent, the baked
snapshot stands. Never fall back to a localhost fetch.

## Steps

### 1. Resolve the workflow (read-only)
- From `.systemix/workflows/<slug>.json` (a `PersistedWorkflow`: `{ name, steps, edges }`),
  or an experiment's `workflow:` frontmatter (`{ steps, edges }`), or accept `steps` +
  `edges` passed inline.
- **Validate before rendering**: every `edge.from`/`edge.to` references a real step
  `id`; every step `kind` is one of `input · agent · router · parallel · tool · human ·
  output`; the graph is connected. If it fails, say what's wrong and stop — don't render
  a broken graph.

### 2. Build the self-contained artifact
Generate one HTML page, **fully self-contained and CSP-safe**:
- **Embed the data**: write the resolved `{ name, steps, edges }` inline (e.g. a
  `<script type="application/json">` block the page reads on load) — no fetch.
- **Render the step-node graph** using the Atlas visual vocabulary (glyph drives the
  node, never colour alone):

  | kind | glyph | | kind | glyph |
  |---|---|---|---|---|
  | `input` | ▷ | | `tool` | ⌗ |
  | `agent` | ✦ | | `human` | ⊙ |
  | `router` | ⋔ | | `output` | ✓ |
  | `parallel` | ≣ | | | |

  Each node shows its glyph + `label`; edges connect nodes in flow order, with
  **router branch `label`s drawn on the edge**. Clicking/hovering a node reveals its
  `note` (and `agent`/`screen` when set) in a detail panel. Inline SVG or CSS/DOM —
  either is fine; keep it legible on phone and desktop.
- **CSP-safe, no exceptions**: inline all CSS and JS; **no** CDN scripts, external
  stylesheets, web fonts, or remote images; no `fetch` to any host. Embed any asset as
  a `data:` URI. Make it **theme-aware** (`prefers-color-scheme`, light + dark).

### 3. Publish
Publish the page as an artifact (the `Artifact` tool / `mcp__cowork__create_artifact`):
title = the workflow's name, a one-line description, a favicon. Return the URL.

### 4. Report
Give the shareable URL and state plainly it's a **snapshot** of the workflow as of now
— re-run `/workflow-artifact <slug>` to refresh it. Point at `/build-workflow` to change
the workflow itself, or `/atlas` for the executable runner version.

## Guardrails

- **Self-contained & CSP-safe, always**: no external requests of any kind; no localhost
  fetch (it is blocked by the sandbox CSP). Baked-in data is the source of truth.
- **Snapshot, not live**: the artifact reflects the workflow at generation time. The
  optional `window.cowork` refresh is a progressive enhancement, never a requirement.
- **Read-only**: this skill renders an existing workflow; it never authors, edits, or
  runs one. Authoring is `/build-workflow`; the executable loop is `/atlas`.
- **Valid vocabulary only**: render only the seven StepKinds; refuse a workflow whose
  edges reference missing steps rather than drawing a broken graph.
