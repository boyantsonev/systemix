"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { INIT_COMMAND } from "@/lib/landing/content";
import { MCP_TOOL_NAMES } from "@/lib/landing/personas";

/**
 * The agents-page play: flip between reading the tool surface as a human
 * (a grid of chips) and as a machine (the raw tool list an MCP client sees).
 */
export function HumansMachinesToggle() {
  const [mode, setMode] = useState<"humans" | "machines">("humans");

  return (
    <div>
      <div className="mb-5 inline-flex items-center rounded-full border border-border/60 p-1 font-mono text-[12px]">
        {(["humans", "machines"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "rounded-full px-4 py-1.5 transition-colors",
              mode === m
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "humans" ? "for humans" : "for machines"}
          </button>
        ))}
      </div>

      {mode === "humans" ? (
        <div className="flex flex-wrap gap-2">
          {MCP_TOOL_NAMES.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border/50 bg-card px-3 py-1.5 font-mono text-[12px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        <pre className="overflow-x-auto rounded-lg border border-border/50 bg-background p-4 font-mono text-[12px] leading-relaxed text-muted-foreground">
          <code>
            {`# an MCP client sees:\n`}
            {MCP_TOOL_NAMES.map((t) => `mcp__systemix__${t}`).join("\n")}
            {`\n\n# connect:\n${INIT_COMMAND}  # then add packages/mcp-server to your agent's MCP config`}
          </code>
        </pre>
      )}
    </div>
  );
}
