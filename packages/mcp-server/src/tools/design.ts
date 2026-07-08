/**
 * design.ts — design_get / design_list_proposals
 *
 * Makes the design-system-as-object and the HITL feed digestible by any agent
 * over MCP (the CLI exposes the same via `systemix design`).
 *
 *   design_get()             → DESIGN.md brief + guardrail rules + tokens + health
 *   design_list_proposals()  → pending design proposals from the HITL feed
 *
 * File-first: reads design/ and .systemix/queue.json. No external service.
 */

import * as fs from "fs";
import * as path from "path";
import type { ToolDefinition, ToolHandler } from "../types.js";

const DESIGN_DIR = "design";
const QUEUE_FILE = ".systemix/queue.json";

// ---------------------------------------------------------------------------
// Readers
// ---------------------------------------------------------------------------

/** Parse `--name: value;` custom properties from the :root block of tokens.css. */
function readTokens(cssPath: string): { name: string; value: string }[] {
  if (!fs.existsSync(cssPath)) return [];
  const css = fs.readFileSync(cssPath, "utf8");
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  const block = rootMatch ? rootMatch[1] : css;
  const tokens: { name: string; value: string }[] = [];
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    tokens.push({ name: m[1].trim(), value: m[2].trim() });
  }
  return tokens;
}

/** Extract the `## ` section headings (the rule groups) from guardrails.mdx. */
function readGuardrailSections(mdPath: string): string[] {
  if (!fs.existsSync(mdPath)) return [];
  return fs
    .readFileSync(mdPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.startsWith("## "))
    .map((l) => l.replace(/^##\s+/, "").trim());
}

interface QueueCard {
  id: string;
  type: string;
  status: string;
  filePath?: string;
  proposed?: string;
  context?: string;
  requestedAt?: string;
  [k: string]: unknown;
}

function readCards(queuePath: string): QueueCard[] {
  if (!fs.existsSync(queuePath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(queuePath, "utf8"));
    return Array.isArray(parsed.cards) ? (parsed.cards as QueueCard[]) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// design_get
// ---------------------------------------------------------------------------

export const designGetDefinition: ToolDefinition = {
  name: "design_get",
  description:
    "Read the design system as an object: the DESIGN.md brief, the guardrail rule " +
    "groups from design/guardrails.mdx, the tokens from design/tokens.css, and a " +
    "health summary (whether a system is defined yet). Use this to understand the " +
    "rules a change must follow before touching UI. Returns `defined: false` when " +
    "no design/ folder exists yet (run /design-audit or /design-interview first).",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const designGetHandler: ToolHandler = async (_args, projectRoot) => {
  const dir = path.join(projectRoot, DESIGN_DIR);
  const defined = fs.existsSync(dir);

  if (!defined) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          defined: false,
          message:
            "No design system yet. Run `/design-audit` (existing repo) or " +
            "`/design-interview` (from scratch) to create design/.",
        }, null, 2),
      }],
    };
  }

  const briefPath = path.join(dir, "DESIGN.md");
  const brief = fs.existsSync(briefPath) ? fs.readFileSync(briefPath, "utf8").trim() : null;
  const guardrails = readGuardrailSections(path.join(dir, "guardrails.mdx"));
  const tokens = readTokens(path.join(dir, "tokens.css"));

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        defined: true,
        brief,
        guardrails: { ruleGroups: guardrails, file: "design/guardrails.mdx" },
        tokens: { count: tokens.length, values: tokens },
      }, null, 2),
    }],
  };
};

// ---------------------------------------------------------------------------
// design_list_proposals
// ---------------------------------------------------------------------------

export const designListProposalsDefinition: ToolDefinition = {
  name: "design_list_proposals",
  description:
    "List design-system proposals waiting on a human in the HITL feed " +
    "(.systemix/queue.json). These are audit/interview/guardrail changes an agent " +
    "proposed but must not apply until approved. Optionally filter by status " +
    "(defaults to 'pending'). Returns id, type, target file, summary, and status.",
  inputSchema: {
    type: "object",
    properties: {
      status: {
        type: "string",
        description: "Filter by status: 'pending', 'approved', 'rejected', 'deferred'. Defaults to 'pending'.",
      },
    },
  },
};

export const designListProposalsHandler: ToolHandler<{ status?: string }> = async (args, projectRoot) => {
  const status = args.status ?? "pending";
  const cards = readCards(path.join(projectRoot, QUEUE_FILE))
    .filter((c) => c.type === "design-proposal")
    .filter((c) => c.status === status);

  const summary = cards.map((c) => ({
    id: c.id,
    type: c.type,
    file: c.filePath ?? null,
    proposed: c.proposed ?? null,
    summary: c.context ?? null,
    status: c.status,
    requestedAt: c.requestedAt ?? null,
  }));

  return {
    content: [{
      type: "text",
      text: cards.length === 0
        ? `No design proposals with status '${status}'.`
        : JSON.stringify({ count: cards.length, proposals: summary }, null, 2),
    }],
  };
};
