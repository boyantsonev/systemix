export default function EvidenceLayerPage() {
  return (
    <article>
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Concepts</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-2">
        The Evidence Layer
      </h1>
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
        The contract isn&apos;t a snapshot of the design system — it&apos;s the running record of what&apos;s been tried and what worked. When an agent, a sprint, or a new hire opens a Systemix-managed codebase, they don&apos;t start from a value. They start from the value plus the evidence that justified it.
      </p>

      <hr className="border-border/40 mb-8" />

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">Why evidence, not memory</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          Most design systems have tokens in CSS, components in Figma, and the rationale somewhere between Slack threads and a Notion page nobody reads. When an agent asks what <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">--color-primary</code> should be, it gets the current value — not the experiment that set it, not the variant that lost, not the segment that responded.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The point isn&apos;t to remember more. Plenty of tools already remember things. The point is that every claim a contract makes is backed by something a human can audit and an agent can act on: a Figma node, a PostHog event, a HITL decision, a dated rationale Hermes wrote. Memory is what you store. Evidence is what holds up under questioning.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-4">What the evidence holds</h2>
        <div className="space-y-3">
          {[
            {
              label: "Token values and drift state",
              body: "Current CSS value, last known Figma value, whether they match, when they last changed. Every sync writes to this. The basic visual-identity contract.",
            },
            {
              label: "Production evidence",
              body: "Experiment results from PostHog, attributed to the variant that ran. A hero headline that drove +47% CTR is recorded here — dated, with confidence, with the segment it tested on.",
            },
            {
              label: "Hermes rationale",
              body: "Each time a token changes or a hypothesis resolves, Hermes writes prose into the contract body — why this value, what was rejected, what to read next. Audit trail in human language.",
            },
            {
              label: "HITL decisions",
              body: "Every promote / reject / extend the loop made in the dashboard is written back. The decision and the reasoning live with the artifact, not in a meeting note.",
            },
            {
              label: "Component parity",
              body: "For each component: which tokens it consumes, its Storybook story status, its Figma-to-code parity score, and whether the variant currently shipped is the one production evidence supports.",
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
          When Claude Code, Cursor, or any MCP editor runs a Systemix skill, it reads the contract before acting. That means:
        </p>
        <ul className="space-y-2 text-[14px] text-muted-foreground list-none">
          {[
            "A /component skill knows which tokens are drifted, which are evidence-backed, and which are unresolved — before it generates a single line.",
            "A /evidence skill pulls the most recent PostHog results for the component into the contract, so the next decision reads forward, not backward.",
            "A hypothesis validation card knows the full chain: design intent → token value → variant tested → result measured → decision recorded.",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="text-muted-foreground/40 mt-0.5 shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">Built on Google&apos;s DESIGN.md</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          The contract file is a DESIGN.md — Google&apos;s open visual-identity format, Apache 2.0, shipped April 2026. Stitch and any DESIGN.md-aware tool reads our files with zero lint errors, including the WCAG AA contrast checks the linter runs automatically. The visual-identity layer round-trips through <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">design.md export</code> to Tailwind or DTCG.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Systemix&apos;s contribution is the Production Evidence section — an unknown H2 the spec preserves, with one frontmatter row per measured outcome. The format is portable. The evidence is the part nobody else writes.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">Anatomy of a contract file</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          Each contract is one DESIGN.md file. Frontmatter is machine-readable: the visual-identity block (native to the spec) plus an <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">x-systemix</code> block (extension, silently preserved by the official linter). The body is prose — written by Hermes, read by humans and agents alike.
        </p>
        <pre className="text-[12px] font-mono bg-muted/40 border border-border/40 rounded-xl p-4 overflow-x-auto text-foreground/80 leading-relaxed">{`---
token: --primary
value: oklch(0.205 0 0)
figma-value: oklch(0.21 0 0)
status: drifted
resolved: false
last-updated: 2026-04-27
last-resolver: hermes
x-systemix:
  evidence-posthog:
    experiment: hero-cta-color
    variant: darker-primary
    result: +12% CTR
    confidence: 91%
    segment: all-traffic
    recorded: 2026-04-15
---

## Production Evidence

This token was set on 2026-04-15 after the hero CTA experiment.
The darker oklch(0.205 0 0) variant drove a 12% CTR lift at
91% confidence across all traffic. The previous value
oklch(0.35 0.1 250) (a blue) was rejected — users perceived it
as less trustworthy in the context of a docs-style product.

## Hermes Notes

Current drift: Figma not yet updated. Run /sync-to-figma to
propagate. Next test queued: contrast variant on dark-mode
landing — predicted to push contrast above WCAG AA threshold
without losing the brand read.`}</pre>
        <p className="text-[14px] text-muted-foreground leading-relaxed mt-4">
          The Production Evidence section is the durable record. The value can change. The Figma node can move. The evidence — what ran, what won, when, on which segment — stays attached to the artifact it describes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">See also</h2>
        <div className="flex flex-col gap-1.5 text-[13px] font-mono">
          <a href="/docs/concepts/hypothesis-validation" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ Hypothesis Validation Loop — how the loop closes</a>
          <a href="/docs/concepts/hermes" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ Hermes — who writes the rationale</a>
          <a href="/docs/concepts/hitl" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ HITL & Decision Queue — approving evidence cards</a>
          <a href="/docs/concepts/contract" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ MDX Contracts — schema reference</a>
        </div>
      </section>
    </article>
  );
}
