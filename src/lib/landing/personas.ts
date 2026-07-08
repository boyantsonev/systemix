// Persona registry — one entry per ICP around a design system. Founders fill
// all of these roles; each /for/<persona> page answers "how does this help me
// and how do I use it" in that role's language. Copy is capped at ~15 strings
// per persona: hero + 3 JTBD cards + one proof blurb. Everything else renders
// from the shared registry in content.ts.

import { BRAND_CLONE_MAILTO, GITHUB_URL, INIT_COMMAND } from "./content";

export const PERSONAS = ["business", "engineers", "designers", "marketers", "agents"] as const;
export type PersonaKey = (typeof PERSONAS)[number];

/** Shared landing sections a persona page can compose, in render order. */
export type SectionKey = "loop" | "doors" | "trust" | "services" | "brandClone";

export type PersonaContent = {
  key: PersonaKey;
  label: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryCta: { label: string; href: string };
  };
  jtbd: {
    heading: string;
    items: { title: string; body: string }[];
  };
  proof: {
    kind: "drift" | "experiments" | "mcp" | "outcomes" | "contract";
    heading: string;
    body: string;
  };
  sharedSections: SectionKey[];
  guideHref: string;
};

const BOOK_A_CALL = "mailto:boyan.works@gmail.com?subject=Systemix%20scoping%20call";

