// Landing copy registry — the single place to edit the narrative, and the seam
// the hero A/B test reads from (useVariant("landing-hero")). Engine = Claude Code.
//
// Rebrand (landing-rebrand-hifi-2026-07), revision 2: LaunchKit soft-grid arc —
// announcement → hero row (copy | facts | tools) → stack strip → statement →
// deep-dives → audiences → proof → credibility → pricing → build-vs-buy → FAQ.
// Voice: outcome first, mechanism below the fold. "The loop" is BANNED in
// marketing copy — say "the automation", "an AI-native design system that
// learns from your signals", "the agentic feed / context layer". Product
// surfaces keep the concrete nouns (experiments, learnings, decisions).
// Copy decks: docs/feature/rebrand-hifi/ · SEO: seo-gtm-brief.md

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
      body: "An AI-native design system that learns from the signals it gets: every release it catches what drifted, proposes the fix, and remembers why.",
    },
  } satisfies Record<"control" | "variant_b", HeroVariant>,
  fineprint: "Open source · ghost mode by default · your files, your repo",
};

// ── Hero facts — the "what you get" table cell (LaunchKit pattern) ───────────

export type HeroFact = { label: string; value: string };

export const heroFacts = {
  label: "What you get",
  items: [
    { label: "Monthly fee", value: "$0" },
    { label: "Runs on", value: "your AI coding tool" },
    { label: "Touches your code", value: "never uninvited" },
    { label: "Ways in", value: "skills · CLI · MCP" },
    // + a dynamic row derived at build time from experiments/ + LEARNINGS.md
  ] satisfies HeroFact[],
};

// ── Logo rows ─────────────────────────────────────────────────────────────────

export const logoRows = {
  tools: {
    label: "Use it with your AI coding tool",
    items: ["Claude Code", "Cursor", "Codex"],
  },
  stack: {
    label: "Plugs into your stack",
    items: ["GitHub", "PostHog", "Vercel", "shadcn", "Tailwind", "Figma (optional)"],
  },
};

// ── Statement block — the two-tone problem/resolution (LaunchKit pattern) ────

