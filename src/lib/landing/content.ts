// Landing copy registry — the single place to edit the narrative, and the seam
// the hero A/B test reads from (useVariant("landing-hero")). Engine = Claude Code.
//
// Rebrand (landing-rebrand-hifi-2026-07): the LaunchKit arc in plain English —
// announcement → hero → metrics → logos → deep-dives → loop proof → credibility
// → pricing → build-vs-buy → FAQ. Voice: outcome first, mechanism below the fold.
// North star: "Systemix stops your design system from rotting." Copy deck:
// docs/feature/rebrand-hifi/copy-landing.md · SEO: seo-gtm-brief.md

export const GITHUB_URL = "https://github.com/boyantsonev/systemix-poc";
export const AUDIT_COMMAND = "npx systemix audit";
export const INIT_COMMAND = "npx systemix init";
export const BRAND_CLONE_MAILTO =
  "mailto:boyan.works@gmail.com?subject=Brand%20clone%20request";
export const KIT_MAILTO = "mailto:boyan.works@gmail.com?subject=Systemix%20AI%20Kit";
export const CALL_MAILTO = "mailto:boyan.works@gmail.com?subject=Systemix%20scoping%20call";

/** The positioning line — say this before any jargon (SEO brief §1). */
export const POSITIONING = "Systemix keeps your design system from rotting.";

// ── Announcement strip ────────────────────────────────────────────────────────

export const announcement = {
  text: "Open source · Runs on your AI coding tool · Free to start",
  href: GITHUB_URL,
};

// ── Hero (flag: landing-hero — keep control / variant_b) ─────────────────────

export type HeroVariant = {
  h1: string;
  body: string;
};

export const hero = {
  /**
   * A/B seam — experiment `landing-rebrand-hifi-2026-07` ships through the same
   * `landing-hero` flag as its predecessor. No flag configured → everyone gets
   * variant_b (ship-and-compare); control is kept for a future real split.
   */
  variants: {
    control: {
      h1: "Your design system rots. Systemix fixes that.",
      body: "Systemix watches what you ship, catches drift, and proposes fixes your team approves. Your system learns instead of decaying.",
    },
    variant_b: {
      h1: "Your design system, but it learns.",
      body: "Every release, Systemix catches what drifted, proposes the fix, and remembers why — so the system compounds instead of decaying.",
    },
  } satisfies Record<"control" | "variant_b", HeroVariant>,
  fineprint: "Open source · ghost mode by default · your files, your repo",
};

// ── Metrics strip — honest, no vanity ────────────────────────────────────────

export type Metric = { value: string; label: string };

export const metrics = {
  items: [
    { value: "$0/mo", label: "runs on the AI coding tool you already pay for" },
    { value: "Day 1", label: "ghost mode — it suggests, never touches your code" },
    { value: "3 ways in", label: "skills, CLI, or MCP" },
    // 4th stat is dynamic: MetricsStrip derives it from experiments/ + LEARNINGS.md
    // at build time (LiveLoopProof pattern) — honest by construction.
  ] satisfies Metric[],
};

// ── Logo rows ─────────────────────────────────────────────────────────────────

export const logoRows = {
  tools: {
    label: "Works with your AI tool",
    items: ["Claude Code", "Cursor", "Codex"],
  },
  stack: {
    label: "Plugs into your stack",
    items: ["GitHub", "PostHog", "Vercel", "shadcn", "Tailwind", "Figma (optional)"],
  },
};

// ── Feature deep-dives — negative→positive headline + mockup key ─────────────

export type DeepDive = {
  key: string;
  headline: string;
  body: string;
  mockup: "experiment-card" | "learnings-feed" | "doors-code" | "signals-card" | "hitl-card" | "drift-report";
};

