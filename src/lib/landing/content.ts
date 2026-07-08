// Landing copy registry — the single place to edit the narrative, and the seam
// the hero A/B test reads from (useVariant("landing-hero")). Engine = Claude Code.
//
// Narrative arc: problem (the mess) → effect (what it costs) → two doors (audit ·
// interview) → the rule (it follows your system, asks before breaking it) → trust
// → where it grows (the loop, demoted) → CTA → done-with-you (services).
//
// The magnet: point Systemix at a messy repo, run one audit, get a report + the
// seed of the fix. That's the shareable entry point.

export const GITHUB_URL = "https://github.com/boyantsonev/systemix-poc";
export const AUDIT_COMMAND = "npx systemix audit";
export const INIT_COMMAND = "npx systemix init";

/**
 * The rotating phrase in the hero — completes "Fix your design system, ⟨phrase⟩".
 * Terminal slot = no mid-line reflow.
 */
export const ROTATING_PHRASES = [
  "in your repo.",
  "in code.",
  "with your agent.",
  "for good.",
] as const;

export type HeroVariant = {
  eyebrow: string;
  body: string;
};

export const hero = {
  lead: "Fix your design system,",
  phrases: ROTATING_PHRASES,
  /** A/B variants keyed to useVariant("landing-hero", "variant_b"); default = variant_b (the new hero). */
  variants: {
    control: {
      eyebrow: "For teams building with agents",
      body: "Your agent ships screens fast — and every one is a little different. Systemix reads your code, finds the drift and the duplicate components, and hands your agent the rules to follow. Fix the mess you have, or build the system from scratch.",
    },
    variant_b: {
      eyebrow: "Open-source · runs in Claude Code",
      body: "Your agent ships screens fast — and every one is a little different. Colours drift, components duplicate, the interface goes to slop. Systemix audits your code, gives you your design system back, and makes your agent follow it. Already a mess, or starting fresh.",
    },
  } satisfies Record<"control" | "variant_b", HeroVariant>,
  spine: ["define", "audit", "enforce", "keep true"],
  primaryCta: { label: AUDIT_COMMAND, command: AUDIT_COMMAND },
  secondaryCta: { label: "GitHub", href: GITHUB_URL },
  /** The system⇄mix wordplay, kept as a quiet kicker. */
  tagline: "system × mix — one system, every screen",
};

// ── Problem ───────────────────────────────────────────────────────────────────

export const gap = {
  label: "The problem",
  heading: "Your agent ships fast. Your design system can't keep up.",
  body: "A variant a day, a new screen an hour — and no two look quite the same. The rules live in your head; the code drifts everywhere else.",
  stats: [
    { k: "Ship cadence", v: "Hourly" },
    { k: "Design system", v: "In your head — if anywhere" },
  ],
};

// ── Effect ────────────────────────────────────────────────────────────────────

export const effect = {
  label: "What it costs you",
  heading: "So the interface turns to slop.",
  items: [
    { title: "Colours drift", body: "Raw hex and one-off values scatter across the code. No single palette anyone can point to." },
    { title: "Components duplicate", body: "Three Buttons, two Cards, a Modal rebuilt inline. Every screen reinvents the primitives." },
    { title: "Rules stay unwritten", body: "The system lives in your head, so the agent can't follow it — and neither can the next person." },
  ],
};

// ── Two doors ─────────────────────────────────────────────────────────────────

export type Door = {
  key: string;
  name: string;
  code: string;
  body: string;
  status: string;
  span: 1 | 2;
  media?: string;
};

export const doors = {
  label: "Two doors, one system",
  heading: "Already a mess, or starting fresh.",
  body: "Both roads land in the same place: a design system in your repo — plain MDX and CSS you own — that your agent reads and defends.",
  cta: { label: "Read the docs", href: "/docs" },
  items: [
    {
      key: "audit",
      name: "Already a mess → audit it",
      code: "npx systemix audit",
      body: "Zero setup, read-only. Systemix infers your de-facto tokens and components, flags the drift and the duplicates, and hands you a design-system starter to sign off on.",
      status: "Live",
      span: 2,
      media: "audit-report.png",
    },
    {
      key: "interview",
      name: "Starting fresh → get interviewed",
      code: "npx systemix design init",
      body: "A few questions — your product, your people, the associations behind your palette — and Systemix drafts the system from scratch, in your voice.",
      status: "Live",
      span: 1,
    },
  ] satisfies Door[],
};

