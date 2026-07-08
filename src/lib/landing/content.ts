// Landing copy registry — the single place to edit the narrative, and the seam
// the hero A/B test reads from (useVariant("landing-hero")). Engine = Claude Code.
//
// Narrative arc: problem → effect → brand clone hook → solution (loop · doors) →
// services → trust → CTA. Copy is deliberately terse; the bento media slots +
// the orbiting loop carry the weight.

export const GITHUB_URL = "https://github.com/boyantsonev/systemix-poc";
export const AUDIT_COMMAND = "npx systemix audit";
export const INIT_COMMAND = "npx systemix init";
export const BRAND_CLONE_MAILTO =
  "mailto:boyan.works@gmail.com?subject=Brand%20clone%20request";

export const ROTATING_PHRASES = [
  "design system memory",
  "decision log",
  "learning loop",
  "evidence trail",
] as const;

const DS_PHRASES = [
  "remembers why",
  "learns your workflow",
  "updates its own skills",
  "runs your experiments",
] as const;

export type HeroVariant = {
  eyebrow: string;
  lead: string;
  phrases: readonly string[];
  body: string;
};

export const hero = {
  /**
   * A/B variants — the seam experiment `landing-ai-native-ds-2026-07` ships
   * through. No `landing-hero` flag exists, so everyone gets variant_b
   * (ship-and-compare); control is the pre-experiment copy, kept for the
   * record and for a future real split. Positioning grafted 2026-07-06:
   * variant_b keeps the anti-slop spine and adds the "+ growth engine /
   * wiring-as-a-service" emphasis.
   */
  variants: {
    control: {
      eyebrow: "For the founder who ships daily with agents",
      lead: "Your",
      phrases: ROTATING_PHRASES,
      body: "You ship a new idea every day with your agents, read the numbers, and move on. A month later you're re-deciding something you already settled — because nothing wrote down why. Systemix is the loop that remembers.",
    },
    variant_b: {
      eyebrow: "The AI-native design system + growth engine · lives in Claude Code",
      lead: "The design system that",
      phrases: DS_PHRASES,
      body: "AI can generate a design system in an afternoon — and by week two it's slop, because nothing wrote down why. Systemix keeps the why in MDX and runs it as a growth engine: every experiment writes its decision back, and skills review and learn weekly from your signals. In Claude Code, in your repo — I wire the signals as a service.",
    },
  } satisfies Record<"control" | "variant_b", HeroVariant>,
  spine: ["ship", "measure", "learn", "decide"],
  brandCloneCta: { label: "Send your site URL →", href: BRAND_CLONE_MAILTO },
  primaryCta: { label: AUDIT_COMMAND, command: AUDIT_COMMAND },
  secondaryCta: { label: "GitHub", href: GITHUB_URL },
  fineprint: "Free forever · runs in Claude Code · your repo, your files",
};

// ── Value props · the two pillars ────────────────────────────────────────────

export const valueProps = {
  label: "What you get",
  heading: "Memory for your design system. A loop that learns weekly.",
  items: [
    {
      title: "Engineered memory",
      body: "Every component and semantic part of your design system is an MDX doc — design rationale, tokens, decisions, drift status. The rationale becomes the center point your team and your agents operate from.",
    },
    {
      title: "Automated reviews + weekly learning",
      body: "Skills review the system and update weekly from a synthesis of your signals — Figma, live site, PostHog experiments, your repo, sprint data, Linear. The system learns while you ship.",
    },
  ],
};

// ── Signals · the wiring wall ────────────────────────────────────────────────

export type Signal = {
  id: string;
  name: string;
  /** Honest wiring status: PostHog ships wired; the rest is the service. */
  status: "wired" | "wire-on-request";
};

export const signals = {
  label: "The signals",
  heading: "One synthesis, many sources.",
  body: "Systemix turns what your tools already know into weekly learning. PostHog is wired out of the box — the rest is exactly what I wire for you.",
  note: "I provide the wiring as a service — book a call, I wire yours.",
  cta: { label: "Book a wiring call →", href: "mailto:boyan.works@gmail.com?subject=Systemix%20wiring%20call" },
  items: [
    { id: "posthog", name: "PostHog experiments", status: "wired" },
    { id: "live-site", name: "Live site", status: "wire-on-request" },
    { id: "figma", name: "Figma", status: "wire-on-request" },
    { id: "repo", name: "Repo activity", status: "wire-on-request" },
    { id: "linear", name: "Linear", status: "wire-on-request" },
    { id: "sprint", name: "Weekly sprint data", status: "wire-on-request" },
  ] satisfies Signal[],
};

// ── Problem ───────────────────────────────────────────────────────────────────

export const gap = {
  label: "The gap",
  heading: "A design system is an afternoon's work now. Keeping it true isn't.",
  body: "Your agents can scaffold components, tokens, and docs in an afternoon. What they can't do is remember why any of it looks the way it does. No rationale, no decisions — by the second sprint it drifts, and you're re-litigating spacing you already settled.",
  stats: [
    { k: "Time to generate a design system", v: "An afternoon, with agents" },
    { k: "Where the why ends up", v: "Nowhere — unless something writes it down" },
  ],
};

// ── Effect ────────────────────────────────────────────────────────────────────

export const effect = {
  label: "What it costs you",
  heading: "That's how a design system turns to slop.",
  items: [
    { title: "Drift by generation", body: "Every new component invents its own spacing, radius, and variants — nothing states the rules or the why, so the agents can't follow them." },
    { title: "Context amnesia", body: "Three weeks later nobody can reconstruct why the button looks this way. The reasoning shipped and evaporated." },
    { title: "Evidence graveyard", body: "PostHog logged how users actually behaved. The design decisions never met the data — they lived in someone's head." },
  ],
};

