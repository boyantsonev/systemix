// Decorative scroll-rhythm bands between landing sections.
//
// TODAY: a cheap, static, theme-aware SVG texture (no canvas, no JS, no anim) —
// it reserves the exact layout footprint and reads the amber tokens via
// currentColor, dissolving at the edges with a radial mask.
//
// LATER (upgrade in THIS file, props unchanged): swap the inner render per
// `variant` for a real library-backed effect — `crt-geo`/`dither-field` →
// copy-paste magicui backgrounds (RetroGrid/GridPattern/DotPattern/Ripple),
// `ascii-wave` → the `asciiground` canvas lib. Load those with
// `next/dynamic {ssr:false}`, resolve token colors at runtime via
// getComputedStyle, gate on prefers-reduced-motion, and pause off-screen with
// IntersectionObserver (clone src/components/ui/flickering-grid.tsx).

import { cn } from "@/lib/utils";

export type ScrollEffectVariant = "ascii-wave" | "crt-geo" | "dither-field";

const TINT: Record<"primary" | "highlight" | "foreground", string> = {
  primary: "text-primary",
  highlight: "text-highlight",
  foreground: "text-foreground",
};

const OPACITY: Record<"calm" | "soft" | "med", number> = {
  calm: 0.06,
  soft: 0.1,
  med: 0.16,
};

/** Static stand-in patterns. currentColor inherits the tint class → theme-aware. */
function Pattern({ variant, density }: { variant: ScrollEffectVariant; density: number }) {
  const id = `se-${variant}-${density}`;
  if (variant === "crt-geo") {
    return (
      <svg className="h-full w-full" aria-hidden>
        <defs>
          <pattern id={id} width={density} height={density} patternUnits="userSpaceOnUse">
            <path d={`M ${density} 0 L 0 0 0 ${density}`} fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
  if (variant === "dither-field") {
    return (
      <svg className="h-full w-full" aria-hidden>
        <defs>
          <pattern id={id} width={density} height={density} patternUnits="userSpaceOnUse">
            <circle cx={density / 2} cy={density / 2} r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
  // ascii-wave — rows of marks, offset per row to suggest a static wave.
  const glyphs = ["·", ":", "+", "*", "+", ":"];
  return (
    <svg className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 160">
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 40 }).map((__, col) => {
          const y = 24 + row * 24 + Math.sin((col + row) / 3) * 6;
          return (
            <text
              key={`${row}-${col}`}
              x={8 + col * 15}
              y={y}
              fontSize="11"
              fontFamily="var(--font-mono), monospace"
              fill="currentColor"
            >
              {glyphs[(col + row) % glyphs.length]}
            </text>
          );
        }),
      )}
    </svg>
  );
}

export function ScrollEffect({
  variant,
  height = 200,
  intensity = "calm",
  density = 22,
  tint = "primary",
  className,
}: {
  variant: ScrollEffectVariant;
  height?: number | string;
  intensity?: "calm" | "soft" | "med";
  density?: number;
  tint?: "primary" | "highlight" | "foreground";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none relative w-full select-none", TINT[tint], className)}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        // dissolve toward the edges with a radial mask
        maskImage: "radial-gradient(120% 80% at 50% 50%, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(120% 80% at 50% 50%, black 30%, transparent 75%)",
        opacity: OPACITY[intensity],
      }}
    >
      <div className="absolute inset-0">
        <Pattern variant={variant} density={density} />
      </div>
    </div>
  );
}
