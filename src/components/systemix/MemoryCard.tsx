import Link from "next/link";
import type { LearningEntry } from "@/lib/contract/learnings";
import type { DriftSnapshot } from "@/lib/state/drift-history";

/**
 * Config-home bento card: the design-system memory at a glance — latest drift
 * score + trend direction and the last earned learnings. Server data in via
 * props (the page loads it); links out to /contract/memory for the full feeds.
 */
export function MemoryCard({
  learnings,
  driftTrend,
}: {
  learnings: LearningEntry[];
  driftTrend: DriftSnapshot[];
}) {
  const latest = driftTrend.length > 0 ? driftTrend[driftTrend.length - 1] : null;
  const prev = driftTrend.length > 1 ? driftTrend[driftTrend.length - 2] : null;
  const arrow =
    latest && prev ? (latest.score > prev.score ? "↑" : latest.score < prev.score ? "↓" : "→") : null;
  const recent = learnings.slice(0, 2);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/40 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Memory
        </p>
        <Link
          href="/contract/memory"
          className="text-[12px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Open memory →
        </Link>
      </div>

      <div className="mb-4 flex items-baseline gap-3">
        {latest ? (
          <>
            <span className="text-3xl font-black text-foreground">
              {latest.score}
              {arrow ? <span className="ml-1 text-base text-muted-foreground">{arrow}</span> : null}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground/60">
              drift score · {latest.runAt.slice(0, 10)}
            </span>
          </>
        ) : (
          <span className="font-mono text-[12px] text-muted-foreground/60">
            no drift audits yet — play the Drift Report skill
          </span>
        )}
      </div>

      <div className="flex-1 space-y-2">
        {recent.length === 0 ? (
          <p className="font-mono text-[12px] leading-relaxed text-muted-foreground/60">
            No learnings yet — the first earned line lands when a running
            experiment closes.
          </p>
        ) : (
          recent.map((l) => (
            <div key={l.raw} className="rounded-lg border border-border/40 bg-muted/10 px-3 py-2">
              <p className="truncate text-[12px] font-semibold text-foreground">{l.title}</p>
              <p className="font-mono text-[10px] text-muted-foreground/60">
                {l.date ?? ""} · {l.decision ?? "—"} · confidence {l.confidence ?? "—"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