export const deepDives: DeepDive[] = [
  {
    key: "loop",
    headline: "Don't let your design system forget why.",
    body: "Every ship is a signal. Systemix spots what drifted, proposes a decision, and — once you approve — records the reason. Solved problems stay solved.",
    mockup: "experiment-card",
  },
  {
    key: "receipts",
    headline: "Decisions with receipts, not vibes.",
    body: "Every approved call is saved with its evidence and a confidence score. Your system remembers what worked and why — cited, not guessed.",
    mockup: "learnings-feed",
  },
  {
    key: "doors",
    headline: "Three doors. Pick yours.",
    body: "Run it as slash-command skills, a CLI, or an MCP connector. Same loop, whichever way your team already works.",
    mockup: "doors-code",
  },
  {
    key: "signals",
    headline: "Measure when you're ready.",
    body: "Wire PostHog and every headline, CTA, and flow becomes evidence. No analytics yet? The loop still runs without it.",
    mockup: "signals-card",
  },
  {
    key: "control",
    headline: "You stay in control.",
    body: "Start in ghost mode — suggest only. Dial up to assisted or autonomous when you trust it. A human always closes the decision.",
    mockup: "hitl-card",
  },
  {
    key: "drift",
    headline: "Catch drift before it ships.",
    body: "Systemix flags where design and code split and shows the diff. Tokens live in code, so there's one source of truth.",
    mockup: "drift-report",
  },
];

// ── The loop (shared with /for/* pages) ──────────────────────────────────────

export const loop = {
  label: "The proof",
  heading: "One loop. Every decision, recorded.",
  body: "Systemix lives inside your design system. Every decision and every experiment is an MDX file in your repo — hypothesis, evidence, decision, confidence — written back when the loop closes.",
  steps: [
    { n: "01", title: "ship" },
    { n: "02", title: "measure" },
    { n: "03", title: "learn" },
    { n: "04", title: "decide" },
  ],
};

// ── Credibility — small-team framing is load-bearing (NOT an agency) ─────────

export const credibility = {
  label: "Who's behind it",
  heading: "Built by a two-person studio that got tired of watching design systems rot.",
  body: "Systemix runs its own site. Every headline you're reading was chosen by the loop, measured, and kept because it won. We ship what we sell.",
  cta: { label: "See the loop running →", href: "/experiments" },
  links: [
    { label: "Book a call →", href: CALL_MAILTO },
    { label: "LinkedIn →", href: "https://www.linkedin.com/in/boyantsonev/" },
  ],
};

// ── Pricing ladder ────────────────────────────────────────────────────────────

export type PricingTier = {
  key: string;
  name: string;
  price: string;
  priceAnchor?: string; // strike-through anchor (e.g. $299 → $249)
  priceNote?: string;
  body: string;
  cta: { label: string; href: string; event: "kit_requested" | "book_a_call" } | { label: string; command: string };
  highlight: boolean;
};

export const pricing = {
  label: "Pick your door",
  heading: "Start free. Pay once when it earns it.",
  anchorLine: "Pay once. Lifetime access. No seats, no meter.",
  tiers: [
    {
      key: "free",
      name: "Start free",
      price: "$0",
      priceNote: INIT_COMMAND,
      body: "The full loop in ghost mode. Your files, your repo.",
      cta: { label: INIT_COMMAND, command: INIT_COMMAND },
      highlight: false,
    },
    {
      key: "kit",
      name: "AI Kit",
      price: "$249",
      priceAnchor: "$299",
      priceNote: "pay once",
      body: "Everything to run the loop for real. Yours to keep, no subscription.",
      cta: { label: "Get the Kit →", href: "/kit", event: "kit_requested" },
      highlight: true,
    },
    {
      key: "loop",
      name: "Scheduled Loop",
      price: "Monthly",
      body: "We run the loop on a schedule so you don't have to remember to.",
      cta: { label: "Book a call →", href: CALL_MAILTO, event: "book_a_call" },
      highlight: false,
    },
    {
      key: "team",
      name: "Team",
      price: "Custom",
      body: "Multiple repos, shared decision history, support.",
      cta: { label: "Book a call →", href: CALL_MAILTO, event: "book_a_call" },
      highlight: false,
    },
  ] satisfies PricingTier[],
};

