"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RunProgressSheet } from "./RunProgressSheet";

export type RunManifest = {
  runId: string;
  skill: string;
  label?: string;
  status: "running" | "success" | "error";
  startedAt: string;
  completedAt?: string;
  exitCode?: number;
  summary?: string;
};

const STATUS_DOT: Record<string, string> = {
  running: "bg-amber-500 animate-pulse",
  success: "bg-emerald-500",
  error: "bg-red-500",
};

function duration(r: RunManifest): string {
  if (!r.completedAt) return "…";
  const ms = new Date(r.completedAt).getTime() - new Date(r.startedAt).getTime();
  if (Number.isNaN(ms) || ms < 0) return "—";
  return ms < 1000 ? `${ms}ms` : `${Math.round(ms / 1000)}s`;
}

/**
 * The agentic task feed — recent skill runs from the .systemix/runs manifests
 * (one writer, this is just a reader via GET /api/runs). Polls faster while
 * anything is running; clicking a row reopens its live progress stream.
 */
export function RuntimeFeed({
  refreshKey = 0,
  limit = 8,
}: {
  refreshKey?: number;
  limit?: number;
}) {
  const [runs, setRuns] = useState<RunManifest[] | null>(null);
  const [selected, setSelected] = useState<RunManifest | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/runs");
      if (!res.ok) return;
      const data = await res.json();
      setRuns(Array.isArray(data.runs) ? data.runs : []);
    } catch {
      // Feed is best-effort — keep the last known state.
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const anyRunning = (runs ?? []).some((r) => r.status === "running");

  useEffect(() => {
    const interval = setInterval(load, anyRunning ? 5_000 : 30_000);
    return () => clearInterval(interval);
  }, [load, anyRunning]);

  const visible = (runs ?? []).slice(0, limit);

  return (
    <div>
      {runs === null ? (
        <p className="text-sm leading-relaxed text-muted-foreground">Loading runs…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          No runs yet — press play on a skill and it lands here: status, duration,
          and the live log while it executes.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((r) => (
            <button
              key={r.runId}
              type="button"
              onClick={() => setSelected(r)}
              className="rounded-lg border p-2.5 text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[r.status] ?? "bg-muted-foreground")}
                />
                <span className="truncate text-sm text-foreground">{r.label ?? r.skill}</span>
                <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
                  {r.status} · {duration(r)}
                </span>
              </div>
              <span className="mt-0.5 block truncate pl-3.5 font-mono text-[11px] text-muted-foreground/60">
                {r.startedAt.slice(0, 16).replace("T", " · ")}
                {r.summary ? ` — ${r.summary}` : ""}
              </span>
            </button>
          ))}
        </div>
      )}
      <RunProgressSheet
        runId={selected?.runId ?? null}
        label={selected?.label ?? selected?.skill ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            load();
          }
        }}
      />
    </div>
  );
}