// ── The rule (founder pain #5) ────────────────────────────────────────────────

export const rule = {
  label: "The point",
  heading: "It doesn't just diagnose. It follows the rule.",
  body: "The audit hands you guardrails; your agent reads them on every change. When something new comes up, it asks first — and tells you why.",
  items: [
    { title: "Installs the rule", body: "Your colours, spacing, type and components become guardrails in your repo — a system, not a memory." },
    { title: "Follows it by default", body: "Every change your agent makes is checked against the guardrails before it lands. No raw hex, no rogue component." },
    { title: "Asks before breaking it", body: "New pattern? It proposes the change with the rationale and waits for you. Nothing self-modifies silently." },
  ],
};

// ── Trust ─────────────────────────────────────────────────────────────────────

export type TrustItem = {
  key: string;
  name: string;
  body: string;
  span: 1 | 2;
  cta: { label: string; href: string };
  media?: string;
};

export const trust = {
  label: "Built in the open",
  heading: "No black box. It runs on itself.",
  body: "Open-source, runs in Claude Code, and dogfooded right here — this site is a Systemix instance.",
  items: [
    { key: "oss", name: "Open source", body: "MIT, on GitHub. Read every line — then fork it.", span: 2, cta: { label: "Star on GitHub", href: GITHUB_URL }, media: "github-stars.png" },
    { key: "engine", name: "Runs in Claude Code", body: "The engine is Claude Code. No extra service to run.", span: 1, cta: { label: "Why Claude Code", href: "/docs" } },
    { key: "repo", name: "Your files, your repo", body: "Plain MDX and CSS you own. No lock-in, no dashboard.", span: 1, cta: { label: "See the files", href: "/docs" } },
    { key: "dogfood", name: "Runs on itself", body: "This site's own design system is audited and enforced by Systemix.", span: 2, cta: { label: "How it grows", href: "#loop" }, media: "loop-demo.gif" },
  ] satisfies TrustItem[],
};

// ── Where it grows · the loop (demoted) ───────────────────────────────────────

export const loop = {
  label: "Where it grows",
  heading: "Once your system holds, it starts to learn.",
  body: "A defined design system is the floor, not the ceiling. From here Systemix closes the loop — ship, measure, learn, decide — so the system earns its next change from evidence, not opinion.",
  cta: { label: "See the loop", href: "/docs" },
  steps: [
    { n: "01", title: "ship" },
    { n: "02", title: "measure" },
    { n: "03", title: "learn" },
    { n: "04", title: "decide" },
  ],
};

// ── Secondary trust + CTA · services ──────────────────────────────────────────

export const services = {
  label: "Done with you",
  heading: "Want it fixed this week?",
  body: "The kit is free forever. If you'd rather not do it solo, I'll run a focused sprint on your design system — audit, tokens, guardrails, and the agent rules to hold the line.",
  sprints: [
    { name: "Design-system audit", body: "Your drift and duplicate components mapped, tokens and guardrails defined." },
    { name: "Design system, from scratch", body: "The interview, then a code-first system in your repo — in your voice." },
    { name: "Design engineer", body: "Figma ↔ code reconciled, components consolidated, the slop cleaned up." },
    { name: "Landing / funnel", body: "A consistent, measured landing and the experiments that move signup." },
  ],
  cta: { label: "Book a 30-min scoping call", href: "mailto:boyan.works@gmail.com?subject=Systemix%20scoping%20call" },
  note: "Secondary to the free kit. The first call is scoping, not selling.",
};

// ── CTA ───────────────────────────────────────────────────────────────────────

export const bottomCta = {
  heading: "Run the audit. It's free.",
  body: "One command, read-only, no setup. Get your design-system report and the seed of the fix.",
  fineprint: "Open-source · runs in Claude Code · your files, your repo",
};

export const nav = {
  links: [
    { label: "How it works", href: "#doors" },
    { label: "Services", href: "#services" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "GitHub →", href: GITHUB_URL },
};

export const footer = {
  tagline: "Fix your design system — in your repo, with your agent.",
  links: [
    { label: "GitHub", href: GITHUB_URL },
    { label: "Docs", href: "/docs" },
    { label: "Services", href: "#services" },
  ],
  badge: "Open source",
};
