import { cn } from "@/lib/utils";
import type { DeepDive } from "@/lib/landing/content";

// Product mockups for the feature deep-dives — TVA lit-terminal / panel
// renderings of the real Systemix surfaces (experiment MDX, LEARNINGS feed,
// the three doors, the signals card, the HITL close-proposal, the drift
// report). Static, decorative-but-truthful: everything shown exists in the
// product. The .terminal class (globals.css) keeps these a lit amber CRT in
// both themes — the loop's own console.

function Term({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <figure className={cn("w-full", className)} role="img" aria-label={label}>
      <div className="terminal overflow-hidden p-4 font-mono text-[12px] leading-relaxed sm:p-5 sm:text-[13px]">
        {children}
      </div>
    </figure>
  );
}

function Panel({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <figure
      className={cn(
        "w-full rounded-[var(--radius-screen)] border border-border bg-card p-4 shadow-[var(--shadow-panel)] sm:p-5",
        className,
      )}
      role="img"
      aria-label={label}
    >
      {children}
    </figure>
  );
}

const ok = { color: "var(--screen-success)" };
const bad = { color: "var(--screen-destructive)" };
const warn = { color: "var(--screen-warning)" };
const dim = { opacity: 0.55 };

// 1 · The loop — a running experiment file, as the console sees it
function ExperimentCard() {
  return (
    <Term label="Systemix experiment card — a running experiment MDX file with hypothesis, metric, and status">
      <div style={dim}>experiments/landing-rebrand-hifi-2026-07.mdx</div>
      <div className="mt-2">
        <span style={dim}>hypothesis:</span> the hi-fi rebrand converts better than the prototype
      </div>
      <div>
        <span style={dim}>metric:</span> install-copy-rate
      </div>
      <div>
        <span style={dim}>status:</span> <span style={warn}>● running</span>
      </div>
      <div className="mt-2" style={dim}>
        ship → measure → learn → decide
      </div>
      <div className="mt-1">
        &gt; awaiting evidence<span className="agent-cursor" />
      </div>
    </Term>
  );
}

// 2 · Receipts — the LEARNINGS.md memory feed
function LearningsFeed() {
  return (
    <Panel label="Systemix LEARNINGS feed — decisions recorded with the experiment that earned them and a confidence score">
      <p className="tva-label mb-3 text-[10px] text-muted-foreground">experiments/LEARNINGS.md</p>
      <ul className="flex flex-col gap-3 text-[13px] leading-relaxed">
        <li className="border-l-2 border-highlight/60 pl-3">
          Persona pages beat one generic landing for engineer traffic.
          <span className="tva-label ml-2 text-[9px] text-muted-foreground">cited · 0.82 conf</span>
        </li>
        <li className="border-l-2 border-highlight/60 pl-3">
          The install command outconverts &quot;book a call&quot; above the fold.
          <span className="tva-label ml-2 text-[9px] text-muted-foreground">cited · 0.74 conf</span>
        </li>
        <li className="border-l-2 border-border pl-3 text-muted-foreground">
          Every entry is earned — appended only when an experiment closes.
        </li>
      </ul>
    </Panel>
  );
}

// 3 · Three doors — the same loop from skills, CLI, and MCP
function DoorsCode() {
  return (
    <Term label="The three Systemix doors — the same experiment created from a Claude Code skill, the CLI, and MCP">
      <div style={dim}># skills — in Claude Code</div>
      <div>/init-experiment</div>
      <div className="mt-2" style={dim}># CLI — in your terminal</div>
      <div>$ systemix experiment new hero-copy</div>
      <div className="mt-2" style={dim}># MCP — from any agent</div>
      <div>experiment_new(&#123; id: &quot;hero-copy&quot; &#125;)</div>
      <div className="mt-2">
        <span style={ok}>✓</span> same loop, three doors
      </div>
    </Term>
  );
}

// 4 · Signals — PostHog wired, evidence flowing
function SignalsCard() {
  return (
    <Panel label="Systemix signals card — PostHog wired as the evidence source, other sources optional">
      <p className="tva-label mb-3 text-[10px] text-muted-foreground">signals</p>
      <ul className="flex flex-col gap-2.5 text-[13px]">
        <li className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          PostHog <span className="tva-label text-[9px] text-muted-foreground">wired</span>
        </li>
        <li className="flex items-center gap-2.5 text-muted-foreground">
          <span aria-hidden className="size-2 rounded-full border border-border" />
          Figma · Linear · GA <span className="tva-label text-[9px]">optional</span>
        </li>
      </ul>
      <p className="mt-4 border-t border-border pt-3 font-mono text-[12px] text-muted-foreground">
        install_command_copied ▲ 12 <span className="opacity-60">this week</span>
      </p>
    </Panel>
  );
}

// 5 · Control — the HITL close-proposal card; a human always closes
function HitlCard() {
  return (
    <Panel label="Systemix human-in-the-loop card — a close proposal awaiting human approval">
      <div className="mb-3 flex items-center justify-between">
        <p className="tva-label text-[10px] text-muted-foreground">close proposal</p>
        <span className="tva-label rounded-sm border border-warning/50 px-1.5 py-0.5 text-[9px] text-warning">
          awaiting human
        </span>
      </div>
      <p className="text-[13px] leading-relaxed">
        Promote <span className="font-mono">variant_b</span> — install copies up, evidence decision-ready.
        <span className="tva-label ml-2 text-[9px] text-muted-foreground">0.78 conf</span>
      </p>
      <div className="mt-4 flex gap-2" aria-hidden>
        <span className="tva-label rounded-md bg-primary px-3 py-1.5 text-[10px] text-primary-foreground">
          Approve
        </span>
        <span className="tva-label rounded-md border border-border px-3 py-1.5 text-[10px] text-muted-foreground">
          Reject
        </span>
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        ghost → assisted → autonomous · humans close, always
      </p>
    </Panel>
  );
}

// 6 · Drift — the drift report diff
function DriftReport() {
  return (
    <Term label="Systemix drift report — where design and code split, shown as a token diff">
      <div style={dim}>$ systemix drift-report</div>
      <div className="mt-2">
        <span style={ok}>✓</span> tokens.css ↔ components <span style={dim}>· 96% true</span>
      </div>
      <div>
        <span style={bad}>✗</span> Button — raw hex <span style={bad}>#FF6A4A</span>{" "}
        <span style={dim}>→ use --destructive</span>
      </div>
      <div>
        <span style={warn}>!</span> Card — radius 12px <span style={dim}>drifts from --radius</span>
      </div>
      <div className="mt-2">
        &gt; 2 fixes proposed, awaiting review<span className="agent-cursor" />
      </div>
    </Term>
  );
}

const MOCKUPS: Record<DeepDive["mockup"], React.ComponentType> = {
  "experiment-card": ExperimentCard,
  "learnings-feed": LearningsFeed,
  "doors-code": DoorsCode,
  "signals-card": SignalsCard,
  "hitl-card": HitlCard,
  "drift-report": DriftReport,
};

export function DeepDiveMockup({ mockup }: { mockup: DeepDive["mockup"] }) {
  const Comp = MOCKUPS[mockup];
  return <Comp />;
}
