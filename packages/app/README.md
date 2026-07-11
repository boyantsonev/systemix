# @getsystemix/app

The systemix **per-instance local app** — your design system as contextual
infrastructure, for humans and agents:

- **Docs** with a global Human/Machine switch (rendered prose + live preview
  iframes vs the raw manifest/frontmatter an agent reads)
- **Tokens** (canonical CSS parsed to swatches · raw + generated values)
- **Experiments** + LEARNINGS (the instance memory)
- **HITL queue** — approve/decline decision cards (reads both `.systemix/queue.json`
  and `.systemix/hitl-queue.json`)

It is a *viewer + HITL actuator over the same files* the skills, CLI and MCP
use — three-doors parity, no state of its own.

```bash
npm i -D @getsystemix/app
npx @getsystemix/cli app          # http://localhost:4400
```

Component previews: set in `systemix.config.yaml`
```yaml
app:
  preview:
    url: "http://localhost:3000"  # your dev server
    per_slug: true                # iframe <url>/preview/<slug> per component
```

Dev: `npm run build` (Vite → dist/ui), `npm run serve -- --project-root <instance>`.
