import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Link from "next/link";
import { RiArrowRightUpLine } from "@remixicon/react";

// Build-time read of the real experiment driving THIS site + the earned memory
// ledger. Honest by construction: it renders whatever the files say — a running
// experiment shows "measuring", a closed one shows its decision + confidence and
// the first cited LEARNINGS line. No placeholders, no invented numbers.

const EXPERIMENT_ID = "landing-live-loop-2026-06";

type ExperimentFM = {
  hypothesis?: string;
  metric?: string;
  status?: string;
  icp?: string;
  decision?: string | null;
  confidence?: number | null;
};

function readExperiment(): ExperimentFM | null {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "experiments", `${EXPERIMENT_ID}.mdx`),
      "utf8",
    );
    return matter(raw).data as ExperimentFM;
  } catch {
    return null;
  }
}

/** First real bullet under `## Memory` in LEARNINGS.md, or null while empty. */
function readFirstLearning(): string | null {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "experiments", "LEARNINGS.md"),
      "utf8",
    );
    const memory = raw.split(/^##\s+Memory\s*$/m)[1] ?? "";
    const bullet = memory
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.startsWith("- "));
    return bullet ? bullet.replace(/^- /, "") : null;
  } catch {
    return null;
  }
}

export function LiveLoopProof({ className }: { className?: string }) {
  const exp = readExperiment();
  if (!exp) return null;

  const learning = readFirstLearning();
  const closed = !!exp.decision;

  return (
    <div className={className}>
      <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Running on this site · {EXPERIMENT_ID}
          </span>
          <span
            className={
              closed
                ? "rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background"
                : "rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
            }
          >
            {closed ? "closed" : "measuring"}
          </span>
        </div>

        {exp.hypothesis && (
          <p className="text-[15px] font-medium leading-relaxed text-foreground">
            “{exp.hypothesis}”
          </p>
        )}

        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              ICP
            </dt>
            <dd className="mt-1 text-[13px] font-medium text-foreground">{exp.icp ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Metric
            </dt>
            <dd className="mt-1 font-mono text-[13px] text-foreground">{exp.metric ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              {closed ? "Decision" : "Status"}
            </dt>
            <dd className="mt-1 text-[13px] font-medium text-foreground">
              {closed
                ? `${exp.decision}${exp.confidence != null ? ` · ${Math.round(exp.confidence * 100)}% conf` : ""}`
                : (exp.status ?? "running")}
            </dd>
          </div>
        </dl>

        <div className="mt-6 rounded-lg border border-dashed border-border/50 bg-muted/20 p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            experiments/LEARNINGS.md
          </p>
          {learning ? (
            <p className="text-[13px] leading-relaxed text-foreground">{learning}</p>
          ) : (
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              No entries yet — the first earned line lands the moment this experiment closes.
              Nothing here is hand-written.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href={`/experiments/${EXPERIMENT_ID}`}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
          >
            See this experiment <RiArrowRightUpLine className="h-4 w-4" />
          </Link>
          <Link
            href="/experiments"
            className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Browse the whole loop →
          </Link>
        </div>
      </div>
    </div>
  );
}
