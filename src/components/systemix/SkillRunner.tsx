"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { RunProgressSheet } from "./RunProgressSheet";
import type { SkillDef } from "@/lib/skill-map";

export type SkillListing = { slug: string; def: SkillDef };

/**
 * Play chips for the CLI-runnable skills — each press POSTs /api/run and opens
 * the live progress sheet. Runs are a local-app capability; on the deployed
 * demo the chips render disabled (runsEnabled=false, decided server-side).
 */
export function SkillRunner({
  skills,
  runsEnabled,
  onRunStarted,
}: {
  skills: SkillListing[];
  runsEnabled: boolean;
  onRunStarted?: () => void;
}) {
  const [active, setActive] = useState<{ runId: string; label: string } | null>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function play(slug: string, label: string) {
    if (!runsEnabled || starting) return;
    setStarting(slug);
    setError(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Failed to start ${label}`);
        return;
      }
      setActive({ runId: data.runId, label });
      onRunStarted?.();
    } catch {
      setError(`Failed to start ${label}`);
    } finally {
      setStarting(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map(({ slug, def }) => (
          <button
            key={slug}
            type="button"
            disabled={!runsEnabled || starting !== null}
            onClick={() => play(slug, def.label)}
            title={
              runsEnabled
                ? def.description
                : "Skill runs execute in the local app — npx systemix init"
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[12px] transition-colors",
              runsEnabled
                ? "border-border/60 text-foreground hover:border-foreground"
                : "cursor-not-allowed border-border/40 text-muted-foreground/50",
              starting === slug && "opacity-60",
            )}
          >
            <Play className="size-3" />
            {def.label}
          </button>
        ))}
      </div>
      {error ? <p className="mt-2 font-mono text-[11px] text-destructive">{error}</p> : null}
      {!runsEnabled ? (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground/60">
          Skill runs execute in the local app — <code>npx systemix init</code>
        </p>
      ) : null}
      <RunProgressSheet
        runId={active?.runId ?? null}
        label={active?.label ?? null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      />
    </div>
  );
}
