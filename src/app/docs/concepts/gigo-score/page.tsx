export default function QualityScorePage() {
  const tiers = [
    { score: "≥ 0.90", state: "Clean",   dot: "bg-emerald-500", body: "All conflicts resolved. Safe to use in agent workflows and CI." },
    { score: "≥ 0.80", state: "Drifted", dot: "bg-amber-500",   body: "Unresolved conflicts exist. Agents will encounter ambiguous values. Triage before relying on the contract." },
    { score: "< 0.80", state: "Blocked", dot: "bg-red-400",     body: "Too many unresolved conflicts. The MCP server refuses to start until the score is raised." },
  ];

  return (
    <article>
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Concepts</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-4">
        Quality Score
      </h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-10">
        A 0.0–1.0 measure of how resolved and sourced your <code className="font-mono text-[14px] bg-muted/60 px-1.5 py-0.5 rounded">contract.json</code> is. Below 0.80, the MCP server won&apos;t start.
      </p>

      <hr className="border-border/40 mb-10" />

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">What it measures</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The score reflects how much of your token set is fully reconciled — values agreed upon by both sources, or explicitly decided when they disagreed. A low score means agents reading the contract will encounter tokens where the right value is still ambiguous.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-4">Formula</h2>
        <div className="bg-muted/20 border border-border/40 rounded-xl px-5 py-4 font-mono text-[13px] text-foreground/80 mb-5">
          score = (resolved_tokens / total_tokens) × source_coverage × completeness
        </div>
        <ul className="space-y-3">
          {[
            { term: "resolved_tokens", desc: "tokens where drift is match or has an explicit rationale decision" },
            { term: "source_coverage", desc: "fraction of tokens that have both a code and Figma value" },
            { term: "completeness",    desc: "penalty for pending or missing tokens above a threshold" },
          ].map(({ term, desc }) => (
            <li key={term} className="flex items-start gap-3 text-[14px] text-muted-foreground">
              <code className="shrink-0 font-mono text-[12px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground mt-0.5">{term}</code>
              <span className="leading-relaxed">{desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-5">Thresholds</h2>
        <div className="space-y-px rounded-xl overflow-hidden border border-border/40">
          {tiers.map(({ score, state, dot, body }) => (
            <div key={score} className="flex items-start gap-4 px-4 py-5 bg-background border-b border-border/40 last:border-0">
              <span className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${dot}`} />
              <div>
                <p className="text-[13px] font-bold text-foreground mb-1">
                  <span className="font-mono">{score}</span> — {state}
                </p>
                <p className="text-[13px] text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">Hard stop at 0.80</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          If the score is below 0.80, <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">systemix serve</code> refuses to start. Serving ambiguous data to agents is worse than serving nothing — agents that get noisy answers don&apos;t fail loudly, they produce wrong output quietly.
        </p>
      </section>

      <section>
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">Improving your score</h2>
        <ul className="space-y-2">
          {[
            "Resolve drifted tokens in the Drift Room — each resolved conflict raises the score",
            "Connect both a codebase adapter and a Figma adapter to improve source coverage",
            "Clear all pending tokens — deferred decisions count against completeness",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14px] text-muted-foreground">
              <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-muted-foreground/40" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
