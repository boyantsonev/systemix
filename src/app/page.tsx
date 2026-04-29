import type { Metadata } from "next";
import Link from "next/link";
import { SLogo } from "@/components/systemix/SLogo";
import { ThemeToggle } from "@/components/systemix/ThemeToggle";
import { NavCTAs, InstallCommand, SectionTrack } from "@/components/systemix/LandingEvents";

export const metadata: Metadata = {
  title: "Systemix — Every component is a guess until production proves it.",
  description: "The evidence layer for design systems. Production results, attributed to the variant, written into your component contracts. Open source. MCP-native.",
};

// ── Nav ──────────────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <SLogo size={16} className="text-foreground" />
          <span className="text-[13px] font-black tracking-tight">systemix</span>
        </Link>

        <nav className="flex items-center gap-1 ml-4">
          <Link href="/docs" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 hover:bg-muted/50">
            Docs
          </Link>
          <a
            href="https://github.com/boyantsonev/systemix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 hover:bg-muted/50"
          >
            GitHub
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <NavCTAs />
        </div>
      </div>
    </header>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

function LandingFooter() {
  return (
    <footer className="border-t border-border/50 mt-32">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <SLogo size={14} className="text-muted-foreground/40" />
          <span className="text-[12px] text-muted-foreground/40 font-mono">
            The Evidence Layer for design systems.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground/40 font-mono">
          <a
            href="https://github.com/boyantsonev/systemix"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            GitHub
          </a>
          <Link href="/docs" className="hover:text-muted-foreground transition-colors">
            Docs
          </Link>
          <span className="border border-border/50 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-bold">
            Open source
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-6">
          The Evidence Layer for design systems
        </p>
        <h1 className="text-[2.75rem] sm:text-[3.5rem] font-black tracking-tight leading-[1.1] mb-6">
          Every component is a guess<br />
          <span className="text-muted-foreground">until production proves it.</span>
        </h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
          Your A/B test measured a variant nobody designed. Your agent shipped a token Figma deprecated last quarter. Systemix is the layer where every component carries its production evidence — so the next design decision is informed by what actually worked, not by what got documented.
        </p>

        <div className="flex justify-center">
          <InstallCommand />
        </div>

        <p className="text-[12px] font-mono text-muted-foreground/40 mt-6 max-w-md mx-auto leading-relaxed">
          When an agent asks &quot;what is <code className="text-muted-foreground/60">--color-primary</code>?&quot; — the contract answers with the value, the rationale, and the experiment that proved it.
        </p>
      </div>
    </section>
  );
}

