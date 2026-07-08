// The instance topology — source of truth for the Config-layer force graph.
// Blank-slate: the nodes/links are empty until the runtime feeds them (Phase 5
// repurposes this to a pipeline-runtime topology). The 7-type taxonomy + colors
// are kept so the graph + legend render consistently once populated.

export type NodeType = "source" | "skill" | "agent" | "artifact" | "infra" | "concept" | "tool";

export type NodeSize = "sm" | "md" | "lg";

export interface SystemNode {
  id: string;
  label: string;
  sub?: string;
  type: NodeType;
  size: NodeSize;
}

export interface SystemLink {
  source: string;
  target: string;
}

// ── Colors ──────────────────────────────────────────────────────────────────────
// Full sets (stroke / fill / text / glow) drive the node-info panel; the force graph
// colors nodes and links by the per-type `stroke` hex.

export interface ColorTriplet {
  stroke: string;
  fill: string;
  text: string;
  glow: string;
}

export type ColorSet = Record<NodeType, ColorTriplet>;

// TVA v1.1: the taxonomy renders on the warm ramp — 7 distinct warm hues,
// no blue/violet/cyan (design/guardrails.mdx). Strokes match the phosphor set
// in globals.css (.dark) and its light printout equivalents.
export const TYPE_COLOR_DARK: ColorSet = {
  source:   { stroke: "#FF9E3D", fill: "#241304", text: "#FFC58A", glow: "rgba(255,158,61,0.3)" },
  skill:    { stroke: "#B7C46A", fill: "#171A0A", text: "#D3DCA0", glow: "rgba(183,196,106,0.3)" },
  agent:    { stroke: "#FFC24D", fill: "#241A05", text: "#FFD98F", glow: "rgba(255,194,77,0.3)" },
  artifact: { stroke: "#D9B36A", fill: "#1F1809", text: "#E8CFA0", glow: "rgba(217,179,106,0.4)" },
  infra:    { stroke: "#FF6A4A", fill: "#240B05", text: "#FFA48F", glow: "rgba(255,106,74,0.35)" },
  concept:  { stroke: "#A98B4F", fill: "#181206", text: "#C7AE7E", glow: "rgba(169,139,79,0.25)" },
  tool:     { stroke: "#FFD84D", fill: "#241E05", text: "#FFE694", glow: "rgba(255,216,77,0.3)" },
};

export const TYPE_COLOR_LIGHT: ColorSet = {
  source:   { stroke: "#A8511A", fill: "#F7EBDC", text: "#7C3B12", glow: "rgba(168,81,26,0.12)" },
  skill:    { stroke: "#5D6626", fill: "#EFF1DF", text: "#434A1B", glow: "rgba(93,102,38,0.12)" },
  agent:    { stroke: "#B07A16", fill: "#F7EFDA", text: "#7E5710", glow: "rgba(176,122,22,0.12)" },
  artifact: { stroke: "#6E5A2A", fill: "#F1ECDE", text: "#4F401E", glow: "rgba(110,90,42,0.12)" },
  infra:    { stroke: "#A8412C", fill: "#F7E6E0", text: "#7C2F20", glow: "rgba(168,65,44,0.12)" },
  concept:  { stroke: "#7A6A48", fill: "#F0EBDF", text: "#574B32", glow: "rgba(122,106,72,0.08)" },
  tool:     { stroke: "#8A5A00", fill: "#F5EDD8", text: "#634100", glow: "rgba(138,90,0,0.12)" },
};

export const TYPE_LABEL: Record<NodeType, string> = {
  source:   "Data source",
  skill:    "Skill (slash command)",
  agent:    "Agent / runtime",
  artifact: "Artifact",
  infra:    "Infrastructure",
  concept:  "Concept / UI",
  tool:     "AI tool",
};

// Relative node volume for `nodeVal` in the force graph.
export const SIZE_VAL: Record<NodeSize, number> = { sm: 2, md: 4.5, lg: 10 };

// ── Topology data lives in src/lib/state/instance-topology.ts ─────────────────────
// The force graph is fed its nodes/links by the topology builder (ADR-021). This
// module keeps only the shared shape the graph + cards render against: the node /
// link types (above), the 7-type palette, and the labels.
