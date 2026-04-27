import Link from "next/link";

export default function IntroductionPage() {
  return (
    <article className="prose-custom">
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Introduction</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-4">
        The design contract layer<br />for your agents.
      </h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-10">
        Systemix is an open-source tool that builds and maintains a verified contract between your Figma design system and your codebase — one infrastructure, two use cases: validate design hypotheses fast, or reconcile years of drift with confidence.
      </p>

      <hr className="border-border/40 mb-10" />

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">What it is</h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
          Systemix ingests tokens and components from multiple sources, runs perceptual drift detection, and has a local LLM author a human-readable contract for each one — with rationale, not just values.
        </p>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          The output is a directory of MDX files — one per token, one per component — stored in <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">contract/tokens/</code> and <code className="font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">contract/components/</code>. Each file has YAML frontmatter (value, figma-value, drift status, ΔE, resolve decision) and a prose body written by Hermes explaining the conflict and the rationale.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-4">Built on</h2>
        <div className="space-y-3">
          <div className="border border-border/40 rounded-xl px-4 py-4">
            <p className="text-[13px] font-semibold text-foreground mb-1.5">Figma Console MCP — TJ Pitre</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              All Figma write operations — pushing token variables, placing screenshots, updating component descriptions — go through the{" "}
              <span className="text-foreground font-medium">Figma Console MCP by TJ Pitre</span>. It executes the Figma Plugin API remotely via a Desktop Bridge, enabling bidirectional sync without leaving your terminal. Read operations use the official Figma REST MCP.
            </p>
          </div>
          <div className="border border-border/40 rounded-xl px-4 py-4">
            <p className="text-[13px] font-semibold text-foreground mb-1.5">Hermes — local Ollama LLM</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Hermes</span> is a local LLM running via{" "}
              <span className="text-foreground font-medium">Ollama</span> (<code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">hermes3</code> model at <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">localhost:11434</code>). It is invoked via prompt files, reads your CSS token values and Figma variable exports, and authors MDX contract files — one per token and component. No API key. No cloud. The model is chosen for strong instruction-following when writing structured YAML + prose output.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-5">Two use cases. One infrastructure.</h2>
        <div className="space-y-3">
          <div className="border border-border/40 rounded-xl px-5 py-5">
            <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-2">Use case 01</p>
            <p className="text-[14px] font-semibold text-foreground mb-2">Prototype and validate hypotheses fast</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Design is the backbone of your testing loop. Keep the token and component layer clean so prototypes reflect design intent — not drift. PostHog measures what was actually designed. The feedback loop is fast and reliable.
            </p>
            <p className="text-[12px] text-muted-foreground/50 mt-3">
              For: product teams, agencies, AI-assisted workflows
            </p>
          </div>
          <div className="border border-border/40 rounded-xl px-5 py-5">
            <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-2">Use case 02</p>
            <p className="text-[14px] font-semibold text-foreground mb-2">Reconcile a legacy platform at scale</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Years of software, a Figma file nobody fully trusts, hundreds of tokens with no clear owner. Systemix audits every token and component, surfaces drift with perceptual accuracy (ΔE), and gives the team a structured path from chaos to a clean, trustworthy baseline.
            </p>
            <p className="text-[12px] text-muted-foreground/50 mt-3">
              For: enterprise design system teams, platform redesign projects, design ops
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">The one-liner</h2>
        <div className="bg-muted/30 border border-border/40 rounded-xl px-5 py-5">
          <p className="text-[15px] leading-relaxed">
            When the contract between design and code is verified, everything downstream — prototypes, tests, agents, migrations — gets faster and more reliable.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-5">Start here</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/docs/quick-install", label: "Quick Install", sub: "Up and running in under 5 minutes" },
            { href: "/docs/concepts/contract", label: "MDX Contracts", sub: "How the contract is structured" },
            { href: "/docs/concepts/quality-score", label: "Quality Score", sub: "What quality means in Systemix" },
            { href: "/docs/guides/setup", label: "Setup Guide", sub: "Full walkthrough for your first project" },
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
