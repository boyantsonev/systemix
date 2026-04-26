export default function ContractPage() {
  const frontmatterFields = [
    { field: "token / component", desc: "Canonical name of the token or component. Used as the slug." },
    { field: "value",             desc: "The code-side value — from globals.css or the codebase." },
    { field: "figma-value",       desc: "The Figma export value. Always hex or HSL — never OKLCH." },
    { field: "status",            desc: "clean · drifted · missing-in-figma" },
    { field: "resolved",          desc: "Boolean. True once a human has made a decision." },
    { field: "delta-e",           desc: "CIEDE2000 perceptual distance between code and Figma values. < 2.0 = imperceptible." },
    { field: "resolve-decision",  desc: "code-wins or figma-wins — written by the resolve control." },
    { field: "evidence-posthog",  desc: "30-day usage count from PostHog. Informs resolution decisions." },
    { field: "last-updated",      desc: "ISO date of the last write — by Hermes or by the resolve API." },
  ];

  return (
    <article>
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Concepts</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-4">
        MDX Contracts
      </h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-10">
        One file per token. One file per component. Human-readable, machine-parseable, authored by a local LLM.
      </p>

      <hr className="border-border/40 mb-10" />

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">What it is</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          A contract is an MDX file with two parts: a YAML frontmatter block that stores the machine-readable state (values, drift status, resolve decision, ΔE, evidence), and a prose body that holds the rationale — written by Hermes, readable by humans and agents alike.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Contracts live in two directories: <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">contract/tokens/</code> and <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">contract/components/</code>. Each file is named after the token or component slug.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-4">Token contract example</h2>
        <pre className="bg-muted/20 border border-border/40 rounded-xl px-5 py-5 font-mono text-[12px] text-foreground/80 leading-relaxed overflow-x-auto">{`---
token: color-primary
value: oklch(0.45 0.18 250)
figma-value: "#0063c4"
status: drifted
resolved: false
source: css
collection: Semantic
delta-e: 8.3
last-updated: 2026-04-26
last-resolver: null
resolve-decision: null
evidence-posthog: null
---

The primary brand colour differs between code (oklch(0.45 0.18 250)) and
Figma (#0063c4). ΔE 8.3 — clearly visible, not perceptually equivalent.

This is an active drift requiring a human decision: either update the code
to match Figma, or lock the code value and update Figma to reflect it.
The 1px OKLCH shift affects all surfaces using the primary token.`}</pre>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-5">Frontmatter fields</h2>
        <div className="space-y-px rounded-xl overflow-hidden border border-border/40">
          {frontmatterFields.map(({ field, desc }) => (
            <div key={field} className="flex items-start gap-4 px-4 py-4 bg-background border-b border-border/40 last:border-0">
              <code className="shrink-0 font-mono text-[12px] text-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap">
                {field}
              </code>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">Who writes it</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">
          Hermes (local Ollama, <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">hermes3</code> model) reads your CSS token values and Figma variable exports, then authors each MDX file — frontmatter and prose rationale. The MDX Indexer reads all contracts at build time, computes the quality score, and powers the <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">/contract</code> UI.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When you resolve a drift decision in the UI, the resolve API writes <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">resolved: true</code> and <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">resolve-decision</code> back to the frontmatter. The file is the source of truth — not a database.
        </p>
      </section>

      <section>
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">Who reads it</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Today: the MDX Indexer and the <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">/contract</code> UI. Next: the Systemix MCP server will expose contracts to agents via tool calls — so when an agent asks &quot;what is the primary colour?&quot; it gets a sourced, versioned, human-approved answer.
        </p>
      </section>
    </article>
  );
}
