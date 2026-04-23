import Link from "next/link";
import { SLogo } from "@/components/systemix/SLogo";
import { ThemeToggle } from "@/components/systemix/ThemeToggle";
import { SystemGraph, GraphLegend } from "@/components/graph/SystemGraph";

export default function GraphPage() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col" style={{ background: "#080812" }}>
      {/* Minimal top bar */}
      <header className="h-11 shrink-0 flex items-center justify-between px-5 border-b border-white/5 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
          >
            <SLogo size={13} className="text-current" />
            <span className="text-[11px] font-mono">systemix</span>
          </Link>
          <span className="text-white/15 text-xs">/</span>
          <span className="text-[11px] font-mono text-white/30">architecture</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/docs/skills"
            className="text-[11px] font-mono text-white/20 hover:text-white/50 transition-colors"
          >
            Skills →
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Graph — full remaining height */}
      <div className="flex-1 relative">
        <SystemGraph />

        {/* Legend */}
        <div className="absolute bottom-5 left-5 z-10">
          <GraphLegend />
        </div>

        {/* Hover hint */}
        <div className="absolute bottom-5 right-5 z-10">
          <p className="text-[10px] font-mono text-white/15">
            hover to explore · scroll to zoom · drag to pan
          </p>
        </div>
      </div>
    </div>
  );
}
