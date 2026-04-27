export default function HypothesisValidationPage() {
  return (
    <article>
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Concepts</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-2">
        Hypothesis Validation Loop
      </h1>
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
        PostHog tells you what happened. The contract tells you why the baseline was what it was. Hermes reads both and proposes what to test next. Every decision closes the loop — written back to memory before the next hypothesis starts.
      </p>

      <hr className="border-border/40 mb-8" />

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-4">The loop, step by step</h2>
        <div className="space-y-0">
          {[
            {
              step: "1",
              label: "Baseline is verified",
              body: "Before any experiment runs, the contract confirms that the token values in the deployed build match what was designed. If --primary drifted before the test, you measured the wrong thing. Systemix catches this at experiment setup.",
            },
            {
              step: "2",
              label: "Experiment runs in PostHog",
              body: "A/B tests, feature flags, or funnel comparisons run normally in PostHog. Systemix doesn't replace your experimentation platform — it wraps around it.",
            },
            {
              step: "3",
              label: "Hermes reads the results",
              body: "On a 24-hour schedule (or on-demand via /drift-report), Hermes pulls event counts, experiment results, and component-level PostHog evidence via the PostHog MCP. It reads the relevant contract memory — what was designed, what was decided before, what was tried and rejected.",
            },
            {
              step: "4",
              label: "Synthesis and card generation",
              body: "Hermes generates a hypothesis validation card for the HITL queue. It includes: the experiment result, a confidence score, its synthesis reading prior contract memory, and a proposed action (promote variant, run longer, or reject).",
            },
            {
              step: "5",
              label: "Human approves or overrides",
              body: "The card surfaces in the dashboard queue. One click to approve, reject, or modify. The decision and its rationale are required before the loop closes.",
            },
            {
              step: "6",
              label: "Decision written to contract",
              body: "Hermes writes the outcome back to the contract MDX files for every affected token and component. The next experiment — and the next agent — starts from this known ground.",
            },
          ].map(({ step, label, body }) => (
            <div key={step} className="flex gap-4 pb-6">
              <div className="flex flex-col items-center gap-0 shrink-0">
                <div className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground/60 shrink-0">
                  {step}
                </div>
                {parseInt(step) < 6 && <div className="w-px flex-1 bg-border/30 mt-1" />}
              </div>
              <div className="pb-2">
                <p className="text-[13px] font-semibold text-foreground mb-1">{label}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">Why the contract makes experiments trustworthy</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          Without a verified baseline, A/B test results are unreliable. If a token drifted between the design approval and the build, your two variants are measuring noise — not your hypothesis.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="border border-border/40 rounded-xl px-4 py-4">
            <p className="text-[12px] font-bold uppercase tracking-wide text-red-400/80 mb-2">Without Systemix</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              PostHog says variant B won. But the primary color was oklch(0.45 0.18 250) in the design and oklch(0.205 0 0) in the build. You measured neither variant cleanly. The winning insight is wrong.
            </p>
          </div>
          <div className="border border-border/40 rounded-xl px-4 py-4">
            <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-400/80 mb-2">With Systemix</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Before the experiment ships, the contract confirms tokens are synced. After it completes, Hermes reads the result against the contract&apos;s history of what was tried on this component. The decision it proposes is grounded.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">What Hermes reads before synthesizing</h2>
        <ul className="space-y-2 text-[14px] text-muted-foreground list-none">
          {[
            "The current contract state for every token and component touched by the experiment",
            "The full rationale history — every previous decision and its reasoning",
            "Past PostHog evidence recorded in the contract for the same component",
            "The quality score trend — whether the design system was healthy when the experiment ran",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="text-muted-foreground/40 mt-0.5 shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-[1.1rem] font-bold tracking-tight mb-3">See also</h2>
        <div className="flex flex-col gap-1.5 text-[13px] font-mono">
          <a href="/docs/concepts/memory-layer" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ The Memory Layer — how decisions persist</a>
          <a href="/docs/concepts/hermes" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ Hermes — the synthesis engine</a>
          <a href="/docs/concepts/hitl" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">→ HITL & Decision Queue — approving hypothesis cards</a>
        </div>
      </section>
    </article>
  );
}
