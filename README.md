# Systemix

Systemix keeps your design system from rotting. It watches what you ship,
catches where design and code drift apart, proposes a fix with AI, you
approve it, and it remembers the reason — so your system gets sharper every
release instead of decaying.

Live: **https://getsystemix.vercel.app** · this site runs on Systemix itself.

## Quick start

```bash
npx @systemix/cli init
```

Scaffolds an instance into your repo: the validation loop (`experiments/`),
the loop skills in `.claude/skills/`, and your topology in
`systemix.config.yaml`. Ghost mode by default — it suggests, it never
touches your code without approval.

Three doors into the same files: Claude Code slash-command skills, the
`systemix` CLI (`systemix experiment new|list|measure|close|learnings`), or
an MCP connector (`experiment_*` tools) — pick whichever fits your workflow.

## What's in this repo

This is the monorepo behind Systemix:

| Path | What it is |
|---|---|
| `src/` | The Next.js app — getsystemix.vercel.app, and the reference instance this product dogfoods on itself |
| `packages/cli/` | The `@systemix/cli` package — `npx @systemix/cli init` scaffolds an instance into any repo |
| `packages/mcp-server/` | The file-backed MCP server exposing the loop (`experiment_*`, `contract_*`, HITL) to any MCP client |

See `packages/cli/README.md` for the full CLI command reference.

## License

MIT — see [LICENSE](LICENSE).
