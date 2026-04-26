import Link from "next/link";

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center shrink-0">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-[11px] font-bold font-mono shrink-0">
          {n}
        </span>
        <div className="flex-1 w-px bg-border/40 mt-2" />
      </div>
      <div className="flex-1 pb-10 last:pb-0">
        <p className="text-[15px] font-bold text-foreground mb-4 mt-0.5">{title}</p>
        {children}
      </div>
    </div>
  );
}

function Cmd({ children }: { children: string }) {
  return (
    <div className="bg-muted/30 border border-border/40 rounded-xl px-4 py-3.5 font-mono text-[13px] mb-4 flex items-center gap-2">
      <span className="text-muted-foreground/30 select-none">$</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-amber-500/40 pl-4 py-0.5 my-4">
      <p className="text-[13px] text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export default function SetupGuidePage() {
  return (
    <article>
      <p className="text-[13px] font-mono text-muted-foreground mb-3">Guides</p>
      <h1 className="text-[2rem] font-black tracking-tight leading-[1.15] mb-4">
        Setup Guide
      </h1>
      <p className="text-[16px] text-muted-foreground leading-relaxed mb-4">
        From install to a working contract layer — Hermes authors your MDX files, the UI shows drift and a live quality score. Estimated time: 15–20 minutes.
      </p>
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 mb-10">
        <p className="text-[12px] font-mono text-amber-500/80">
          No CLI yet — <code className="text-amber-400">npx systemix init</code> is on the roadmap. This is the direct POC workflow.
        </p>
      </div>

      <hr className="border-border/40 mb-10" />

      <section className="mb-8">
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-4">Prerequisites</h2>
        <ul className="space-y-2 mb-0">
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

      <hr className="border-border/40 mb-10" />

      <div>
        <Step n="1" title="Pull the Hermes model">
          <Cmd>ollama pull hermes3</Cmd>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
            Hermes is the local LLM that authors your MDX contract files. It runs entirely on your machine via Ollama at{" "}
            <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">localhost:11434</code> — no API key, no cloud.
          </p>
          <Note>
            Verify it&apos;s running: <code className="font-mono text-[11px]">ollama list</code> should show <code className="font-mono text-[11px]">hermes3</code> in the output.
          </Note>
        </Step>

        <Step n="2" title="Prepare your token inputs">
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
            Hermes needs two inputs to author contracts: your CSS token values and your Figma variable exports.
          </p>
          <div className="space-y-3 mb-3">
            {[
              {
                label: "globals.css",
                desc: "Your CSS custom properties — Hermes reads the variable names and values directly.",
              },
              {
                label: "Figma export",
                desc: "Export your Figma variables as JSON or CSV with hex or HSL values. OKLCH is not supported — convert first if needed.",
              },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-4 border border-border/40 rounded-xl px-4 py-3.5">
                <code className="shrink-0 font-mono text-[12px] text-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap">{label}</code>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Note>
            If you don&apos;t have a Figma export yet, Hermes will still author contracts — tokens without a Figma counterpart will be marked <code className="font-mono text-[11px]">missing-in-figma</code> and penalised in the quality score.
          </Note>
        </Step>

        <Step n="3" title="Author contracts">
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
            Hermes reads your inputs via a prompt file and writes one MDX file per token to{" "}
            <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">contract/tokens/</code>.
          </p>
          <p className="text-[12px] font-mono text-muted-foreground/60 mb-1.5">Each contract file looks like:</p>
          <pre className="bg-muted/20 border border-border/40 rounded-xl px-4 py-4 font-mono text-[12px] text-muted-foreground leading-relaxed overflow-x-auto mb-4">{`---
token: color-primary
value: oklch(0.45 0.18 250)
figma-value: "#0063c4"
status: drifted
resolved: false
delta-e: 8.3
collection: Semantic
last-updated: 2026-04-26
resolve-decision: null
evidence-posthog: null
---

The primary brand colour differs between code (oklch(0.45 0.18 250)) and
Figma (#0063c4). ΔE 8.3 — clearly visible, not perceptually equivalent.

A human decision is required: update code to match Figma, or lock the
code value and update Figma to reflect it.`}</pre>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Component contracts go to{" "}
            <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">contract/components/</code>. Each file follows the same frontmatter + prose structure.
          </p>
        </Step>

        <Step n="4" title="Start the UI">
          <Cmd>npm run dev</Cmd>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
            Open{" "}
            <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">/contract</code>{" "}
            in the browser. The MDX Indexer reads all contract files at build time and computes your quality score — the clean / drifted / unresolved split is shown at the top.
          </p>
          <Note>
            Checkpoint: you should see a quality score. If it&apos;s below 80, that&apos;s expected — you haven&apos;t resolved any conflicts yet.
          </Note>
        </Step>

        <Step n="5" title="Resolve drift">
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
            Click any drifted token to go to{" "}
            <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">/contract/[slug]</code>. The detail view shows side-by-side colour swatches, the ΔE perceptual distance, and an inline resolve control.
          </p>
          <div className="space-y-2 mb-4">
            {[
              { cmd: "code-wins",  label: "Your CSS value is right — Figma should be updated" },
              { cmd: "figma-wins", label: "The Figma variable is right — code should be updated" },
            ].map(({ cmd, label }) => (
              <div key={cmd} className="flex items-start gap-3 text-[13px]">
                <code className="font-mono text-[12px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground shrink-0 mt-0.5">{cmd}</code>
                <span className="text-muted-foreground leading-relaxed">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Each decision is written back to the MDX frontmatter (<code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">resolve-decision</code>, <code className="font-mono text-[12px] bg-muted/60 px-1 py-0.5 rounded text-foreground">resolved: true</code>) immediately. The file is the source of truth — no database.
          </p>
        </Step>

        <Step n="6" title="Raise your score to ≥ 80">
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
            Each resolved conflict removes the unresolved penalty from the quality score. Keep resolving until you hit 80 — at that point the contract layer is reliable enough for agent consumption.
          </p>
          <div className="bg-muted/20 border border-border/40 rounded-xl px-4 py-4 font-mono text-[12px] text-foreground/80 leading-relaxed space-y-1.5 mb-4">
            <div>tScore = (clean_tokens / total_tokens)</div>
            <div className="text-muted-foreground/60">{"        "}- (drifted_unresolved × 0.05)</div>
            <div className="text-muted-foreground/60">{"        "}- (missing_in_figma × 0.03)</div>
            <div className="mt-2">cScore = clean_components / total_components</div>
            <div className="mt-2 text-emerald-400/80">score = max(0, round(((tScore + cScore) / 2) × 100))</div>
          </div>
          <Note>
            In CI, Hermes writes a <code className="font-mono text-[11px]">.pending.json</code> sidecar when it can&apos;t auto-resolve a conflict. Set <code className="font-mono text-[11px]">HITL_AUTO_APPROVE=1</code> to skip the Y/N prompt.
          </Note>
        </Step>
      </div>

      <hr className="border-border/40 my-10" />

      <section>
        <h2 className="text-[1.15rem] font-bold tracking-tight mb-4">Next steps</h2>
        <div className="space-y-2">
          {[
            { href: "/docs/concepts/contract",      label: "MDX Contracts — understand the file format" },
            { href: "/docs/concepts/quality-score", label: "Quality Score — what moves the number" },
            { href: "/docs/concepts/drift",         label: "Drift & Reconciliation — ΔE and HITL deep dive" },
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
      </section>
    </article>
  );
}
