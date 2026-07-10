# systemix

The validation loop for teams shipping with agents — installed **per repo** as a
self-contained instance.

You ship a variant, measure it, decide, and the decision gets written back as
durable memory. Systemix is that loop: **ship → measure → learn → decide**, with
every experiment a plain MDX file in your repo and every closed decision a cited
line in `experiments/LEARNINGS.md`.

`npx @systemix/cli init` scaffolds an instance into your repo: the loop (`experiments/`)
plus the loop skills in **`.claude/skills/`** (project-scoped, committed,
CI-reproducible), and your topology in **`systemix.config.yaml`**.

## Quick start

```bash
# in your project root
npx @systemix/cli init
```

The wizard sets up your instance:

| # | Question | Result |
|---|----------|--------|
| 1 | **Design substrate** — scaffold a `design/` folder, point at an existing design system, or skip | optional `design/` + `design.source` in config |
| 2 | **Signal** — wire PostHog now, or skip (experiments still run without it) | `signals.posthog` in config |
| 3 | **First experiment** — ICP · JTBD · hypothesis · the AI workflow that tests it · the metric | `experiments/<id>.mdx` |

The **loop installs always**; the design system is an optional, pluggable substrate.
After init you have:

```
experiments/
  <id>.mdx          ← your first experiment
  LEARNINGS.md      ← compounding memory; a cited line lands on every close
  goals/            ← the KPIs experiments roll up to
.claude/skills/     ← the loop skills, installed project-scoped
systemix.config.yaml
```

Commit `experiments/`, `.claude/skills/`, and `systemix.config.yaml` so the instance
is reproducible in CI.

## Three doors over the same files

The loop is plain MDX you own; drive it however fits your stack — all three read and
write the same `experiments/` files:

- **Claude Code skills** — `/init-experiment` → `/write-variants` → `/measure` →
  `/close-experiment` (human-in-the-loop).
- **CLI** — `systemix experiment new|list|measure|close|learnings|audit` (scriptable in CI).
- **MCP** — `experiment_*` tools, so any agent or AI client can call the loop.

## Commands

```bash
npx @systemix/cli init [--reconfigure]    # setup wizard (--reconfigure overwrites config)
npx @systemix/cli experiment <sub>        # drive the loop: new | list | measure | close | learnings | audit
npx @systemix/cli evidence check          # verify PostHog is wired + collecting
npx @systemix/cli config show             # print the active instance topology
npx @systemix/cli list                    # installed skills + available workflows
npx @systemix/cli doctor                  # health check (skills, MCP server, signals)
npx @systemix/cli sync [--dry-run]        # design-token sync (optional design substrate)
npx @systemix/cli tokens                  # convert globals.css → tokens bridge cache
npx @systemix/cli update                  # check + apply npm / skill-pack updates
```

## How it runs

- **Engine = Claude Code.** Synthesis, decisions, and the write-back run in Claude
  Code — no API key juggling, no local model required. (An air-gapped local-model
  mode is a deferred roadmap option, not a dependency.)
- **Local-first, no platform.** Experiments are MDX in your repo (`experiments/**`);
  the HITL queue and run state live under `.systemix/`. No database to run the loop.
- **Ghost by default.** Instances start at **ghost** autonomy — the engine proposes
  every write as a decision card; nothing lands without a human approve.
- **MCP server** exposes the loop (and any design substrate) to Claude Code / Cursor,
  so coding agents read what's been tested before they ship.

## Connect a signal (optional but recommended)

Experiments author and run with no data source — they just can't *measure* until a
signal is wired. Today the adapter is **PostHog**; run `/connect-signal` after init
to wire the capture key + reverse proxy, verify with `systemix evidence check`, then
flip `signals.posthog.enabled` on. The `signals.<source>` block is the pluggable seam
for future sources.

## Requirements

- Node.js ≥ 18
- Claude Code (or any MCP-compatible client)

Learn more: https://getsystemix.vercel.app
