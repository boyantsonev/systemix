// TASK 1 — BAST-158: Skill execution map
// Maps skill slugs to CLI-runnable commands.
// Only skills with real scripts/commands are listed here.
// Skills requiring MCP (figma, component, storybook, etc.) are excluded.

export interface SkillDef {
  label: string;
  command: string;      // shell command to run
  args?: string[];
  description: string;
  env?: Record<string, string>;
}

export const SKILL_MAP: Record<string, SkillDef> = {
  "tokens": {
    label: "Sync Tokens",
    command: "npm",
    args: ["run", "tokens"],
    description: "Regenerate tokens.bridge.json from globals.css",
  },
  // sync-to-figma was removed: its script never existed and Figma is an
  // optional/deferred adapter under code-first v5 — a play button that always
  // fails is worse than no button.
  "drift-report": {
    label: "Drift Report",
    command: "npx",
    args: ["tsx", "scripts/drift-report.ts"],
    description: "Scan src/ for raw hex + off-token styles — appends a drift snapshot",
  },
  "deploy": {
    label: "Build & Deploy",
    command: "vercel",
    args: ["--prod", "--yes"],
    description: "Build and deploy to Vercel production",
  },
  "build": {
    label: "Build",
    command: "npm",
    args: ["run", "build"],
    description: "Next.js production build",
  },
  // node + repo-relative path (not npx) so the spawn from /api/run resolves the
  // workspace bin deterministically.
  "loop": {
    label: "Run the Loop",
    command: "node",
    args: ["packages/cli/bin/cli.js", "loop"],
    description: "Sweep running experiments — evidence → evaluate → queue close-proposal",
  },
};

export function getSkill(slug: string): SkillDef | null {
  return SKILL_MAP[slug] ?? null;
}

export function listSkills(): { slug: string; def: SkillDef }[] {
  return Object.entries(SKILL_MAP).map(([slug, def]) => ({ slug, def }));
}
