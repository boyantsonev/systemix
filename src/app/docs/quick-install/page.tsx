import Link from "next/link";

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 pt-0.5">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[11px] font-bold font-mono text-muted-foreground">
          {n}
        </span>
      </div>
      <div className="flex-1 pb-8 border-b border-border/40 last:border-0 last:pb-0">
        <p className="text-[14px] font-bold text-foreground mb-3">{title}</p>
        {children}
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-muted/30 border border-border/40 rounded-xl px-4 py-4 font-mono text-[13px] mb-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground/30 select-none">$</span>
        <span className="text-foreground">{children}</span>
      </div>
    </div>
  );
}

function OutputBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-muted/20 border border-border/40 rounded-xl px-4 py-4 font-mono text-[12px] text-muted-foreground leading-relaxed overflow-x-auto mt-3">
      {children}
    </pre>
  );
}

export default function QuickInstallPage() {
  return (
    <article>
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Getting Started</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-4">
        Quick Install
      </h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-4">
        The POC workflow — Hermes authors your contracts locally, the UI shows you the quality score and drift.
      </p>
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 mb-10">
        <p className="text-[12px] font-mono text-amber-500/80">
          No CLI yet — <code className="text-amber-400">npx systemix init</code> is on the roadmap. This is the direct workflow.
        </p>
      </div>

      <hr className="border-border/40 mb-10" />

      <section className="mb-10">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-5">Prerequisites</h2>
        <ul className="space-y-2">
          {[
            "Node 18 or later",
            "Ollama installed — ollama.com",
            "A codebase with CSS custom properties in globals.css",
            "Figma token values exported as hex or HSL (not OKLCH)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14px] text-muted-foreground">
              <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-muted-foreground/40" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-6">Steps</h2>

        <div className="space-y-0">
          <Step n="1" title="Pull the Hermes model">
            <CodeBlock>ollama pull hermes3</CodeBlock>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Hermes is the local LLM that authors your MDX contract files. It runs entirely on your machine via Ollama at{" "}
              <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">localhost:11434</code> — no API key, no cloud.
            </p>
          </Step>

          <Step n="2" title="Author contracts">
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
              Hermes reads your <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">globals.css</code> token values and your Figma variable exports, then writes one MDX file per token to <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">contract/tokens/</code>.
            </p>
            <p className="text-[12px] font-mono text-muted-foreground/60 mb-1">Each contract file looks like:</p>
            <OutputBlock>{`---
token: color-primary
value: oklch(0.45 0.18 250)
figma-value: "#0063c4"
status: drifted
resolved: false
delta-e: 8.3
collection: Semantic
last-updated: 2026-04-26
---

The primary brand colour differs between code (oklch) and Figma (#0063c4).
ΔE 8.3 — clearly visible. Code and Figma are not perceptually equivalent.
A human decision is required: update code to match Figma, or lock code and
update Figma.`}</OutputBlock>
          </Step>

          <Step n="3" title="Inspect in the UI">
            <CodeBlock>npm run dev</CodeBlock>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-2">
              Open <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">/contract</code> in the browser. The quality score shows your clean / drifted / unresolved split.
            </p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Click any token to see the side-by-side colour swatches, the ΔE value, and an inline resolve control — choose <strong className="text-foreground font-medium">code wins</strong> or <strong className="text-foreground font-medium">Figma wins</strong>. The decision is written back to the MDX frontmatter. The score updates on the next page load.
            </p>
          </Step>
        </div>
      </section>

      <section>
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-4">What&apos;s next</h2>
        <div className="space-y-2 mb-8">
          {[
            { href: "/docs/guides/setup",             label: "Read the Setup Guide for a full walkthrough" },
            { href: "/docs/concepts/contract",        label: "Learn about the MDX contract format" },
            { href: "/docs/concepts/quality-score",   label: "Understand your quality score" },
            { href: "/docs/concepts/drift",           label: "Drift types and HITL resolution" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-muted-foreground/40">→</span>
              {label}
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4 bg-muted/20">
          <p className="text-[12px] font-bold text-foreground mb-1.5">PostHog evidence</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-2">
            Component contracts support a <code className="font-mono text-[11px] bg-muted/60 px-1 py-0.5 rounded text-foreground">evidence-posthog</code> frontmatter field — usage counts from your analytics feed back into the contract to inform drift resolution decisions.
          </p>
          <Link
            href="/graph"
            className="text-[11px] font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            See the full architecture →
          </Link>
        </div>
      </section>
    </article>
  );
}
