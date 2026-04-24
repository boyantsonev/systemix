"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-4 py-2.5 font-mono text-[13px] hover:bg-muted/80 hover:border-border/80 transition-colors cursor-pointer select-none group"
      title="Click to copy"
    >
      <span className="text-muted-foreground/40">$</span>
      <span className="text-foreground">{command}</span>
      <span className="ml-1 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
        {copied
          ? <Check size={12} className="text-emerald-500" />
          : <span className="text-[10px]">copy</span>
        }
      </span>
    </button>
  );
}
