// Landing copy registry — the single place to edit the narrative, and the seam
// the hero A/B test reads from (useVariant("landing-hero")). Engine = Claude Code.
//
// Narrative arc: problem → effect → brand clone hook → solution (loop · doors) →
// services → trust → CTA. Copy is deliberately terse; the bento media slots +
// the orbiting loop carry the weight.

export const GITHUB_URL = "https://github.com/boyantsonev/systemix-poc";
export const INIT_COMMAND = "npx systemix init";
export const BRAND_CLONE_MAILTO =
  "mailto:boyan.works@gmail.com?subject=Brand%20clone%20request";

export const ROTATING_PHRASES = [
  "shipping memory",
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
   * record and for a future real split.
   */
  variants: {
    control: {
      eyebrow: "For the founder who ships daily with agents",
      lead: "Your",
      phrases: ROTATING_PHRASES,
      body: "You ship a new idea every day with your agents, read the numbers, and move on. A month later you're re-deciding something you already settled — because nothing wrote down why. Systemix is the loop that remembers.",
    },
    variant_b: {
      eyebrow: "The AI-native design system · lives in Claude Code",
      lead: "The design system that",
      phrases: DS_PHRASES,
      body: "AI can generate a design system in an afternoon — and by week two it's slop, because nothing wrote down why. Systemix keeps the why: every component carries its rationale in MDX, every experiment writes its decision back, and its skills update around your workflow. In Claude Code, in your repo.",
    },
  } satisfies Record<"control" | "variant_b", HeroVariant>,
  spine: ["ship", "measure", "learn", "decide"],
  brandCloneCta: { label: "Send your site URL →", href: BRAND_CLONE_MAILTO },
  primaryCta: { label: INIT_COMMAND, command: INIT_COMMAND },
  secondaryCta: { label: "GitHub", href: GITHUB_URL },
  fineprint: "Free forever · runs in Claude Code · your repo, your files",
};

// ── Problem ───────────────────────────────────────────────────────────────────

export const gap = {
  label: "The gap",
  heading: "You're shipping faster than you can remember.",
  body: "Every idea you ship with your agents adds to the pile. The numbers land in PostHog. The decision — why you kept it, why you killed it — never gets written down. A month later you're testing it again.",
  stats: [
    { k: "Time to ship an idea", v: "An afternoon, with agents" },
    { k: "Time that decision resurfaces", v: "Never — unless you remember" },
  ],
};

// ── Effect ────────────────────────────────────────────────────────────────────

export const effect = {
  label: "What it costs you",
  heading: "Every ship lands in a void.",
  items: [
    { title: "Déjà-ship", body: "You test something you already tested — nothing flagged it, because nothing recorded the call you made last time." },
    { title: "Context amnesia", body: "Three weeks later you can't reconstruct why the page looks this way. The reasoning shipped and evaporated." },
    { title: "Evidence graveyard", body: "PostHog logged every event. The decision that followed? Nowhere — not in the repo, not in your head. Gone." },
  ],
};

// ── Solution · the loop ───────────────────────────────────────────────────────

export const loop = {
  label: "How it works",
  heading: "One loop. Every decision, recorded.",
  body: "Systemix sits in your shipping stack. Each experiment is a file in your repo — hypothesis, evidence, decision, confidence — written back when you close the loop, so the next idea starts from what the last one proved.",
  steps: [
    { n: "01", title: "ship" },
    { n: "02", title: "measure" },
    { n: "03", title: "learn" },
    { n: "04", title: "decide" },
  ],
};

// ── Solution · three interfaces ───────────────────────────────────────────────

export const doors = {
  label: "How you drive it",
  heading: "Terminal, agent, or slash command — your call.",
  body: "Three ways to drive the same loop. Pick the one that fits how you ship.",
  cta: { label: "Read the docs", href: "/docs" },
  items: [
    { key: "cli", name: "CLI", code: "systemix experiment new", body: "Scriptable in CI and your terminal.", media: "cli-demo.gif" },
    { key: "mcp", name: "MCP", code: "experiment_new · close", body: "Any agent or AI tool can call it.", media: "mcp-demo.mp4" },
    { key: "skills", name: "Claude Code skills", code: "/init-experiment", body: "Slash commands, human-in-the-loop.", media: "skills-demo.gif" },
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
  heading: "Your decisions deserve a record.",
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
    { label: "How it works", href: "#loop" },
    { label: "Sprint", href: "#services" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "Book a call →", href: "mailto:boyan.works@gmail.com?subject=Systemix%20scoping%20call" },
};

export const footer = {
  tagline: "Decisions deserve a record.",
  links: [
    { label: "GitHub", href: GITHUB_URL },
    { label: "Docs", href: "/docs" },
    { label: "Sprint", href: "#services" },
  ],
  badge: "Open source",
};