export const statement = {
  strong: "AI can generate a design system in an afternoon. Keeping it true is the hard part.",
  dim: "Nothing writes down why decisions were made — so by week two it drifts, and by week six it's slop. Systemix is the automation that keeps the system learning from what you ship.",
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
    key: "autopilot",
    headline: "Your design system, on autopilot.",
    body: "Every ship is a signal. Systemix watches what changed, proposes the decision, and — once you approve — records the reason. Solved problems stay solved.",
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
    body: "Run it as slash-command skills, a CLI, or an MCP connector. The same automation, whichever way your team already works.",
    mockup: "doors-code",
  },
  {
    key: "signals",
    headline: "Measure when you're ready.",
    body: "Wire PostHog and every headline, CTA, and flow becomes evidence. No analytics yet? The automation runs without it.",
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

// ── Audiences — the design system as an architecture ─────────────────────────

export const audiences = {
  label: "The architecture",
  heading: "One context engine, every audience.",
  body: "Your design system stops being a component library and becomes a context engine — the agentic feed of decisions, tokens, and evidence that every persona, and every agent, reads from the same source. Design systems always connected these roles; this one is AI-native.",
  items: [
    { name: "Engineers", href: "/for/engineers", line: "tokens and guardrails, canonical in code" },
    { name: "Designers", href: "/for/designers", line: "rationale that survives every handoff" },
    { name: "Marketing", href: "/for/marketers", line: "headlines and flows become evidence" },
    { name: "Business", href: "/for/business", line: "decisions with receipts, not meetings" },
    { name: "AI agents", href: "/for/agents", line: "the context layer your agents read first" },
  ],
  note: "Even clients read it — the system explains its own choices.",
};

// ── Proof — running on itself (shared with /for/* pages) ─────────────────────

export const proof = {
  label: "The proof",
  heading: "Running on itself.",
  body: "This site is a Systemix instance. The agentic feed below is live — every experiment, decision, and learning is a file in this repo, written by the automation and approved by a human.",
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
  body: "Systemix runs its own site. Every headline you're reading was proposed by the automation, measured, and kept because it won. We ship what we sell.",
  cta: { label: "See it running →", href: "/experiments" },
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
  priceAnchor?: string; // strike-through anchor (e.g. €299 → €99)
  priceNote?: string;
  body: string;
  cta: { label: string; href: string; event: "kit_requested" | "audit_requested" | "book_a_call" } | { label: string; command: string };
  highlight: boolean;
};

export const pricing = {
  label: "Pick your tier",
  heading: "Start free. Pay when it earns it.",
  anchorLine: "Own the files. No seats, no meter.",
  tiers: [
    {
      key: "free",
      name: "Free",
      price: "€0",
      priceNote: INIT_COMMAND,
      body: "Every skill, in ghost mode. Your files, your repo — no account.",
      cta: { label: INIT_COMMAND, command: INIT_COMMAND },
      highlight: false,
    },
    {
      key: "kit",
      name: "Full Kit",
      price: "€99",
      priceNote: "download · pay once",
      body: "The complete AI-native design-system kit — engine, docs, app setup, skills, workflows. Downloadable, yours to keep.",
      cta: { label: "Get the Kit →", href: "/kit", event: "kit_requested" },
      highlight: true,
    },
    {
      key: "audit",
      name: "Readiness Audit",
      price: "€249",
      priceNote: "emailed in 24–48h",
      body: "An automated, me-in-the-loop AI-native readiness audit — scored 0–100, with the exact setup to fix it. Delivered to your inbox.",
      cta: { label: "Request the audit →", href: "/audit", event: "audit_requested" },
      highlight: false,
    },
    {
      key: "sprint",
      name: "Consultancy",
      price: "Custom",
      priceNote: "2-week sprint",
      body: "A discovery + implementation sprint — we wire your AI-native design system to your stack, with you.",
      cta: { label: "Book a call →", href: CALL_MAILTO, event: "book_a_call" },
      highlight: false,
    },
  ] satisfies PricingTier[],
};

// ── Per-persona value — what each role actually gets (expandable rows) ────────
// Replaces the old build-hours table: value by role, not internal mechanism.

export type PersonaValueRow = { role: string; gets: string; detail: string };

export const personaValue = {
  label: "One kit, every audience",
  heading: "What each role gets.",
  hint: "Tap a row for what it means in practice.",
  columns: { role: "Role", gets: "What you get" },
  rows: [
    {
      role: "Engineers",
      gets: "tokens + drift, canonical in code",
      detail: "A design system that documents itself in MDX next to the code, with drift caught before review. Three doors — CLI, MCP, Claude Code skills — over one set of files you own.",
    },
    {
      role: "Designers",
      gets: "rationale that survives handoff",
      detail: "The why behind every token and component, recorded where engineers and agents read it. Drift surfaces itself as a feed instead of ambushing next quarter's audit; Figma bridges when you want it.",
    },
    {
      role: "Marketers",
      gets: "headlines + flows become evidence",
      detail: "Every variant, CTA test, and funnel bet is one readable page: hypothesis, live PostHog evidence, decision. A ledger remembers what converted, so you never rerun a dead test.",
    },
    {
      role: "Business",
      gets: "decisions with receipts",
      detail: "Every bet closes with a recorded call — promote, iterate, kill — cited to the evidence that earned it. One weekly synthesis instead of five dashboards; the next sprint starts from what the last one proved.",
    },
    {
      role: "AI agents",
      gets: "the context layer, machine-readable",
      detail: "The whole system exposed over MCP as plain files: read tokens, contracts, drift, and learnings; open and measure experiments; write evidence back — with human-in-the-loop guardrails on every decision that matters.",
    },
  ] satisfies PersonaValueRow[],
};

// ── FAQ — permission-granting, short answers ─────────────────────────────────

export type FaqItem = { q: string; a: string };

export const faq = {
  label: "FAQ",
  heading: "The honest answers.",
  items: [
    {
      q: "What exactly do I get?",
      a: "The context engine for your design system: it watches what you ship, proposes decisions, and records the reasons. Every skill is free; the €99 Kit is the whole thing packaged to download and own.",
    },
    {
      q: "I don't have a design system yet — can I use this?",
      a: "Yes. npx systemix init scaffolds one and starts the automation from day one.",
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
      a: "No. Wire it when you want evidence; the automation runs without it.",
    },
    {
      q: "Is it really open source?",
      a: "Yes — the core is on GitHub. Start free, upgrade if it earns it.",
    },
    {
      q: "Can I use it for client work?",
      a: "Yes. Keep the files, hand them off, or run the automation for the client.",
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
  body: "One command starts the automation in ghost mode — free, in your repo, nothing touched without your sign-off.",
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
