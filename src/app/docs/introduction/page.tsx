import Link from "next/link";

export default function IntroductionPage() {
  return (
    <article className="prose-custom">
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Introduction</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-4">
        The design contract layer<br />for your agents.
      </h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-10">
        Systemix is an open-source tool that builds and maintains a verified contract between your Figma design system, your codebase, and the AI agents working on both.
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
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">Who it&apos;s for</h2>
        <ul className="space-y-2">
          {[
            "Design system teams who need agents to understand their token structure",
            "Consultancies managing multiple client themes on one codebase",
            "Any team where Figma and code have drifted and agents are making it worse",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
              <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-muted-foreground/40" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-3">The one-liner</h2>
        <div className="bg-muted/30 border border-border/40 rounded-xl px-5 py-5">
          <p className="text-[15px] leading-relaxed">
            Agents stop hallucinating design decisions when they have a verified, sourced contract to read from.
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
