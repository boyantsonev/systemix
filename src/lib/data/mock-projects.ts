export type ProjectStatus = "active" | "staging" | "in-progress";
export type AdapterStatus = "connected" | "degraded" | "disconnected";
export type ProjectPurpose = "design-system" | "landing" | "app";
export type ActivityEventType =
  | "contract_built"
  | "drift_resolved"
  | "hitl_decision"
  | "skill_run"
  | "deploy"
  | "hypothesis_validated";

export type Project = {
  slug: string;
  name: string;
  status: ProjectStatus;
  purpose?: ProjectPurpose;
  qualityScore: number;
  lastSync: string;
  tokenCount: number;
  componentCount: number;
  driftCount: number;
  pendingHitl: number;
  experiments?: number;
  pendingHypotheses?: number;
  adapters: {
    codebase: AdapterStatus;
    figma: AdapterStatus;
    storybook: AdapterStatus;
    posthog?: AdapterStatus;
  };
  sourceOfTruth: "codebase" | "figma";
};

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  description: string;
  project: string;
  ago: string;
  actor?: string;
};

export const mockProjects: Project[] = [
  {
    slug: "systemix-landing",
    name: "Systemix Landing",
    status: "active",
    purpose: "landing",
    qualityScore: 0.72,
    lastSync: "2026-04-27T10:00:00Z",
    tokenCount: 31,
    componentCount: 0,
    driftCount: 0,
    pendingHitl: 1,
    experiments: 2,
    pendingHypotheses: 1,
    sourceOfTruth: "codebase",
    adapters: {
      codebase: "connected",
      figma: "disconnected",
      storybook: "disconnected",
      posthog: "connected",
    },
  },
  {
    slug: "finova",
    name: "Finova",
    status: "active",
    purpose: "design-system",
    qualityScore: 0.94,
    lastSync: "2026-04-23T12:30:00Z",
    tokenCount: 47,
    componentCount: 12,
    driftCount: 3,
    pendingHitl: 2,
    sourceOfTruth: "codebase",
    adapters: {
      codebase: "connected",
      figma: "connected",
      storybook: "degraded",
    },
  },
  {
    slug: "verdure",
    name: "Verdure",
    status: "staging",
    purpose: "design-system",
    qualityScore: 0.87,
    lastSync: "2026-04-23T08:15:00Z",
    tokenCount: 31,
    componentCount: 8,
    driftCount: 7,
    pendingHitl: 4,
    sourceOfTruth: "codebase",
    adapters: {
      codebase: "connected",
      figma: "degraded",
      storybook: "disconnected",
    },
  },
  {
    slug: "nexatech",
    name: "NexaTech",
    status: "in-progress",
    purpose: "design-system",
    qualityScore: 0.71,
    lastSync: "2026-04-22T16:00:00Z",
    tokenCount: 19,
    componentCount: 4,
    driftCount: 12,
    pendingHitl: 8,
    sourceOfTruth: "codebase",
    adapters: {
      codebase: "connected",
      figma: "disconnected",
      storybook: "disconnected",
    },
  },
];

export const mockActivity: ActivityEvent[] = [
  { id: "0a", type: "hypothesis_validated", description: "Hypothesis: hero framing variant — 1,240 sessions, 87% conf", project: "Systemix Landing", ago: "2h ago" },
  { id: "0b", type: "skill_run", description: "Hermes synthesis report generated — 2 experiments, 1 signal", project: "Systemix Landing", ago: "3h ago" },
  { id: "1", type: "hitl_decision", description: "Approved: color.primary.500 — code wins", project: "Finova", ago: "32m ago", actor: "Boyan" },
  { id: "2", type: "contract_built", description: "Contract rebuilt — quality: 94 — 47 tokens", project: "Finova", ago: "34m ago" },
  { id: "3", type: "skill_run", description: "drift-triage — 3 conflicts classified", project: "Verdure", ago: "2h ago" },
  { id: "4", type: "drift_resolved", description: "radius.base resolved — code wins", project: "Verdure", ago: "3h ago", actor: "Boyan" },
  { id: "5", type: "contract_built", description: "Contract rebuilt — quality: 87 — 31 tokens", project: "Verdure", ago: "4h ago" },
  { id: "6", type: "skill_run", description: "systemix-scan — codebase adapter", project: "NexaTech", ago: "1d ago" },
  { id: "7", type: "deploy", description: "Deployed — systemix-alpha.vercel.app", project: "Finova", ago: "1d ago" },
  { id: "8", type: "hitl_decision", description: "Deferred: color.muted — needs design review", project: "NexaTech", ago: "1d ago", actor: "Boyan" },
  { id: "9", type: "skill_run", description: "oklch-migrate — 12 tokens converted", project: "Finova", ago: "2d ago" },
  { id: "10", type: "contract_built", description: "First contract built — quality: 71 — 19 tokens", project: "NexaTech", ago: "2d ago" },
];

export function getProject(slug: string): Project | undefined {
  return mockProjects.find((p) => p.slug === slug);
}