// ── Build-vs-buy table — the rational close ──────────────────────────────────

export const buildVsBuy = {
  label: "Build vs buy",
  heading: "Build this yourself, or turn it on today.",
  columns: { diy: "Build the loop yourself", time: "Time", kit: "With Systemix" },
  rows: [
    { item: "Experiment scaffolding", time: "~8 hrs" },
    { item: "PostHog wiring", time: "~6 hrs" },
    { item: "Learnings ledger", time: "~12 hrs" },
    { item: "Human-approval rail (HITL)", time: "~16 hrs" },
    { item: "Drift audit", time: "~20 hrs" },
    { item: "Scheduled runner", time: "~6 hrs" },
  ],
  total: { item: "You save", time: "~68+ hrs", kit: "$249 once" },
};

// ── FAQ — permission-granting, short answers ─────────────────────────────────

export type FaqItem = { q: string; a: string };

export const faq = {
  label: "FAQ",
  heading: "The honest answers.",
  items: [
    {
      q: "What exactly do I get?",
      a: "A CLI and framework that runs the ship→signal→decide→record loop on your design system. Free to start; the AI Kit adds the paid pieces.",
    },
    {
      q: "I don't have a design system yet — can I use this?",
      a: "Yes. npx systemix init scaffolds one and starts the loop from day one.",
    },
    {
      q: "Why not just prompt my AI tool from scratch each time?",
      a: "Because it forgets. Systemix keeps the decisions and evidence, so you don't re-solve the same thing every release.",
    },
    {
      q: "Do I own the files?",
      a: "Yes. Everything lives in your repo as plain files. Cancel anytime, keep everything.",
    },
    {
      q: "Which AI tools does it work with?",
      a: "Claude Code, Cursor, Codex — any of the three doors.",
    },
    {
      q: "Does it touch my code without asking?",
      a: "No. It starts in ghost mode (suggest-only). You choose when to give it more.",
    },
    {
      q: "Do I need PostHog?",
      a: "No. Wire it when you want evidence; the loop runs without it.",
    },
    {
      q: "Is it really open source?",
      a: "Yes — the core is on GitHub. Start free, upgrade if it earns it.",
    },
    {
      q: "Can I use it for client work?",
      a: "Yes. Keep the files, hand them off, or run the loop for the client.",
    },
  ] satisfies FaqItem[],
};

// ── Brand clone hook (kept — persona pages share it; brand_clone_request) ────

export const brandClone = {
  label: "Session one",
  heading: "Paste your URL. We clone your brand.",
  body: "In the first working session, Systemix scrapes your live site and generates a globals.css diff that maps your colors, type scale, and radius to design tokens. Your brand, in code, before we've touched a component.",
  note: "Not a form. An email — you get a reply the same day.",
  cta: { label: "Send your URL →", href: BRAND_CLONE_MAILTO },
};

// ── Bottom CTA ────────────────────────────────────────────────────────────────

export const bottomCta = {
  heading: "Stop the rot.",
  body: "One command starts the loop in ghost mode — free, in your repo, nothing touched without your sign-off.",
  fineprint: "Open source · no lock-in · files in your own repo",
};

// ── Nav + footer ─────────────────────────────────────────────────────────────

export const nav = {
  links: [
    { label: "How it works", href: "/#deep-dives" },
    { label: "Kit", href: "/kit" },
    { label: "Audit", href: "/audit" },
    { label: "Docs", href: "/docs" },
  ],
  cta: { label: "Book a call →", href: CALL_MAILTO },
};

export const footer = {
  tagline: POSITIONING,
  links: [
    { label: "GitHub", href: GITHUB_URL },
    { label: "Docs", href: "/docs" },
    { label: "Kit", href: "/kit" },
    { label: "Audit", href: "/audit" },
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
