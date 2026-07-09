// The one diagram — drawn once, used everywhere (landing, docs). Server
// component, inline SVG, theme-aware via token classes. Two variants from one
// component:
//   variant="meta"        — the 6-step self-improvement meta-loop, with the
//                           personas who own each step shown as chips.
//   variant="operational" — the honest 4-step loop that actually runs today
//                           (Propose → Build → Measure → Learn). Kept truthful
//                           for the docs pages whose prose says "four steps".
// Every arrow the system draws itself; every ✋ is a human decision.

export type PersonaTag = "business" | "design" | "engineer" | "marketer" | "agent";

const PERSONA_LABEL: Record<PersonaTag, string> = {
  business: "Biz",
  design: "Design",
  engineer: "Eng",
  marketer: "Mkt",
  agent: "AI",
};

type LoopStep = {
  label: string;
  file: string;
  note: string;
  owners?: PersonaTag[];
};

// ── The 6-step meta-loop (self-improvement; emits ideas + HITL cards) ─────────
const META_STEPS: LoopStep[] = [
  { label: "Hypothesis", file: "queue.json", note: "the next bet, framed", owners: ["business", "marketer", "design"] },
  { label: "Build", file: "experiments/<id>.mdx", note: "prototype it, together", owners: ["engineer", "design", "business"] },
  { label: "Measure", file: "PostHog evidence", note: "real numbers, pulled", owners: ["marketer", "business", "design"] },
  { label: "Evaluate", file: "evidence + thresholds", note: "does it clear the bar?", owners: ["marketer", "agent", "design", "engineer", "business"] },
  { label: "Ideate", file: "LEARNINGS.md", note: "what we learned, what's next", owners: ["business", "design", "marketer"] },
  { label: "Document", file: "LEARNINGS.md · contract", note: "synthesized, written back", owners: ["engineer", "agent", "design"] },
];

// ── The honest 4-step operational loop (what runs today) ─────────────────────
const OPERATIONAL_STEPS: LoopStep[] = [
  { label: "Propose", file: "queue.json", note: "suggests the next experiment" },
  { label: "Build", file: "experiments/<id>.mdx", note: "the bet, written down" },
  { label: "Measure", file: "PostHog evidence", note: "real numbers, pulled daily" },
  { label: "Learn", file: "LEARNINGS.md", note: "what happened, and why" },
];

const GATE = "you approve";
const RETURN_NOTE = "the notebook seeds the next idea";

// Which forward-arrows carry a human-approval gate (index = arrow after step i).
// meta: after Hypothesis (start a bet) + after Evaluate (accept a decision).
// operational: after Propose + after Measure.
const GATED: Record<"meta" | "operational", Set<number>> = {
  meta: new Set([0, 3]),
  operational: new Set([0, 2]),
};

function GatePill({ x, y }: { x: number; y: number }) {
  const w = 88;
  const h = 20;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} className="fill-primary/10 stroke-primary/40" strokeWidth="1" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" className="fill-primary font-medium">
        ✋ {GATE}
      </text>
    </g>
  );
}

