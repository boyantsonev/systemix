// The one diagram — how Systemix works, drawn once and used everywhere
// (landing "How it works", docs index, docs concepts/the-loop). Server
// component, inline SVG, theme-aware via token classes. Two layouts from the
// same data: horizontal (sm+) and vertical (mobile).
//
// The story it tells: Propose → [you approve] → Build → Measure → [you approve]
// → Learn → back to Propose. Every arrow the system draws itself; every ✋ is a
// human decision.

const STEPS = [
  { label: "Propose", file: "queue.json", note: "suggests the next experiment" },
  { label: "Build", file: "experiments/<id>.mdx", note: "the bet, written down" },
  { label: "Measure", file: "PostHog evidence", note: "real numbers, pulled daily" },
  { label: "Learn", file: "LEARNINGS.md", note: "what happened, and why" },
] as const;

const GATE = "you approve";
const RETURN_NOTE = "the notebook seeds the next idea";

/** Which arrows carry a human-approval gate (index = arrow after STEPS[i]). */
const GATED = new Set([0, 2]);

function GatePill({ x, y }: { x: number; y: number }) {
  // A small pill centered at (x, y): ✋ + "you approve"
  const w = 92;
  const h = 22;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        className="fill-primary/10 stroke-primary/40"
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fontSize="10.5"
        className="fill-primary font-medium"
      >
        ✋ {GATE}
      </text>
    </g>
  );
}

function Node({
  x,
  y,
  w,
  h,
  step,
  index,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  step: (typeof STEPS)[number];
  index: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className="fill-card stroke-border"
        strokeWidth="1"
      />
      <text x={x + 14} y={y + 25} fontSize="15" className="fill-foreground font-medium">
        {index + 1}. {step.label}
      </text>
      <text x={x + 14} y={y + 45} fontSize="10.5" className="fill-muted-foreground font-mono">
        {step.file}
      </text>
      <text x={x + 14} y={y + 61} fontSize="10" className="fill-muted-foreground/70">
        {step.note}
      </text>
    </g>
  );
}

function Horizontal() {
  const W = 170; // node width
  const H = 74; // node height
  const GAP = 34;
  const Y = 34; // node top
  const xs = STEPS.map((_, i) => 10 + i * (W + GAP));
  const midY = Y + H / 2;
  const returnY = Y + H + 52;
  const total = xs[3] + W + 10;

  return (
    <svg
      viewBox={`0 0 ${total} 220`}
      role="img"
      aria-label="The Systemix loop: propose, build, measure, learn — with your approval between propose and build, and again before a learning is recorded. Learnings feed the next proposal."
      className="hidden w-full sm:block"
    >
      <defs>
        <marker id="loop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground/60" />
        </marker>
      </defs>

      {STEPS.map((s, i) => (
        <Node key={s.label} x={xs[i]} y={Y} w={W} h={H} step={s} index={i} />
      ))}

      {/* forward arrows + gates */}
      {[0, 1, 2].map((i) => {
        const x1 = xs[i] + W;
        const x2 = xs[i + 1];
        const cx = (x1 + x2) / 2;
        return (
          <g key={i}>
            <line x1={x1 + 2} y1={midY} x2={x2 - 4} y2={midY} className="stroke-muted-foreground/50" strokeWidth="1.25" markerEnd="url(#loop-arrow)" />
            {GATED.has(i) && <GatePill x={cx} y={Y - 14} />}
            {GATED.has(i) && (
              <line x1={cx} y1={Y - 3} x2={cx} y2={midY - 6} className="stroke-primary/30" strokeWidth="1" strokeDasharray="2 3" />
            )}
          </g>
        );
      })}

      {/* return arrow: Learn → Propose */}
      <path
        d={`M ${xs[3] + W / 2} ${Y + H + 2} L ${xs[3] + W / 2} ${returnY} L ${xs[0] + W / 2} ${returnY} L ${xs[0] + W / 2} ${Y + H + 8}`}
        fill="none"
        className="stroke-muted-foreground/50"
        strokeWidth="1.25"
        markerEnd="url(#loop-arrow)"
      />
      <text x={(xs[0] + xs[3] + W) / 2} y={returnY + 18} textAnchor="middle" fontSize="10.5" className="fill-muted-foreground/70">
        {RETURN_NOTE}
      </text>
    </svg>
  );
}

function Vertical() {
  const W = 230;
  const H = 74;
  const GAP = 46;
  const X = 24; // node left
  const ys = STEPS.map((_, i) => 14 + i * (H + GAP));
  const midX = X + W / 2;
  const returnX = X + W + 36;
  const total = ys[3] + H + 44;

  return (
    <svg
      viewBox={`0 0 320 ${total}`}
      role="img"
      aria-label="The Systemix loop: propose, build, measure, learn — with your approval between propose and build, and again before a learning is recorded. Learnings feed the next proposal."
      className="w-full sm:hidden"
    >
      <defs>
        <marker id="loop-arrow-v" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground/60" />
        </marker>
      </defs>

      {STEPS.map((s, i) => (
        <Node key={s.label} x={X} y={ys[i]} w={W} h={H} step={s} index={i} />
      ))}

      {/* forward arrows + gates */}
      {[0, 1, 2].map((i) => {
        const y1 = ys[i] + H;
        const y2 = ys[i + 1];
        const cy = (y1 + y2) / 2;
        return (
          <g key={i}>
            <line x1={midX} y1={y1 + 2} x2={midX} y2={y2 - 4} className="stroke-muted-foreground/50" strokeWidth="1.25" markerEnd="url(#loop-arrow-v)" />
            {GATED.has(i) && <GatePill x={midX + 76} y={cy} />}
            {GATED.has(i) && (
              <line x1={midX + 4} y1={cy} x2={midX + 28} y2={cy} className="stroke-primary/30" strokeWidth="1" strokeDasharray="2 3" />
            )}
          </g>
        );
      })}

      {/* return arrow: Learn → Propose (right rail) */}
      <path
        d={`M ${X + W + 2} ${ys[3] + H / 2} L ${returnX} ${ys[3] + H / 2} L ${returnX} ${ys[0] + H / 2} L ${X + W + 8} ${ys[0] + H / 2}`}
        fill="none"
        className="stroke-muted-foreground/50"
        strokeWidth="1.25"
        markerEnd="url(#loop-arrow-v)"
      />
      <text
        x={returnX + 4}
        y={(ys[0] + ys[3] + H) / 2}
        fontSize="10"
        className="fill-muted-foreground/70"
        transform={`rotate(90 ${returnX + 4} ${(ys[0] + ys[3] + H) / 2})`}
        textAnchor="middle"
      >
        {RETURN_NOTE}
      </text>
    </svg>
  );
}

export function LoopDiagram({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <Horizontal />
      <Vertical />
    </figure>
  );
}