export const personaContent: Record<PersonaKey, PersonaContent> = {
  business: {
    key: "business",
    label: "Business",
    navLabel: "For business",
    metaTitle: "Systemix for business — know why you kept or killed every bet",
    metaDescription:
      "The AI-native design system + growth engine for pre-PMF founders. Every product decision recorded with evidence, every week a synthesis of what your signals learned.",
    hero: {
      eyebrow: "For the pre-PMF founder",
      heading: "Know why you kept or killed every bet.",
      body: "Your design system and your growth experiments finally share one memory. Every decision is written down with evidence and confidence, so the next sprint starts from what the last one proved — not from scratch.",
      primaryCta: { label: "Book a scoping call →", href: BOOK_A_CALL },
    },
    jtbd: {
      heading: "How this helps you",
      items: [
        {
          title: "Decisions with receipts",
          body: "Every experiment closes with a recorded decision — promote, kill, or iterate — cited to the evidence that earned it. No more re-litigating settled calls.",
        },
        {
          title: "Weekly learning, not weekly amnesia",
          body: "A scheduled run synthesizes your signals into learnings each week. The system gets smarter while you ship; you read one brief instead of five dashboards.",
        },
        {
          title: "One system, every role",
          body: "Design, engineering, marketing, and your AI agents operate from the same living design system — so the founder wearing all the hats stops paying the context-switch tax.",
        },
      ],
    },
    proof: {
      kind: "outcomes",
      heading: "Wired to your stack in a week",
      body: "The kit is free and open-source. The sprint is me wiring the automation to your signals — brand cloned in session one, experiments live by end of week, the whole setup yours when we're done.",
    },
    sharedSections: ["loop", "trust", "services"],
    guideHref: "/docs/guides/business",
  },

  engineers: {
    key: "engineers",
    label: "Engineers",
    navLabel: "For engineers",
    metaTitle: "Systemix for engineers — a design system that documents itself in MDX",
    metaDescription:
      "Plain MDX in your repo: components, tokens, decisions, drift. Code-first tokens, a CLI, an MCP server, and Claude Code skills — no platform, no lock-in.",
    hero: {
      eyebrow: "For engineers",
      heading: "A design system that documents itself — in MDX, in your repo.",
      body: "Every component and semantic part of the system is an MDX contract: rationale, tokens, states, drift status. Tokens are canonical in CSS. The whole thing is files you own — driven from your terminal, your agent, or a slash command.",
      primaryCta: { label: INIT_COMMAND, href: GITHUB_URL },
    },
    jtbd: {
      heading: "How this helps you",
      items: [
        {
          title: "Docs that can't rot",
          body: "The contract lives next to the code and the automation writes decisions back into it. Documentation stops being a separate artifact you forget to update.",
        },
        {
          title: "Drift caught before review",
          body: "Hardcoded colors, off-scale spacing, tokens diverging from the contract — the drift report finds them and the history is kept, so you see the trend, not just today's mess.",
        },
        {
          title: "Three doors, same automation",
          body: "CLI for CI and your terminal, MCP for any agent, Claude Code skills for human-in-the-loop. Same files underneath — pick per task, not per religion.",
        },
      ],
    },
    proof: {
      kind: "contract",
      heading: "The contract is just a file",
      body: "A component's documentation, rationale, and drift status in one MDX record — parseable by your tools, reviewable in your PRs.",
    },
    sharedSections: ["doors", "loop", "trust"],
    guideHref: "/docs/guides/engineers",
  },

  designers: {
    key: "designers",
    label: "Designers",
    navLabel: "For designers",
    metaTitle: "Systemix for designers — your design rationale, remembered and enforced",
    metaDescription:
      "Design rationale as the center of the workflow: tokens tracked code-first, drift surfaced automatically, decisions recorded — with an optional Figma bridge.",
    hero: {
      eyebrow: "For designers",
      heading: "Your design rationale, remembered and enforced.",
      body: "The reasoning behind every token and component is written into the system itself — and when the shipped product drifts from it, the drift surfaces as a feed, not as a surprise in next quarter's audit.",
      primaryCta: { label: "Send your site URL →", href: BRAND_CLONE_MAILTO },
    },
    jtbd: {
      heading: "How this helps you",
      items: [
        {
          title: "Rationale that survives handoff",
          body: "Why the radius is 0.5rem, why the primary is that oklch — recorded where engineers and agents actually read it, not in a Figma comment that dies.",
        },
        {
          title: "Drift surfaces itself",
          body: "A weekly report scores how far the live product has drifted from the system — top offenders named, history kept, decisions queued for you to approve.",
        },
        {
          title: "Figma when you want it",
          body: "Tokens are canonical in code, so the system works without design tooling — and a Figma bridge syncs Variables both ways when you're ready.",
        },
      ],
    },
    proof: {
      kind: "drift",
      heading: "The drift feed",
      body: "Every audit lands in the system's memory: a score, the top offenders, and the trend over time. This is the live status of this very site.",
    },
    sharedSections: ["brandClone", "loop", "trust"],
    guideHref: "/docs/guides/designers",
  },

  marketers: {
    key: "marketers",
    label: "Marketers",
    navLabel: "For marketers",
    metaTitle: "Systemix for marketers — every experiment earns a learning",
    metaDescription:
      "Growth experiments as files: hypothesis, PostHog evidence, decision, confidence. A ledger of what actually converts, written back into the system weekly.",
    hero: {
      eyebrow: "For marketers",
      heading: "Every experiment earns a learning.",
      body: "Each landing variant, CTA test, and funnel bet is a file: hypothesis, live PostHog evidence, and the decision it earned. The learnings ledger remembers what converted — so you never rerun a dead test.",
      primaryCta: { label: "Book a scoping call →", href: BOOK_A_CALL },
    },
    jtbd: {
      heading: "How this helps you",
      items: [
        {
          title: "Experiments as files",
          body: "No dashboard sprawl — a running experiment is one readable page: the bet, the variants, the metric, the current evidence.",
        },
        {
          title: "Evidence pulled for you",
          body: "A daily runner pulls PostHog numbers, evaluates them against thresholds, and queues a close proposal when a call is ready. You decide; it never closes alone.",
        },
        {
          title: "A ledger of what converts",
          body: "Closed experiments append to a learnings ledger with confidence and citations — your growth memory, in the repo, next to the design system it grew.",
        },
      ],
    },
    proof: {
      kind: "experiments",
      heading: "A live experiment, running on this page",
      body: "This landing page is itself under experiment — here is the real, current state of that bet.",
    },
    sharedSections: ["loop", "services", "trust"],
    guideHref: "/docs/guides/marketers",
  },

  agents: {
    key: "agents",
    label: "AI agents",
    navLabel: "For AI agents",
    metaTitle: "Systemix for AI agents — a design system agents can read, write, and learn from",
    metaDescription:
      "An MCP server over plain MDX files: experiment tools, contract tools, HITL guardrails. The design system as a machine-readable contract for your agent stack.",
    hero: {
      eyebrow: "For AI agents (and the humans who run them)",
      heading: "A design system your agents can read, write, and learn from.",
      body: "The contract is plain MDX; the MCP server exposes it as tools. Agents query components and tokens, open and measure experiments, and write evidence back — with human-in-the-loop guardrails on every decision that matters.",
      primaryCta: { label: INIT_COMMAND, href: GITHUB_URL },
    },
    jtbd: {
      heading: "How this helps your stack",
      items: [
        {
          title: "MCP-native",
          body: "experiment_*, contract_*, and HITL tools over the same files humans edit. Any MCP-capable agent drives the full automation — no bespoke integration.",
        },
        {
          title: "Plain files, no platform",
          body: "State is MDX and JSON in the repo. Agents that can read files can read the design system; nothing hides behind a proprietary API.",
        },
        {
          title: "Guardrails built in",
          body: "Autonomy is a dial — ghost, assisted, autonomous — and self-modification is always human-approved. Agents propose; humans close.",
        },
      ],
    },
    proof: {
      kind: "mcp",
      heading: "The tool surface",
      body: "What an agent sees when it connects. Flip the switch to read this page the way a machine does.",
    },
    sharedSections: ["doors", "trust"],
    guideHref: "/docs/guides/agents",
  },
};

/** Curated MCP tool names shown on the agents page (from packages/mcp-server). */
export const MCP_TOOL_NAMES = [
  "experiment_new",
  "experiment_list",
  "experiment_get",
  "experiment_measure",
  "experiment_close",
  "experiment_learnings",
  "contract_get_token",
  "contract_get_component",
  "contract_get_evidence",
  "contract_list_drifted",
  "contract_write_evidence",
  "get_workflow",
  "list_hitl_tasks",
  "push_hitl_task",
  "resolve_hitl_task",
  "emit_event",
] as const;