function WorksWith() {
  const tools = [
    {
      name: "Claude Code",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17zm0 3.25a.75.75 0 00-.75.75v3.75H7.5a.75.75 0 000 1.5h3.75v3.75a.75.75 0 001.5 0v-3.75h3.75a.75.75 0 000-1.5h-3.75V7.5A.75.75 0 0012 6.75z" />
        </svg>
      ),
    },
    {
      name: "Codex",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.896zm16.597 3.868l-5.843-3.38 2.019-1.164a.076.076 0 01.072 0l4.83 2.786a4.49 4.49 0 01-.676 8.105v-5.683a.79.79 0 00-.402-.664zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08-4.778 2.758a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
      ),
    },
    {
      name: "Gemini CLI",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
    },
    {
      name: "OpenCode",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      name: "Cursor",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="border-t border-border/40 py-5">
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <span className="text-[11px] font-mono text-muted-foreground/30 uppercase tracking-widest shrink-0">
          Works with
        </span>
        {tools.map(({ name, icon }) => (
          <div key={name} className="flex items-center gap-1.5 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
            {icon}
            <span className="text-[12px] font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Problem() {
  const pains = [
    {
      label: "Lost rationale",
      body: "The variant that won in March is now a hex value with no story attached. Six months later the same dead-end gets proposed again, by a human or an agent.",
    },
    {
      label: "Stale context",
      body: "Your agent reads the current token value but not the experiment that set it. It ships whichever color was in the file last — not the one production validated.",
    },
    {
      label: "Blind baseline",
      body: "PostHog says variant B won. But if the token drifted before the test, you measured a variant nobody designed. The result isn't wrong — it's about the wrong thing.",
    },
  ];

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[1.75rem] font-black tracking-tight mb-4">
          Storybook tells your agent what exists.<br />Nobody tells it what worked.
        </h2>
        <div className="text-[15px] text-muted-foreground leading-relaxed space-y-4 mb-14 max-w-2xl">
          <p>
            You can document a component. You can sync it across Figma and code. You can write a story for it. But you still can&apos;t answer the question that decides the next sprint: <em>did this design decision work?</em> The answer lives in PostHog, in someone&apos;s head, or in a Slack thread from March.
          </p>
          <p>
            Systemix writes the answer back into the component&apos;s contract — measured in production, attributed to the variant, dated. The next agent reading it sees the evidence, not just the value.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-px bg-border/40 rounded-xl overflow-hidden border border-border/40">
          {pains.map(({ label, body }) => (
            <div key={label} className="bg-background px-5 py-6">
              <p className="text-[12px] font-bold text-foreground/80 mb-2 uppercase tracking-wide">{label}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[1.75rem] font-black tracking-tight mb-3">
          How it works
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-12 max-w-xl">
          Every component on Systemix is a hypothesis. PostHog measures whether it worked. Hermes reads the result against the contract — past experiments, prior decisions, what&apos;s already been tried — and writes the evidence back as a structured line in the component&apos;s MDX file. The next agent, the next sprint, starts from that ground.
        </p>

        {/* Hypothesis validation loop */}
        <div className="rounded-xl border border-border/40 bg-muted/5 overflow-hidden mb-6">
          <div className="px-4 py-2.5 border-b border-border/30 flex items-center justify-between">
            <span className="text-[11px] font-mono text-muted-foreground/50">Hypothesis validation — what the loop looks like</span>
            <Link
              href="/dashboard"
              className="text-[11px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              Open Dashboard →
            </Link>
          </div>

          {/* Experiment result */}
          <div className="px-4 py-4 border-b border-border/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium bg-cyan-500/15 text-cyan-400 border-cyan-500/30">
                experiment
              </span>
              <span className="text-[13px] font-mono text-foreground">Hero headline — variant A vs B</span>
              <span className="text-[10px] font-mono text-emerald-400 ml-auto">87% confidence</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Baseline (A)",  value: "3.2% CTR",  color: "text-muted-foreground" },
                { label: "Variant (B)",   value: "4.7% CTR",  color: "text-emerald-400"       },
                { label: "Delta",         value: "+47%  ↑",   color: "text-emerald-400"       },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg border border-border/40 px-3 py-2.5">
                  <p className="text-[10px] font-mono text-muted-foreground/50 mb-1">{label}</p>
                  <p className={`text-[13px] font-mono font-medium ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Hermes synthesis */}
            <div className="rounded-lg bg-muted/30 border border-border/30 px-3 py-2.5 mb-4">
              <p className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest mb-1.5">Hermes synthesis</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Variant B converted +47% at 87% confidence. Contract evidence: the provocative framing tested in March underperformed by 23% on the same segment. Recommend promoting B and writing the rationale into the contract before the next iteration.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded border border-border/50 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                Promote variant
              </button>
              <button className="px-3 py-1.5 rounded border border-border/50 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                Run longer
              </button>
              <span className="text-[11px] font-mono text-muted-foreground/30 ml-2">— evidence is written back to the contract</span>
            </div>
          </div>

          {/* Evidence trace */}
          <div className="px-4 py-3 flex items-center gap-3 opacity-50">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium bg-blue-500/15 text-blue-400 border-blue-500/30">
              evidence
            </span>
            <span className="text-[12px] font-mono text-muted-foreground">Hero headline — contract carries 3 prior experiments + current decision</span>
            <span className="text-[10px] font-mono text-muted-foreground/40 ml-auto">next agent will read this</span>
          </div>
        </div>

        {/* Pipeline reference — secondary */}
        <div className="grid grid-cols-3 gap-3 mb-6 opacity-70">
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">Sources</p>
            {[
              { label: "PostHog events", color: "bg-cyan-400"    },
              { label: "contract/",      color: "bg-blue-400"    },
              { label: "globals.css",    color: "bg-violet-400"  },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/40 bg-muted/10">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />
                <span className="text-[12px] font-mono text-muted-foreground truncate">{label}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">Skills</p>
            {["/tokens", "/component", "/drift-report", "/deploy"].map((cmd) => (
              <div key={cmd} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/40 bg-muted/10">
                <span className="text-muted-foreground/20 text-[10px] shrink-0">→</span>
                <code className="text-[12px] font-mono text-foreground/70">{cmd}</code>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">Output</p>
            <div className="px-3 py-2 rounded-lg border border-border/40 bg-muted/10">
              <p className="text-[12px] font-mono text-muted-foreground">contract/</p>
              <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">evidence per token + decision</p>
            </div>
            <div className="px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-[12px] font-mono text-emerald-400">Score 83 / 100</p>
              <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">healthy · 2 pending</p>
            </div>
          </div>
        </div>

        <Link
          href="/docs/architecture"
          className="text-[13px] text-muted-foreground/50 hover:text-muted-foreground transition-colors font-mono"
        >
          See full architecture diagram →
        </Link>
      </div>
    </section>
  );
}

function SectionGlossary() {
  const tools = [
    {
      name: "Dashboard",
      href: "/dashboard",
      tag: "app",
      desc: "One score per project. See which contracts have fresh production evidence, which have unresolved drift, and which are running blind. The Beta starting point.",
    },
    {
      name: "Design System",
      href: "/design-system",
      tag: "triage + docs",
      desc: "Every token and component, with its contract open beside it. Evidence rows from PostHog, drift status, and the prose Hermes wrote — readable by humans and agents alike.",
    },
    {
      name: "Skills",
      href: "/docs/skills",
      tag: "commands",
      desc: "Slash commands inside Claude Code, Cursor, or any MCP editor. /component reads the contract before generating. /tokens syncs values. /evidence pulls the latest PostHog results into the contract.",
    },
  ];

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[1.75rem] font-black tracking-tight mb-3">
          What each part does
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-12 max-w-xl">
          Three surfaces. One contract underneath. The contract is where the evidence lives — everything else reads it or writes to it.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {tools.map(({ name, href, tag, desc }) => (
            <Link
              key={href}
              href={href}
              className="block border border-border/40 rounded-xl px-5 py-5 hover:border-border hover:bg-muted/20 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[14px] font-bold text-foreground group-hover:text-foreground">{name}</p>
                <span className="text-[10px] font-mono text-muted-foreground/40 border border-border/40 px-1.5 py-0.5 rounded">{tag}</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TwoUseCases() {
  const cases = [
    {
      audience: "Product teams shipping with Cursor or Claude Code",
      headline: "Stop guessing what your agent will pick.",
      body: "Your agent reads the contract before it ships. Every token, every component carries the value, the rationale, and the production result that justified it. No more rediscovering the same dead-end variant six months apart.",
    },
    {
      audience: "Teams already running PostHog or Statsig",
      headline: "Close the loop your analytics never closed.",
      body: "PostHog tells you variant B won. Systemix writes that result into the component's contract — attributed to the variant, dated, with confidence. Your next experiment starts from known ground, not a fresh guess.",
    },
  ];

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-4">
          The evidence layer · Two ways teams use it
        </p>
        <h2 className="text-[1.75rem] font-black tracking-tight mb-12">
          Same contract. Different problem solved.
        </h2>

        <div className="grid sm:grid-cols-2 gap-3">
          {cases.map(({ audience, headline, body }) => (
            <div key={audience} className="border border-border/40 rounded-xl px-5 py-6 bg-background">
              <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-3">
                {audience}
              </p>
              <p className="text-[14px] font-bold text-foreground mb-2 leading-snug">
                {headline}
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QualityGate() {
  const tiers = [
    { score: "≥ 80", state: "Evidence-ready",  dot: "bg-emerald-500", body: "Contract is backed. Tokens are resolved against Figma, drift is cleared, recent production evidence is attached. Safe for agents to read, safe for the next experiment to build on." },
    { score: "≥ 60", state: "Partial evidence", dot: "bg-amber-500",   body: "Some claims are unbacked. Either drift is unresolved or production data is missing. Your agent will still read the contract — but the next decision is partly a guess." },
    { score: "< 60", state: "Unbacked",         dot: "bg-red-400",     body: "Too many open questions. Tokens drift, no recent production data, or contradictions Hermes flagged. Don't ship from this contract until it's triaged." },
  ];

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[1.75rem] font-black tracking-tight mb-4">
          An evidence score on every contract.
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-12 max-w-xl">
          Systemix scores every contract from 0 to 100. The score reflects how much of the component is backed by evidence: tokens resolved, drift cleared, production results attached. It&apos;s the single number that tells your agent — and your team — whether the contract is ready to be relied on.
        </p>

        <div className="space-y-px rounded-xl overflow-hidden border border-border/40">
          {tiers.map(({ score, state, dot, body }) => (
            <div key={score} className="flex items-start gap-4 px-5 py-5 bg-background border-b border-border/40 last:border-0">
              <span className={`mt-1 shrink-0 inline-block w-2 h-2 rounded-full ${dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-foreground mb-1">
                  <span className="font-mono">{score}</span>
                  {" — "}
                  {state}
                </p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[13px] text-muted-foreground leading-relaxed mt-6 max-w-xl">
          The score rises as evidence accumulates. It drops when Figma drifts, when PostHog data goes stale, or when a decision is overridden without rationale. Target: ≥ 80 on every contract your agent reads.
        </p>
      </div>
    </section>
  );
}

function BottomCTA() {
  const steps = [
    { n: "1", label: "Run Hermes locally",        cmd: "ollama pull hermes3", comment: "local LLM — no API key, no design data leaving your machine" },
    { n: "2", label: "Open the contract surface", cmd: "npm run dev",         comment: "/design-system in your browser — every contract, every score" },
    { n: "3", label: "Pull evidence in",          cmd: "npx systemix watch",  comment: "continuous Hermes run — pulls PostHog evidence into every contract" },
  ];

  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[1.75rem] font-black tracking-tight mb-4">
          Run it locally.
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10 max-w-xl">
          Hermes runs on Ollama — no API key, no cloud, no design data leaving your machine. PostHog stays where it already is. The contract lives in your repo. Systemix is the layer that ties them together.
        </p>

        <div className="space-y-px rounded-xl overflow-hidden border border-border/40 mb-8">
          {steps.map(({ n, label, cmd, comment }) => (
            <div key={n} className="flex items-start gap-4 px-5 py-4 bg-background border-b border-border/40 last:border-0">
              <span className="shrink-0 text-[11px] font-mono text-muted-foreground/30 tabular-nums pt-0.5">{n}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-foreground mb-1">{label}</p>
                {cmd && (
                  <code className="text-[12px] font-mono text-muted-foreground/70">{cmd}</code>
                )}
                <span className="text-[12px] font-mono text-muted-foreground/40 ml-2"># {comment}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[13px] text-muted-foreground leading-relaxed mb-6 max-w-xl">
          Every component gets a DESIGN.md-shaped contract: tokens, components, rationale, and a Production Evidence section Hermes writes from your PostHog events. You approve. The score rises. The next agent reads forward.
        </p>

        <Link
          href="/docs/quick-install"
          className="text-[13px] font-medium text-foreground hover:opacity-70 transition-opacity"
        >
          See the full workflow →
        </Link>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main className="max-w-4xl mx-auto px-6">
        <Hero />
        <WorksWith />
        <SectionTrack name="two-use-cases"><TwoUseCases /></SectionTrack>
        <SectionTrack name="problem"><Problem /></SectionTrack>
        <SectionTrack name="how-it-works"><HowItWorks /></SectionTrack>
        <SectionTrack name="glossary"><SectionGlossary /></SectionTrack>
        <SectionTrack name="quality-gate"><QualityGate /></SectionTrack>
        <SectionTrack name="bottom-cta"><BottomCTA /></SectionTrack>
      </main>
      <LandingFooter />
    </div>
  );
}
