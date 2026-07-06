"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type StreamEvent =
  | { type: "log"; line: string; ts?: number }
  | { type: "done"; exitCode: number; summary: string }
  | { type: "error"; message: string };

/**
 * Live progress for one skill run — streams /api/run/[id]/stream (SSE) into a
 * terminal-style scroller and shows the exit status when the process finishes.
 */
export function RunProgressSheet({
  runId,
  label,
  onOpenChange,
}: {
  runId: string | null;
  label: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState<{ exitCode: number; summary: string } | null>(null);
  const scrollRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!runId) return;
    setLines([]);
    setDone(null);

    const source = new EventSource(`/api/run/${runId}/stream`);
    source.onmessage = (e) => {
      let ev: StreamEvent;
      try {
        ev = JSON.parse(e.data);
      } catch {
        return;
      }
      if (ev.type === "log") {
        setLines((prev) => [...prev, ev.line]);
      } else if (ev.type === "done") {
        setDone({ exitCode: ev.exitCode, summary: ev.summary });
        source.close();
      } else if (ev.type === "error") {
        setLines((prev) => [...prev, `error: ${ev.message}`]);
        source.close();
      }
    };
    source.onerror = () => {
      // Stream closed server-side (done) or connection lost — stop retrying.
      source.close();
    };
    return () => source.close();
  }, [runId]);

  // Keep the tail in view as lines stream in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, done]);

  return (
    <Sheet open={runId !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle className="font-mono text-sm">{label ?? "Skill run"}</SheetTitle>
          <SheetDescription>
            {done
              ? done.exitCode === 0
                ? "Completed successfully."
                : `Exited with code ${done.exitCode}.`
              : "Running — output streams live below."}
          </SheetDescription>
        </SheetHeader>
        <pre
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto bg-background p-4 font-mono text-[12px] leading-relaxed text-muted-foreground"
        >
          {lines.length === 0 && !done ? "waiting for output…\n" : lines.join("\n")}
        </pre>
        {done ? (
          <div className="shrink-0 border-t px-4 py-3">
            <p
              className={`font-mono text-[12px] ${done.exitCode === 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              {done.exitCode === 0 ? "✓" : "✕"} exit {done.exitCode}
              {done.summary ? ` · ${done.summary}` : ""}
            </p>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
