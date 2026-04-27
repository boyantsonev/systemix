export default function MemoryLayerPage() {
  return (
    <article>
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Concepts</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-2">
        The Memory Layer
      </h1>
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
        The contract isn&apos;t a snapshot — it&apos;s a running record of decisions, rationale, and evidence. When an agent, a test, or a new sprint starts from a Systemix-managed codebase, it starts from known ground.
      </p>

      <hr className="border-border/40 mb-8" />

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">Why memory matters</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          Most design systems have tokens in CSS, components in Figma, and decisions in someone&apos;s head or a Notion page nobody reads. When an agent asks what <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">--color-primary</code> should be, it gets the current value — not why it is that value, not what was tested, not what was rejected.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Systemix&apos;s memory layer is the contract: one MDX file per token and component, living in <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">contract/</code>. Each file has two parts — a YAML frontmatter block (machine-readable state) and a prose body (human-readable rationale authored by Hermes). Together they give any agent, any team member, and any future sprint a complete picture of what exists and why.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-4">What the memory holds</h2>
        <div className="space-y-3">
          {[
            {
              label: "Token values and drift state",
              body: "Current CSS value, last known Figma value, whether they match, and when they last changed. Every sync updates this.",
            },
            {
              label: "Hermes rationale",
              body: "Each time a token changes or a decision is made, Hermes writes a prose explanation to the contract body. This is the institutional knowledge layer — readable by agents and humans.",
            },
            {
              label: "PostHog evidence",
              body: "Experiment results linked to tokens and components. A button variant that drove a 47% CTR lift is recorded here — so the next hypothesis starts from that baseline, not from scratch.",
            },
            {
              label: "Decision history",
              body: "Every HITL decision (promote, reject, run longer) is written back to the contract. The audit trail lives with the artifact it describes.",
            },
            {
              label: "Component parity",
              body: "For each component, the contract records which tokens it consumes, its Storybook story status, and its Figma-to-code parity score.",
            },
          ].map(({ label, body }) => (
            <div key={label} className="border border-border/40 rounded-xl px-4 py-4">
              <p className="text-[13px] font-semibold text-foreground mb-1">{label}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">The contract as agent context</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          When Claude Code runs a skill, it reads the relevant contract files before acting. This means:
        </p>
        <ul className="space-y-2 text-[14px] text-muted-foreground list-none">
          {[
            "A /component skill knows which tokens the component uses and whether any are drifted before it generates code.",
            "A /drift-report skill knows the history of past drift on a token — not just that it drifted, but how many times and what resolution was chosen.",
            "A hypothesis validation card knows the full chain: original design intent → token value → experiment result → decision made.",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="text-muted-foreground/40 mt-0.5 shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">Anatomy of a contract file</h2>
        <pre className="text-[12px] font-mono bg-muted/40 border border-border/40 rounded-xl p-4 overflow-x-auto text-foreground/80 leading-relaxed">{`---
token: --primary
value: oklch(0.205 0 0)
figma-value: oklch(0.21 0 0)
status: drifted
resolved: false
last-updated: 2026-04-27
last-resolver: hermes
style-source: null
posthog-evidence:
  experiment: hero-cta-color
  result: +12% CTR on darker variant
  confidence: 91%
  recorded: 2026-04-15
---

This token was last resolved on 2026-04-15 after a hero CTA
experiment showed the darker oklch(0.205 0 0) variant drove
a 12% CTR lift at 91% confidence. The previous value
oklch(0.35 0.1 250) (a blue) was rejected — users perceived
it as less trustworthy in the context of a documentation tool.

Current drift: Figma not yet updated. Run /sync-to-figma
to propagate.`}</pre>
      </section>

      <section className="mb-6">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">See also</h2>
        <div className="flex flex-col gap-1.5 text-[13px] font-mono">
          <a href="/docs/concepts/contract" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ MDX Contracts — schema reference</a>
          <a href="/docs/concepts/hypothesis-validation" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ Hypothesis Validation Loop</a>
          <a href="/docs/concepts/hermes" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ Hermes — who writes the rationale</a>
        </div>
      </section>
    </article>
  );
}