/** Compact persona chips under a node; dims non-highlighted owners when set. */
function OwnerChips({ x, y, owners, highlight }: { x: number; y: number; owners: PersonaTag[]; highlight?: PersonaTag }) {
  // Precompute each chip's width + cumulative x offset (no render-time mutation).
  const chips = owners.reduce<{ o: PersonaTag; w: number; cx: number }[]>((acc, o) => {
    const w = PERSONA_LABEL[o].length * 6.2 + 12;
    const cx = acc.length ? acc[acc.length - 1].cx + acc[acc.length - 1].w + 4 : x;
    acc.push({ o, w, cx });
    return acc;
  }, []);
  return (
    <g>
      {chips.map(({ o, w, cx }) => {
        const on = !highlight || highlight === o;
        return (
          <g key={o}>
            <rect
              x={cx}
              y={y}
              width={w}
              height={16}
              rx={8}
              className={on ? "fill-primary/10 stroke-primary/30" : "fill-muted-foreground/5 stroke-muted-foreground/20"}
              strokeWidth="0.75"
            />
            <text x={cx + w / 2} y={y + 11.5} textAnchor="middle" fontSize="9" className={on ? "fill-primary" : "fill-muted-foreground/40"}>
              {PERSONA_LABEL[o]}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Node({ x, y, w, h, step, index, highlight }: { x: number; y: number; w: number; h: number; step: LoopStep; index: number; highlight?: PersonaTag }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className="fill-card stroke-border" strokeWidth="1" />
      <text x={x + 12} y={y + 22} fontSize="13.5" className="fill-foreground font-medium">
        {index + 1}. {step.label}
      </text>
      <text x={x + 12} y={y + 40} fontSize="9.5" className="fill-muted-foreground font-mono">
        {step.file}
      </text>
      <text x={x + 12} y={y + 55} fontSize="9" className="fill-muted-foreground/70">
        {step.note}
      </text>
      {step.owners && <OwnerChips x={x + 12} y={y + h - 22} owners={step.owners} highlight={highlight} />}
    </g>
  );
}

function Horizontal({ steps, gated, highlight, hasOwners }: { steps: LoopStep[]; gated: Set<number>; highlight?: PersonaTag; hasOwners: boolean }) {
  const n = steps.length;
  const W = hasOwners ? 150 : 176;
  const H = hasOwners ? 92 : 74;
  const GAP = hasOwners ? 20 : 34;
  const Y = 34;
  const xs = steps.map((_, i) => 10 + i * (W + GAP));
  const midY = Y + H / 2;
  const returnY = Y + H + 46;
  const total = xs[n - 1] + W + 10;
  const height = returnY + 34;

  return (
    <svg
      viewBox={`0 0 ${total} ${height}`}
      role="img"
      aria-label={
        hasOwners
          ? "The Systemix meta-loop: hypothesis, build, measure, evaluate, ideate, document — the personas who own each step shown as chips, with your approval after framing a bet and after evaluating it. The loop feeds its own next hypothesis."
          : "The Systemix loop: propose, build, measure, learn — with your approval before building and before recording a learning. Learnings feed the next proposal."
      }
      className="hidden w-full sm:block"
    >
      <defs>
        <marker id="loop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground/60" />
        </marker>
      </defs>

      {steps.map((s, i) => (
        <Node key={s.label} x={xs[i]} y={Y} w={W} h={H} step={s} index={i} highlight={highlight} />
      ))}

      {steps.slice(0, -1).map((_, i) => {
        const x1 = xs[i] + W;
        const x2 = xs[i + 1];
        const cx = (x1 + x2) / 2;
        return (
          <g key={i}>
            <line x1={x1 + 2} y1={midY} x2={x2 - 4} y2={midY} className="stroke-muted-foreground/50" strokeWidth="1.25" markerEnd="url(#loop-arrow)" />
            {gated.has(i) && <GatePill x={cx} y={Y - 13} />}
            {gated.has(i) && <line x1={cx} y1={Y - 3} x2={cx} y2={midY - 6} className="stroke-primary/30" strokeWidth="1" strokeDasharray="2 3" />}
          </g>
        );
      })}

      {/* return arrow: last → first */}
      <path
        d={`M ${xs[n - 1] + W / 2} ${Y + H + 2} L ${xs[n - 1] + W / 2} ${returnY} L ${xs[0] + W / 2} ${returnY} L ${xs[0] + W / 2} ${Y + H + 8}`}
        fill="none"
        className="stroke-muted-foreground/50"
        strokeWidth="1.25"
        markerEnd="url(#loop-arrow)"
      />
      <text x={(xs[0] + xs[n - 1] + W) / 2} y={returnY + 16} textAnchor="middle" fontSize="10" className="fill-muted-foreground/70">
        {RETURN_NOTE}
      </text>
    </svg>
  );
}

function Vertical({ steps, gated, highlight, hasOwners }: { steps: LoopStep[]; gated: Set<number>; highlight?: PersonaTag; hasOwners: boolean }) {
  const n = steps.length;
  const W = 250;
  const H = hasOwners ? 92 : 74;
  const GAP = 44;
  const X = 24;
  const ys = steps.map((_, i) => 14 + i * (H + GAP));
  const midX = X + W / 2;
  const returnX = X + W + 36;
  const total = ys[n - 1] + H + 24;

  return (
    <svg
      viewBox={`0 0 340 ${total}`}
      role="img"
      aria-label={
        hasOwners
          ? "The Systemix meta-loop, vertical: hypothesis, build, measure, evaluate, ideate, document, feeding back to hypothesis, with human approval gates."
          : "The Systemix loop, vertical: propose, build, measure, learn, feeding back to propose."
      }
      className="w-full sm:hidden"
    >
      <defs>
        <marker id="loop-arrow-v" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground/60" />
        </marker>
      </defs>

      {steps.map((s, i) => (
        <Node key={s.label} x={X} y={ys[i]} w={W} h={H} step={s} index={i} highlight={highlight} />
      ))}

      {steps.slice(0, -1).map((_, i) => {
        const y1 = ys[i] + H;
        const y2 = ys[i + 1];
        const cy = (y1 + y2) / 2;
        return (
          <g key={i}>
            <line x1={midX} y1={y1 + 2} x2={midX} y2={y2 - 4} className="stroke-muted-foreground/50" strokeWidth="1.25" markerEnd="url(#loop-arrow-v)" />
            {gated.has(i) && <GatePill x={midX + 74} y={cy} />}
            {gated.has(i) && <line x1={midX + 4} y1={cy} x2={midX + 30} y2={cy} className="stroke-primary/30" strokeWidth="1" strokeDasharray="2 3" />}
          </g>
        );
      })}

      <path
        d={`M ${X + W + 2} ${ys[n - 1] + H / 2} L ${returnX} ${ys[n - 1] + H / 2} L ${returnX} ${ys[0] + H / 2} L ${X + W + 8} ${ys[0] + H / 2}`}
        fill="none"
        className="stroke-muted-foreground/50"
        strokeWidth="1.25"
        markerEnd="url(#loop-arrow-v)"
      />
      <text
        x={returnX + 4}
        y={(ys[0] + ys[n - 1] + H) / 2}
        fontSize="9.5"
        className="fill-muted-foreground/70"
        transform={`rotate(90 ${returnX + 4} ${(ys[0] + ys[n - 1] + H) / 2})`}
        textAnchor="middle"
      >
        {RETURN_NOTE}
      </text>
    </svg>
  );
}

function Legend({ highlight }: { highlight?: PersonaTag }) {
  const tags: PersonaTag[] = ["business", "design", "engineer", "marketer", "agent"];
  const full: Record<PersonaTag, string> = {
    business: "Business",
    design: "Design",
    engineer: "Engineering",
    marketer: "Marketing",
    agent: "AI agents",
  };
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground/70">
      {tags.map((t) => (
        <span key={t} className={highlight && highlight !== t ? "opacity-40" : ""}>
          <span className="font-mono text-primary">{PERSONA_LABEL[t]}</span> {full[t]}
        </span>
      ))}
    </div>
  );
}

export function LoopDiagram({
  className,
  variant = "meta",
  highlightPersona,
}: {
  className?: string;
  variant?: "meta" | "operational";
  highlightPersona?: PersonaTag;
}) {
  const steps = variant === "meta" ? META_STEPS : OPERATIONAL_STEPS;
  const hasOwners = variant === "meta";
  const gated = GATED[variant];
  return (
    <figure className={className}>
      <Horizontal steps={steps} gated={gated} highlight={highlightPersona} hasOwners={hasOwners} />
      <Vertical steps={steps} gated={gated} highlight={highlightPersona} hasOwners={hasOwners} />
      {hasOwners && <Legend highlight={highlightPersona} />}
    </figure>
  );
}
