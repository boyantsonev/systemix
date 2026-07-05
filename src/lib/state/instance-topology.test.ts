import { describe, it, expect } from "vitest";
import { buildInstanceTopology } from "./instance-topology";
import type { InstanceConfig } from "./instance-config";

// A minimal instance config. buildInstanceTopology also reads real files at
// process.cwd() (the pipeline manifest → skill nodes, experiments/ → artifacts),
// which exist at the repo root where vitest runs — so the loop skill nodes the
// recall edges attach to are present.
const cfg = {
  version: 1,
  surfaces: [],
  signals: { figma: { enabled: true } }, // enabled but wiring not verifiable → dim
  hermes: { model: "", endpoint: "", autonomy: "ghost", thresholds: { high: 0.85, medium: 0.55 } },
  self_improvement: { mode: "audit" },
  trust: { orchestrator_tier: 0, hermes_tier: 0 },
  atlas: { agents: { hermes: { label: "Hermes" } } },
} as unknown as InstanceConfig;

describe("buildInstanceTopology — reflects what the loop actually has", () => {
  const topo = buildInstanceTopology(cfg);
  const ids = new Set(topo.nodes.map((n) => n.id));
  const hasLink = (a: string, b: string) =>
    topo.links.some((l) => (l.source === a && l.target === b) || (l.source === b && l.target === a));

  it("includes the memory ledger and the CLI door", () => {
    expect(ids.has("infra:learnings")).toBe(true);
    expect(ids.has("tool:cli")).toBe(true);
  });

  it("wires the recall loop: the three doors read the ledger; close writes it, init recalls it", () => {
    expect(hasLink("tool:cli", "infra:learnings")).toBe(true); // CLI door reads the ledger
    expect(hasLink("tool:mcp", "infra:learnings")).toBe(true); // MCP door reads the ledger
    expect(hasLink("skill:close-experiment", "infra:learnings")).toBe(true); // close writes it
    expect(hasLink("infra:learnings", "skill:init-experiment")).toBe(true); // init recalls from it
  });

  it("keeps an enabled-but-unwired source visible, in its not-connected (dim) state", () => {
    expect(ids.has("source:figma")).toBe(true); // still shown (the onboarding map)
    expect(topo.activeIds).not.toContain("source:figma"); // but dim — not live
  });
});
