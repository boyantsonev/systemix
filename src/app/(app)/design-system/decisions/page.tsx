import { readFileSync } from "node:fs";
import { join } from "node:path";

type Card = {
  id: string;
  type: "drift-resolution" | "instrumentation-approval" | "new-token";
  token?: string;
  component?: string;
  description: string;
  action: "approved" | "rejected" | "deferred";
  resolvedAt?: string;
  requestedAt?: string;
  isDemo?: boolean;
};

const DEMO_RESOLVED: Card[] = [
  {
    id: "demo-r1",
    type: "drift-resolution",
    token: "color.primary.500",
    description: "Figma value #6366f1 vs code oklch(0.588 0.233 277.1) — delta-E 2.4",
    action: "approved",
    resolvedAt: "2026-04-20T14:22:00Z",
    requestedAt: "2026-04-20T09:00:00Z",
    isDemo: true,
  },
  {
    id: "demo-r2",
    type: "new-token",
    token: "color.accent.violet",
    description: "New token detected in Figma — not yet in globals.css",
    action: "deferred",
    resolvedAt: "2026-04-19T11:05:00Z",
    requestedAt: "2026-04-18T16:30:00Z",
    isDemo: true,
  },
  {
    id: "demo-r3",
    type: "instrumentation-approval",
    component: "Button",
    description: "PostHog instrumentation proposal: track click events on variant=primary",
    action: "rejected",
    resolvedAt: "2026-04-17T08:45:00Z",
    requestedAt: "2026-04-16T15:00:00Z",
    isDemo: true,
  },
];

function readResolvedCards(): { cards: Card[]; isDemo: boolean } {
  const queuePath = join(process.cwd(), ".systemix", "queue.json");
  try {
    const raw = JSON.parse(readFileSync(queuePath, "utf8")) as { cards: Card[] };
    const resolved = (raw.cards ?? []).filter(
      (c) => c.action === "approved" || c.action === "rejected" || c.action === "deferred"
    );
    if (resolved.length > 0) return { cards: resolved, isDemo: false };
  } catch {}
  return { cards: DEMO_RESOLVED, isDemo: true };
}

const ACTION_CONFIG = {
  approved: { label: "Approved",  glyph: "✓", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  rejected: { label: "Rejected",  glyph: "✕", color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
  deferred: { label: "Deferred",  glyph: "→", color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
} as const;

const TYPE_LABEL: Record<string, string> = {
  "drift-resolution":         "Drift",
  "instrumentation-approval": "Instrumentation",
  "new-token":                "New token",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function DecisionsPage() {
  const { cards, isDemo } = readResolvedCards();
  const sorted = [...cards].sort(
    (a, b) => String(b.resolvedAt ?? b.requestedAt ?? "").localeCompare(String(a.resolvedAt ?? a.requestedAt ?? ""))
  );

  return (
    <>
      {isDemo && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0 mt-1" />
          <p className="text-[12px] text-amber-500/70 leading-relaxed">
            Sample data. Run <code className="font-mono bg-amber-500/10 px-1 rounded">npx systemix watch</code> and approve decisions to populate this log.
          </p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground mb-1">Decisions</h1>
        <p className="text-[13px] text-muted-foreground">
          Audit trail of every HITL decision — token drift approvals, instrumentation sign-offs, and new token resolutions.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-[13px] text-muted-foreground/50">No resolved decisions yet.</p>
          <p className="text-[12px] font-mono text-muted-foreground/30 mt-1">
            Decisions appear here once you approve, reject, or defer items from the HITL queue.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((card) => {
            const cfg = ACTION_CONFIG[card.action as keyof typeof ACTION_CONFIG];
            if (!cfg) return null;
            const label = card.token ?? card.component ?? card.id;
            return (
              <div
                key={card.id}
                className="flex items-start gap-3 rounded-xl border border-border/40 px-4 py-3"
              >
                <span className={`mt-0.5 text-[13px] font-mono shrink-0 ${cfg.color}`}>{cfg.glyph}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[13px] font-semibold text-foreground font-mono truncate">{label}</span>
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wide border rounded px-1.5 py-0.5 leading-none ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/40">
                      {TYPE_LABEL[card.type] ?? card.type}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground/70 leading-snug">{card.description}</p>
                </div>
                <div className="shrink-0 text-right space-y-0.5">
                  {card.resolvedAt && (
                    <p className="text-[10px] font-mono text-muted-foreground/50">{formatDate(card.resolvedAt)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-[10px] font-mono text-muted-foreground/25 text-center">
        {sorted.length} decision{sorted.length !== 1 ? "s" : ""} · sourced from .systemix/queue.json
      </p>
    </>
  );
}