// ── Solution · the loop ───────────────────────────────────────────────────────

export const loop = {
  label: "How it works",
  heading: "One loop. Every decision, recorded.",
  body: "Systemix lives inside your design system. Every component decision and every experiment is an MDX file in your repo — hypothesis, evidence, decision, confidence — written back when the loop closes. The system learns instead of drifting, and its skills update around how you actually work.",
  steps: [
    { n: "01", title: "ship" },
    { n: "02", title: "measure" },
    { n: "03", title: "learn" },
    { n: "04", title: "decide" },
  ],
};

// ── Two doors · where you start ───────────────────────────────────────────────

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

// ── The rule · it follows your system ─────────────────────────────────────────

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
  heading: "No black box. The files are yours.",
  body: "Open-source, plain MDX in your repo, and dogfooded on this very site. There is no lock-in because there is no platform to lock into.",
  items: [
    { key: "oss", name: "Open source", body: "MIT, on GitHub. Read every line — then fork it.", span: 2, cta: { label: "Star on GitHub", href: GITHUB_URL }, media: "github-stars.png" },
    { key: "engine", name: "No platform dependency", body: "Plain files in your repo. The CLI, MCP, and skills are optional layers on top of MDX you already own.", span: 1, cta: { label: "Read the docs", href: "/docs" } },
    { key: "repo", name: "Your files, your repo", body: "Plain MDX you own. No lock-in, no dashboard.", span: 1, cta: { label: "See the files", href: "/docs" } },
    { key: "dogfood", name: "Runs on itself", body: "This site is a Systemix instance — the loop closes its own experiments. The one you're reading is live.", span: 2, cta: { label: "See the live loop", href: "/experiments" }, media: "loop-demo.gif" },
  ] satisfies TrustItem[],
};

// ── Services / pick your path ─────────────────────────────────────────────────

export type ServiceTier = {
  name: string;
  price: string;
  body: string;
  cta: { label: string; href: string };
  highlight: boolean;
};

export const services = {
  label: "Pick your path",
  heading: "Free kit. Paid build. Design partner.",
  body: "The kit is open-source and runs in Claude Code. Want an AI-native design system built around your team's workflow? That's the sprint — or apply for the design-partner rung.",
  tiers: [
    {
      name: "Free kit",
      price: "Forever free",
      body: "npx systemix init — the loop scaffolded in MDX, in your repo, with the design-system spine optional. Claude Code skills included.",
      cta: { label: "Get the kit", href: GITHUB_URL },
      highlight: false,
    },
    {
      name: "Design system build",
      price: "Book a call",
      body: "A 1-week sprint: Boyan builds your AI-native design system — components with their rationale in MDX, decisions written back by the loop, custom skills tuned to your workflow. Yours when we're done.",
      cta: { label: "Book a scoping call", href: "mailto:boyan.works@gmail.com?subject=Systemix%20design%20system%20sprint" },
      highlight: true,
    },
    {
      name: "Design partner",
      price: "Free · limited seats",
      body: "Free Systemix setup plus workflow mapping across your marketing, engineering, business, and design. One or two partners at a time — you get the system, the loop gets its proving ground.",
      cta: { label: "Apply as a design partner", href: "mailto:boyan.works@gmail.com?subject=Systemix%20design%20partner" },
      highlight: false,
    },
  ] satisfies ServiceTier[],
  note: "Boyan Tsonev · design engineer · the first call is scoping, not selling.",
};

// ── About ─────────────────────────────────────────────────────────────────────

export const about = {
  body: "Built by Boyan Tsonev — a design engineer who kept re-deciding the same things every time the reasoning evaporated. Systemix is the tool I wished existed. Building it in public.",
  links: [
    { label: "Book a call →", href: "mailto:boyan.works@gmail.com?subject=Systemix%20scoping%20call" },
    { label: "LinkedIn →", href: "https://www.linkedin.com/in/boyantsonev/" },
  ],
};

// ── CTA ───────────────────────────────────────────────────────────────────────

export const bottomCta = {
  heading: "Your design system deserves a memory.",
  body: "Start with the free kit in minutes — or send your URL and I'll clone your brand identity in session one.",
  fineprint: "Free forever · open-source · no lock-in · files in your own repo",
};

export const brandClone = {
  label: "Session one",
  heading: "Paste your URL. We clone your brand.",
  body: "In the first working session, Systemix scrapes your live site and generates a globals.css diff that maps your colors, type scale, and radius to design tokens. Your brand, in code, before we've touched a component.",
  note: "Not a form. An email — Boyan replies the same day.",
  cta: { label: "Send your URL →", href: BRAND_CLONE_MAILTO },
};

export const nav = {
  links: [
    { label: "How it works", href: "/#loop" },
    { label: "Sprint", href: "/#services" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "Book a call →", href: "mailto:boyan.works@gmail.com?subject=Systemix%20scoping%20call" },
};

export const footer = {
  tagline: "A design system that remembers why.",
  links: [
    { label: "GitHub", href: GITHUB_URL },
    { label: "Docs", href: "/docs" },
    { label: "Sprint", href: "/#services" },
  ],
  personaLinks: [
    { label: "For business", href: "/for/business" },
    { label: "For engineers", href: "/for/engineers" },
    { label: "For designers", href: "/for/designers" },
    { label: "For marketers", href: "/for/marketers" },
    { label: "For AI agents", href: "/for/agents" },
  ],
  badge: "Open source",
};
