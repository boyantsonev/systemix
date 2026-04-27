import Link from "next/link";

export default function IntroductionPage() {
  return (
    <article className="prose-custom">
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Introduction</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-4">
        The design contract layer<br />for your agents.
      </h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-10">
        Systemix keeps your Figma design system and codebase in verified sync — one token at a time, with a local LLM that writes the rationale, not just the diff.
      </p>

      <hr className="border-border/40 mb-10" />

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">What it is</h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          Systemix ingests tokens and components from Figma and your codebase, detects perceptual drift between them, and has a local LLM (Hermes, via Ollama) author a human-readable contract for each one — with rationale, not just values. The result is a browsable documentation layer where every token and component has a verified status and a prose explanation of any conflict.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">One memory layer. Five use cases.</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
          The contract is the constant. What changes is the problem it solves.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {([
            { audience: "Product teams",        headline: "Measure what you actually designed.",          sub: "Token drift corrupts A/B test results before they run." },
            { audience: "Agencies",             headline: "Deliver on a verified baseline every sprint.", sub: "Client approves Figma. Systemix proves code matches." },
            { audience: "Legacy systems",       headline: "Know what you have before you redesign.",      sub: "Quality score rises as you resolve conflicts." },
            { audience: "AI-assisted builders", headline: "Give your agents a memory.",                   sub: "Contract files replace hallucinated token values." },
            { audience: "Consultancies",        headline: "Turn audits into a repeatable deliverable.",   sub: "Structured findings in hours, not weeks." },
          ] as const).map(({ audience, headline, sub }) => (
            <div key={audience} className="border border-border/40 rounded-xl px-4 py-4">
              <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-2">{audience}</p>
              <p className="text-[13px] font-semibold text-foreground mb-1">{headline}</p>
              <p className="text-[12px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-5">Start here</h2>

        {/* Primary CTA */}
        <Link
          href="/docs/quick-install"
          className="block border border-border/60 rounded-xl px-5 py-5 hover:border-border hover:bg-muted/30 transition-colors group mb-3"
        >
          <p className="text-[14px] font-bold text-foreground mb-1 group-hover:text-foreground">
            Quick Install →
          </p>
          <p className="text-[13px] text-muted-foreground">Up and running in under 5 minutes</p>
        </Link>

        {/* Secondary links */}
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/docs/concepts/contract",     label: "MDX Contracts",   sub: "How the contract is structured" },
            { href: "/docs/guides/setup",           label: "Setup Guide",     sub: "Full walkthrough for your first project" },
            { href: "/docs/concepts/drift",         label: "Drift & Reconciliation", sub: "How drift is detected and resolved" },
            { href: "/docs/architecture",           label: "Architecture",    sub: "How all the pieces connect" },
          ].map(({ href, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="block border border-border/40 rounded-xl px-4 py-4 hover:border-border hover:bg-muted/30 transition-colors group"
            >
              <p className="text-[13px] font-semibold text-foreground mb-1 group-hover:text-foreground">
                {label} →
              </p>
              <p className="text-[12px] text-muted-foreground">{sub}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
